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
  source: Screen.Welcome,
};

export async function getSavedState(): Promise<IWalletContext> {
  let newState = { [WalletStateKey]: DefaultContext };
  await chrome.storage.local.get(WalletStateKey, async (result) => {
    if (result[WalletStateKey] == null) {
        console.log("aaaaaaaaaaaaaaaaaaaa");
      await chrome.storage.local.set({ [WalletStateKey]: newState });
    } else {
        console.log("current state from saved", result[WalletStateKey]);
      newState = result[WalletStateKey];
    }
  });

  return newState[WalletStateKey];
}

// Updates the persisted state
export async function updateState(f: (c: IWalletContext) => IWalletContext) {
  let currentState = await getSavedState();
  let newState = f(currentState);
  console.log("old state", currentState, "new state", newState);
  await chrome.storage.local.set({ [WalletStateKey]: newState });
}

export const WalletContext = createContext<IWalletContext | null>(null);
