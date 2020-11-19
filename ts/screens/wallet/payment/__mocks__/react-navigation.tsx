// Mocked version of react navigation
import React from "react";

// Doesn't require navigation injected props
function mockWithNavigation(Component: any) {
  return (props: any) => (
    <Component
      navigation={{ navigate: jest.fn(), getParam: jest.fn() }}
      {...props}
    />
  );
}

const withNavigation = mockWithNavigation;
const StackActions = { reset: jest.fn() };
const NavigationActions = {
  navigate: jest.fn(),
  init: jest.fn()
};
const NavigationEvents = "mockNavigationEvents";
const useNavigation = () => jest.fn();
const navigateBack = () => jest.fn();
const createStackNavigator = () => jest.fn();
const createBottomTabNavigator = () => jest.fn();
const AppNavigator = {
  router: {
    getStateForAction: jest.fn()
  }
};
export {
  createStackNavigator,
  withNavigation,
  StackActions,
  NavigationActions,
  NavigationEvents,
  useNavigation,
  navigateBack,
  createBottomTabNavigator,
  AppNavigator
};
// Best way to mock navigation prop, but relies on react-navigation 5.0 :-(
// https://medium.com/@dariaruckaolszaska/testing-your-react-navigation-5-hooks-b8b8f745e5b6

// Relies on @react-navigation (scoped package) not on react-navigation
// which have different versions
/* 
  const Stack = createStackNavigator();
  const MockedNavigator = ({ component, params = {} }: any) => (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MockedScreen"
          component={component}
          initialParams={params}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ); 
  */
