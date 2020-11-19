import React from "react";
import { render } from "@testing-library/react-native";
import "@testing-library/jest-dom/extend-expect";

// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
import { mockReactRedux } from "mock-react-redux";

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

// Jest Configuration
jest.useFakeTimers();

jest.mock("react-navigation");
jest.mock("../../../../navigation/AppNavigator", () => ({
  router: {
    getStateForAction: jest.fn()
  }
}));
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

  it("Should render correctly", () => {
    mockReactRedux().state(initState); // disconnect the component from the store
    const myMockNav = mockNavigation(params, jest.fn());
    const { toJSON } = render(
      <ConfirmPaymentMethodScreen navigation={myMockNav} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
