import { createContext } from "react";
import { Screen } from "../utils/navigation";

// Persisted state keys
// These are keys from chrome.storage.local
export const SOURCE = "source";
export const CURRENT_ACCOUNT = "currentAccount";

export type IWalletContext = {
  source: Screen;
  currentAccount?: {
    type: string;
    address: string;
  };
};

export const DefaultContext: IWalletContext = {
  source: Screen.Welcome,
};

export async function getSavedState(): Promise<IWalletContext> {
  let newState = DefaultContext;
  await chrome.storage.local.get([SOURCE, CURRENT_ACCOUNT], async (result) => {
    if (result[SOURCE] != null) {
      newState[SOURCE] = result[SOURCE];
    }

    if (result[CURRENT_ACCOUNT] != null) {
      newState[CURRENT_ACCOUNT] = result[CURRENT_ACCOUNT];
    }
  });

  return newState;
}

// Updates the persisted state
export async function updateState(f: (c: IWalletContext) => IWalletContext) {
  let currentState = await getSavedState();
  let newState = f(currentState);
  await chrome.storage.local.set({ ...newState });
}

export const WalletContext = createContext<IWalletContext>(DefaultContext);
