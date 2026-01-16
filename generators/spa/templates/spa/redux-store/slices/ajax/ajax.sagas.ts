import {
  takeEvery,
  fork,
  take,
  put,
  delay,
  race,
  call,
} from "redux-saga/effects";
import { Action } from "redux";
import axios, { CancelTokenSource, AxiosError } from "axios";
import { ApiRequestAction } from "@/spas/<%= spaFolderName %>/redux-store/extra-actions/apis/api-builder";
import { apiBaseUrl } from "@/spas/<%= spaFolderName %>/config";
import { actions } from "@/spas/<%= spaFolderName %>/redux-store/slices";
import domNavigation from "@/models/client/DomNavigation";

function* ajaxTask(
  requestAction: ApiRequestAction<any>,
  cancelToken: CancelTokenSource,
): any {
  const { type, payload } = requestAction;
  const { params, options, prepareParams } = payload;
  const { path, method, body, query } = params;
  const api = type.replace("/request", "");
  const skipRedux = options?.skipRedux;

  if (!skipRedux) {
    yield put(
      actions.setApiLoading({
        api,
        isLoading: true,
      }),
    );
  }

  try {
    if (options?.requestDelay) {
      const { timeout } = yield race({
        delay: delay(options.requestDelay),
        timeout: take(type),
      });
      if (timeout) {
        return;
      }
    }

    const { response } = yield race({
      response: axios({
        url: options?.absolutePath ? path : `${apiBaseUrl()}${path}`,
        method,
        data: body,
        params: query,
        cancelToken: cancelToken.token,
      }),
      timeout: take(type),
    });

    if (response) {
      const successPayload = {
        status: response?.status,
        data: response?.data,
        prepareParams,
      };
      if (!skipRedux) {
        yield put({
          type: `${api}/success`,
          payload: successPayload,
        });
        yield put(
          actions.setApiLoading({
            api,
            isLoading: false,
          }),
        );
      }
      if (requestAction.deferred) {
        requestAction.deferred.resolve(successPayload);
      }
    } else {
      cancelToken.cancel();
    }
  } catch (e) {
    const axiosError = e as AxiosError;
    if (!axios.isCancel(axiosError)) {
      const status = axiosError?.response?.status || 500;
      const message: string =
        axiosError?.response?.data?.message || axiosError.message;
      const failPayload = {
        status,
        message,
        prepareParams,
      };
      if (!skipRedux) {
        yield put({
          type: `${api}/fail`,
          payload: failPayload,
        });
        yield put(
          actions.setApiLoading({
            api,
            isLoading: false,
          }),
        );
      }
      if (requestAction.deferred) {
        requestAction.deferred.reject(failPayload);
      }
      if (status === 401) {
        // Avoid redirect loop if already on login page
        if (!window.location.pathname.includes("/login") && !window.location.search.includes("redirect")) {
          const redirectPath = `${window.location.pathname.replace(
            "app/",
            "",
          )}${window.location.search}`;
          domNavigation.navigate(
            `/app/login?redirect=${encodeURIComponent(redirectPath)}`,
          );
        }
        yield put(actions.clearSession());
      }
    }
  }
}

export function* ajaxRequestSaga() {
  yield takeEvery(
    (action: Action) => /^apis\/(.*?)\/request$/.test(action.type),
    function* (requestAction: ApiRequestAction<any>) {
      try {
        const { type } = requestAction;
        const api = type.replace("/request", "");
        const cancelToken = axios.CancelToken.source();
        const skipRedux = requestAction.payload.options?.skipRedux;

        if (skipRedux) {
          yield call(ajaxTask, requestAction, cancelToken);
          return;
        }

        const task: any = yield fork(ajaxTask, requestAction, cancelToken);
        let exit = false;

        while (!exit) {
          const resultAction: Action = yield take([
            `${api}/success`,
            `${api}/fail`,
            `${api}/cancel`,
          ]);

          if (
            resultAction.type === `${api}/cancel` &&
            task &&
            task.isRunning()
          ) {
            cancelToken.cancel("Canceled");
          }

          exit = true;
        }
      } catch (e) {
        console.error(e);
      }
    }
  );
}
