/**
 * Reducers, states, selectors and guards for the transactions
 */
import * as pot from "italia-ts-commons/lib/pot";
import { values } from "lodash";
import { createSelector } from "reselect";
import { getType } from "typesafe-actions";

import { isSuccessTransaction, Transaction } from "../../../types/pagopa";
import { Action } from "../../actions/types";
import {
  fetchTransactionsFailure,
  fetchTransactionsRequest,
  fetchTransactionsSuccess,
  readTransaction
} from "../../actions/wallet/transactions";
import { IndexedById, toIndexed } from "../../helpers/indexer";
import { GlobalState } from "../types";

/**
 * The transactions selector will truncate the list at this length
 */
const MAX_TRANSACTIONS_IN_LIST = 50;

export type TransactionsState = Readonly<{
  transactions: pot.Pot<IndexedById<Transaction>, Error>;
  read: Set<number>
}>;

// added list of read trans IDs
const TRANSACTIONS_INITIAL_STATE: TransactionsState = {
  transactions: pot.none,
  read: new Set<number>()
};

// selectors
export const getTransactions = (state: GlobalState) =>
  pot.map(
    state.wallet.transactions.transactions,
    txs =>
      values(txs).filter(
        _ => _ !== undefined && isSuccessTransaction(_)
      ) as ReadonlyArray<Transaction>
  );

// filter only unread transactions to account for the residual number
export const getUnreadTransactions = (state: GlobalState) =>
  pot.map(
    state.wallet.transactions.transactions,
    txs =>
      values(txs).filter(
        _ => _ !== undefined && !isReadTransaction(state, _.id)
      ) as ReadonlyArray<Transaction> // ridurre a array di ID
  );

/**
 * Search in list of transactions read, the transaction 
 * in exam and return thus if read transaction or not
 */
export const isReadTransaction = (state: GlobalState, txid: number) => (state.wallet.transactions.read.has(txid) );


export const getWalletTransactionsCreator = (idWallet: number) => (
  state: GlobalState
) =>
  pot.map(getTransactions(state), tsx =>
    tsx.filter(_ => _.idWallet === idWallet)
  );

export const latestTransactionsSelector = createSelector(
  getTransactions,
  potTransactions =>
    pot.map(
      potTransactions,
      transactions =>
        [...transactions]
          .sort(
            (a, b) =>
              // FIXME: code here is checking for NaN assuming creation dates may
              //        be undefined, but since we override the pagopa Wallet
              //        type to force creation dates to always be defined and we
              //        use that new type for parsing responses, we ignore
              //        wallets with undefined creation dates... so the check
              //        is unnecessary.
              // tslint:disable-next-line:no-useless-cast
              isNaN(a.created as any) || isNaN(b.created as any)
                ? -1 // define behavior for undefined creation dates (pagoPA allows these to be undefined)
                : b.created.toISOString().localeCompare(a.created.toISOString())
          )
          .filter(t => t.statusMessage !== "rifiutato")
          .slice(0, MAX_TRANSACTIONS_IN_LIST) // WIP no magic numbers
    )
);

// reducer
const reducer = (
  state: TransactionsState = TRANSACTIONS_INITIAL_STATE,
  action: Action
): TransactionsState => {
  switch (action.type) {
    case getType(fetchTransactionsRequest):
      return {
        ...state,
        transactions: pot.toLoading(state.transactions)
      };

    case getType(fetchTransactionsSuccess):
      return {
        ...state,
        transactions: pot.some(toIndexed(action.payload, _ => _.id))
      };

    case getType(fetchTransactionsFailure):
      return {
        ...state,
        transactions: pot.toError(state.transactions, action.payload)
      };

    case getType(readTransaction):
      return {
        ...state,
        read: state.read.add(action.payload.id)
      };

    default:
      return state;
  }
};

export default reducer;
