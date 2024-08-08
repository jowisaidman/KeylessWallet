import { createContext } from "react";
import { Screen } from "../utils/navigation";

export const WalletStateKey = "walletState";

export type IWalletContext = {
    source: Screen,
};


export function getSavedState(): IWalletContext  {
  let newState = { source: Screen.SyncAddress };
  chrome.storage.sync.get([WalletStateKey], (result) => {
    if (!result[WalletStateKey]) {
      chrome.storage.sync.set({ [WalletStateKey] : newState });
    } else {
      newState = result[WalletStateKey];
    }
  });

  return newState;
}

export const WalletContext = createContext<IWalletContext>(getSavedState());
