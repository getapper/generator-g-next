import React, { memo } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, {
  persistor,
  history,
} from "spas/<%= spaFolderName %>/redux-store";
import { ConnectedRouter } from "connected-react-router";
import App from "./App";

const TestAppWrapper = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div />} persistor={persistor}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  );
};

export default memo(TestAppWrapper);
