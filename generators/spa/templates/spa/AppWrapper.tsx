import React, { memo, ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor, history } from "redux-store";
import { ConnectedRouter } from "connected-react-router";

const AppWrapper: React.FC<{ children: ReactNode }> = (props) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div />} persistor={persistor}>
        <ConnectedRouter history={history}>{props.children}</ConnectedRouter>
      </PersistGate>
    </Provider>
  );
};

export default memo(AppWrapper);
