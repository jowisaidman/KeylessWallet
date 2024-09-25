import { createContext } from "react";
import { Screen } from "../navigation";

// Persisted state keys
// These are keys from chrome.storage.local
export const SOURCE = "source";
export const CURRENT_ACCOUNT = "currentAccount";
export const NETWORK = "network";
export const CONNECTED_DAPPS = "connectedDapps";

export const SAVED_STATE_KEYS = [
  SOURCE,
  CURRENT_ACCOUNT,
  NETWORK,
  CONNECTED_DAPPS,
];

export type IWalletContext = {
  [SOURCE]: Screen;
  [CURRENT_ACCOUNT]?: {
    type: string;
    address: string;
  };
  [NETWORK]: {
    value: string;
    label: string;
  };
  [CONNECTED_DAPPS]: {
    [url: string]: string[];
  };
};

export const DefaultContext: IWalletContext = {
  [SOURCE]: Screen.Welcome,
  [NETWORK]: { value: "84532", label: "Base Sepolia" },
  [CONNECTED_DAPPS]: {},
};

export async function getSavedState(): Promise<IWalletContext> {
  let newState = DefaultContext;
  let result = await chrome.storage.local.get(SAVED_STATE_KEYS);
  for (let key of SAVED_STATE_KEYS) {
    console.log(key, result[key], newState[key as keyof IWalletContext]);
    if (result[key] != null) {
      newState[key as keyof IWalletContext] = result[key];
    }
  }

  console.log("new state!", newState);
  return newState;
}

// Updates the persisted state
export async function updateState(f: (c: IWalletContext) => IWalletContext) {
  let currentState = await getSavedState();
  let newState = f(currentState);
  await chrome.storage.local.set({ ...newState });
}

export const WalletContext = createContext<IWalletContext>(DefaultContext);
