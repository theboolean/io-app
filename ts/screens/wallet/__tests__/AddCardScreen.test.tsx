import { fromNullable } from "fp-ts/lib/Either";
import React from "react";
import { render } from "@testing-library/react-native";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import AddCardScreen from "../AddCardScreen";
import configureStoreAndPersistor from "../../../boot/configureStoreAndPersistor";

jest.mock("react-native-background-timer", () => ({
  BackgroundTimer: { setTimeout: jest.fn },
  startTimer: jest.fn()
}));
jest.mock("react-native-share", () => ({
  open: jest.fn()
}));

it("rendersCorrectly", () => {
  const { store, persistor } = configureStoreAndPersistor();

  const navigation: any = {
    navigate: jest.fn(),
    state: {
      params: {
        inPayment: fromNullable(null),
        keyFrom: "id-1603703747027-2"
      },
      routeName: "WALLET_ADD_CARD",
      key: "id-1603703747027-8"
    },
    router: undefined,
    actions: {}
  };

  const { toJSON } = render(
    <Provider store={store}>
      <PersistGate loading={undefined} persistor={persistor}>
        <AddCardScreen navigation={navigation} />
      </PersistGate>
    </Provider>
  );
  expect(toJSON()).toMatchSnapshot();
});
