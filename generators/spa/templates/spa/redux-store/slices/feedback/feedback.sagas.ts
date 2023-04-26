import { Action } from "redux";
import { put, takeEvery, delay, take, call, race } from "redux-saga/effects";
import { actions } from "@/spas/<%= spaFolderName %>/redux-store/slices";

function* closeFeedbackTask() {
  yield delay(5000);
  yield put(actions.closeFeedback());
}

export function* closeFeedbackSaga() {
  yield takeEvery(actions.setFeedback.type, function* () {
    yield race({
      task: call(closeFeedbackTask),
      cancel: take(actions.setFeedback.type),
    });
  });
}

export function* ajaxSuccessFeedbackSaga() {
  yield takeEvery(
    (action: Action) => /^apis\/(.*?)\/success$/.test(action.type),
    function* (action: any) {
      if (action?.payload?.data?.message) {
        switch (action.type) {
          default:
            yield put(
              actions.setFeedback({
                type: "success",
                message: action.payload.data.message,
              }),
            );
        }
      }
    },
  );
}

export function* ajaxFailFeedbackSaga() {
  yield takeEvery(
    (action: Action) => /^apis\/(.*?)\/fail$/.test(action.type),
    function* (action: any) {
      switch (action.type) {
        default:
          yield put(
            actions.setFeedback({
              type: "error",
              message: action.payload.message,
            }),
          );
      }
    },
  );
}
