import * as React from "react";
import type { MapStateToProps, MapDispatchToProps } from "react-redux";

type myAction = (payload: any) => void;

const defaultMergeProps = (...sources: Array<unknown>) =>
  Object.assign({}, ...sources);

// Applies a function
function apply(object: Record<string, any>, iteratee: (value: any) => any) {
  const myEntries = Object.entries(object).map(([key, value]) => [
    key,
    iteratee(value)
  ]);
  return Object(myEntries);
}

export function mockConnect<State>(
  getDispatch: () => jest.Mock,
  getState: () => State
) {
  // mockConnect is a function which returns a mock of the react-redux HOC connect,

  return function <
    OwnProps,
    StateProps,
    DispatchProps extends Record<string, myAction>
  >(
    mapStateToProps?: MapStateToProps<StateProps, OwnProps, State>,
    mapDispatchToProps?: MapDispatchToProps<DispatchProps, OwnProps>,
    mergeProps = defaultMergeProps
    // mocking options is not needed
  ) {
    // To be added to component props
    const createStateProps = (ownProps: OwnProps) =>
      mapStateToProps?.(getState(), ownProps) ?? {};

    // to be added to component props
    const createDispatchProps = (ownProps: OwnProps) => {
      if (!mapDispatchToProps) {
        return {};
      }

      const dispatch = getDispatch();

      // mapDispatchToProps can be a function or an object, manage the 2 cases
      return mapDispatchToProps instanceof Function
        ? mapDispatchToProps(dispatch, ownProps)
        : apply(
            mapDispatchToProps,
            (action): myAction => payload => dispatch(action(payload))
          );
    };

    return function mockConnectComponent(Component: React.ComponentType<any>) {
      return function MockConnectedComponent(ownProps: OwnProps) {
        return (
          <Component
            {...mergeProps(
              createStateProps(ownProps),
              createDispatchProps(ownProps),
              ownProps
            )}
          />
        );
      };
    };
  };
}
