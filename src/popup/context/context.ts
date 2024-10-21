// The wallet context is tightly related with the keys saved in chrome.local.storage
//
// The state can be changed from other places than the popup (i.e: the content script)
// The WalletContext puts in a context the state of the whole extension.

import { createContext } from "react";
import { Screen } from "../navigation";
import { Network, networks } from "../networks";
import { TransactionItem } from "../../utils/transaction";
import {
  SOURCE,
  CURRENT_ACCOUNT,
  NETWORK,
  CONNECTED_DAPPS,
  TRANSACTION_HISTORY,
  SAVED_STATE_KEYS,
} from "../../storage";

export type IWalletContext = {
  [SOURCE]: Screen;
  [CURRENT_ACCOUNT]?: {
    type: string;
    address: string;
    avatar: string;
    label?: string;
  };
  [NETWORK]: Network;
  [CONNECTED_DAPPS]: {
    [url: string]: string[];
  };
  [TRANSACTION_HISTORY]: {
    [address: string]: {
      [chainId: number]: TransactionItem[];
    };
  };
};

export const DefaultContext: IWalletContext = {
  [SOURCE]: Screen.Welcome,
  [NETWORK]: networks[0],
  [CONNECTED_DAPPS]: {},
  [TRANSACTION_HISTORY]: {},
};

export async function getSavedState(): Promise<IWalletContext> {
  let newState = DefaultContext;
  let result = await chrome.storage.local.get(SAVED_STATE_KEYS);
  for (let key of SAVED_STATE_KEYS) {
    // console.log(key, result[key], newState[key as keyof IWalletContext]);
    if (result[key] != null) {
      newState[key as keyof IWalletContext] = result[key];
    }
  }

  return newState;
}

// Updates the persisted state
export async function updateState(f: (c: IWalletContext) => IWalletContext) {
  let currentState = await getSavedState();
  let newState = f(currentState);
  await chrome.storage.local.set({ ...newState });
}

export const WalletContext = createContext<IWalletContext>(DefaultContext);
