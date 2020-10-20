import { getType } from "typesafe-actions";
import { WalletV2 } from "../../../../../../../definitions/pagopa/bancomat/WalletV2";
import { Action } from "../../../../../../store/actions/types";
import { GlobalState } from "../../../../../../store/reducers/types";
import {
  remoteError,
  remoteLoading,
  remoteReady,
  remoteUndefined,
  RemoteValue
} from "../../../../../bonus/bpd/model/RemoteValue";
import { addBancomatToWallet } from "../actions";
import { Card } from "../../../../../../../definitions/pagopa/bancomat/Card";

export type AddingPansState = {
  addingResult: RemoteValue<WalletV2, Error>;
  selectedPan?: Card;
};

const initialState: AddingPansState = {
  addingResult: remoteUndefined
};

const addingPansReducer = (
  state: AddingPansState = initialState,
  action: Action
): AddingPansState => {
  switch (action.type) {
    case getType(addBancomatToWallet.request):
      return {
        selectedPan: action.payload,
        addingResult: remoteLoading
      };
    case getType(addBancomatToWallet.success):
      return {
        ...state,
        addingResult: remoteReady(action.payload)
      };
    case getType(addBancomatToWallet.failure):
      return {
        ...state,
        addingResult: remoteError(action.payload)
      };
  }
  return state;
};

export const onboardingBancomatChosenPanSelector = (
  state: GlobalState
): Card | undefined => state.wallet.onboarding.bancomat.addingPans.selectedPan;

export const onboardingBancomatAddingResultSelector = (
  state: GlobalState
): RemoteValue<WalletV2, Error> =>
  state.wallet.onboarding.bancomat.addingPans.addingResult;

export default addingPansReducer;