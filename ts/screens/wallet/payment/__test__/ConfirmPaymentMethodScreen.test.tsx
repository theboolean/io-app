// import { fromNullable } from "fp-ts/lib/Either";
// import * as pot from "italia-ts-commons/lib/pot";
import { debug } from "console";
import React from "react";
import { render } from "@testing-library/react-native";
import "@testing-library/jest-dom/extend-expect";

// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
import { mockReactRedux } from "mock-react-redux";
import { createAppContainer } from "react-navigation";
import { createStore } from "redux";

import { navigateToPaymentConfirmPaymentMethodScreen } from "../../../../store/actions/navigation";

import ConfirmPaymentMethodScreen from "../ConfirmPaymentMethodScreen";
import {
  getGlobalState,
  myRptId,
  myInitialAmount,
  myVerifiedData,
  myWallet,
  myPsp,
  mockNavigation
} from "../../../../utils/tests";
import { renderWithRedux } from "../../../../utils/testWrapper";
import WalletNavigator from "../../../../navigation/WalletNavigator";
import { appReducer } from "../../../../store/reducers/";

// Jest Configuration
jest.useFakeTimers();

// Navigation mock (It's a custom mock. In particular mocks useNavigation hook)
// jest.mock("react-navigation");

jest.mock("react-native-share", () => jest.fn());
jest.mock("react-native-device-info", () => ({
  getReadableVersion: jest
    .fn()
    .mockReturnValueOnce("1.1.3")
    .mockReturnValueOnce("1.1.9")
    .mockReturnValueOnce("1.2.3.4"),
  getVersion: jest
    .fn()
    .mockReturnValueOnce("1.1.3")
    .mockReturnValueOnce("1.1.9")
    .mockReturnValueOnce("1.2.3.4"),
  getBuildNumber: () => 3
}));

// automock
// jest.mock("pretty-format");
jest.unmock("react-navigation");

describe("", () => {
  const initState = getGlobalState();
  const params = {
    rptId: myRptId,
    initialAmount: myInitialAmount,
    verifica: myVerifiedData,
    idPayment: "hjkdhgkdj",
    wallet: myWallet,
    psps: [myPsp]
  };

  it("Integration Test. Should navigate to the right page", async () => {
    const App = createAppContainer(WalletNavigator);
    const myStore = createStore(appReducer, initState);
    const MyObj = renderWithRedux(<App />, {
      initialState: initState,
      store: myStore
    });

    const myElemsBefore = MyObj.getAllByText(/.*/);
    debug("Before: ", myElemsBefore[5].props);
    myElemsBefore.map(element => {
      debug(element.props);
    });
    myStore.dispatch(navigateToPaymentConfirmPaymentMethodScreen(params));

    const myElemsAfter = MyObj.getAllByText(/Press/i);
    debug("After: ", myElemsAfter[5].props);
  });

  it("Should render correctly", () => {
    jest.mock("react-navigation");
    mockReactRedux().state(initState); // disconnect the component from the store
    const myMockNav = mockNavigation(params, jest.fn());
    const { toJSON } = render(
      <ConfirmPaymentMethodScreen navigation={myMockNav} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
/*
  test("Should Change Credit Card Owner on User Input", () => {
    // Useless Test. Just to show how to use the library
    mockReactRedux().state(initState); // disconnect the component from the store
    const { getByPlaceholderText } = render(
      <AddCardScreen navigation={navigation} />
    );
    // Check in the snapshot a good value to search for, but be aware of locales!
    const owner = getByPlaceholderText(/John Doe/);
    fireEvent.changeText(owner, "Aulo Agerio");
    expect(owner.props.value).toEqual("Aulo Agerio");
  });

  test("Should Update Icon When User Inserts a PAN of a Supported Brand", () => {
    mockReactRedux().state(initState); // disconnect the component from the store
    const { getByPlaceholderText, getAllByA11yLabel } = render(
      <AddCardScreen navigation={navigation} />
    );
    const pan = getByPlaceholderText(/0000 0000 0000 0000/);

    fireEvent.changeText(pan, "4012888888881881"); // visa
    const fields = getAllByA11yLabel(/labelled-item-icon/);
    const regExp = new RegExp(/visa/);
    const match = fields.find(items => regExp.test(items.props.source.testUri));
    expect(match).toBeTruthy();
  });
});
*/
