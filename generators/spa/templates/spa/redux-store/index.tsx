import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { all } from "redux-saga/effects";
import { actions, reducers, sagas, selectors } from "./slices";
import { Deferred } from "./extra-actions/apis/api-builder";

const rootSaga = function* () {
  yield all(sagas.map((s) => s()));
};
const sagaMiddleware = createSagaMiddleware();

const createRootReducer = () => combineReducers(reducers);
const rootReducer = createRootReducer();
const persistConfig = {
  key: "<%= spaName %>-root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [sagaMiddleware],
});
const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);

const baseDispatch = store.dispatch;
(store as any).dispatch = (action: any) => {
  if (/^apis\/.*?\/request$/.test(action.type)) {
    if (!action.deferred) {
      let resolve: (value: any) => void;
      let reject: (reason: any) => void;
      const promise = new Promise<any>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      const deferred: Deferred = {
        promise,
        resolve: resolve!,
        reject: reject!,
      };
      action.deferred = deferred;
    }
    baseDispatch(action);
    return action.deferred.promise;
  }
  return baseDispatch(action);
};

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export default store;
export { actions, persistor, selectors };
