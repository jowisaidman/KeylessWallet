import { createContext } from "react";
import { Screen } from "../utils/navigation";

export const WalletStateKey = "walletPersistedState";

export type IWalletContext = {
  source: Screen;
};

export const DefaultContext: IWalletContext = {
  source: Screen.SyncAddress,
};

export function getSavedState(): IWalletContext {
  let newState = { [WalletStateKey]: { source: Screen.SyncAddress } };
  chrome.storage.sync.get([WalletStateKey], (result) => {
    if (!result[WalletStateKey]) {
      console.log("1");
      chrome.storage.sync.set({ [WalletStateKey]: newState });
    } else {
      console.log("2");
      newState = result[WalletStateKey];
    }
  });

  return newState[WalletStateKey];
}

// Updates the persisted state
export function updateState(f: (c: IWalletContext) => IWalletContext) {
  let currentState = getSavedState();
  console.log({ [WalletStateKey]: f(currentState) });
  chrome.storage.sync.set({ [WalletStateKey]: f(currentState) });
}

export const WalletContext = createContext<IWalletContext>(getSavedState());
