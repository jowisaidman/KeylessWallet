import { createContext } from "react";
import { Screen } from "../utils/navigation";

export const WalletStateKey = "walletPersistedState";

export type IWalletContext = {
  source: Screen;
  currentAccount?: {
      type: string,
      address: string
  }
};

export const DefaultContext: IWalletContext = {
  source: Screen.SyncAddress,
};

export function getSavedState(): IWalletContext {
  let newState = { [WalletStateKey]: { source: Screen.SyncAddress } };
  chrome.storage.local.get([WalletStateKey], (result) => {
    if (result[WalletStateKey] == null) {
      chrome.storage.sync.set({ [WalletStateKey]: newState });
    } else {
        console.log("current state from saved", result[WalletStateKey]);
      newState = result[WalletStateKey];
    }
  });

  return newState[WalletStateKey];
}

// Updates the persisted state
export function updateState(f: (c: IWalletContext) => IWalletContext) {
  let currentState = getSavedState();
  chrome.storage.sync.set({ [WalletStateKey]: f(currentState) });
}

export const WalletContext = createContext<IWalletContext>(getSavedState());
