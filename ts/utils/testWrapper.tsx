import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react-native";
import { createAppContainer, NavigationContainer } from "react-navigation";

export const renderWithRedux = (
  ui: any,
  { initialState, store, ...renderOptions }: any = {}
) => {
  function Wrapper({ children }: any) {
    return <Provider store={store}>{children}</Provider>;
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export const renderWithNavRedux = (
  navContainer: NavigationContainer,
  { initialState, store, ...renderOptions }: any = {}
) => {
  const App = createAppContainer(navContainer);
  function Wrapper({ children }: any) {
    return <Provider store={store}>{children}</Provider>;
  }
  return render(<App />, {
    wrapper: Wrapper,
    ...renderOptions
  });
};
