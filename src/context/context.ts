import { createContext } from "react";
import { Screen } from "../utils/navigation";

// Persisted state keys
// These are keys from chrome.storage.local
export const SOURCE = "source";
export const CURRENT_ACCOUNT = "currentAccount";
export const NETWORK = "network";
export const CONNECTED_DAPPS = "connectedDapps";

export type IWalletContext = {
  source: Screen;
  currentAccount?: {
    type: string;
    address: string;
  };
  network: {
    value: string;
    label: string;
  };
  // List of connected dApps
  // as key it is the dApp url
  // as value the list of addresses connected
  connectedDapps: {
    [dapp: string]: string[];
  };
};

export const DefaultContext: IWalletContext = {
  [SOURCE]: Screen.Welcome,
  [NETWORK]: { value: "84532", label: "Base Sepolia" },
  [CONNECTED_DAPPS]: {},
};

export async function getSavedState(): Promise<IWalletContext> {
  let newState = DefaultContext;
  await chrome.storage.local.get(
    [SOURCE, CURRENT_ACCOUNT, NETWORK, CONNECTED_DAPPS],
    async (result) => {
      if (result[SOURCE] != null) {
        newState[SOURCE] = result[SOURCE];
      }

      if (result[CURRENT_ACCOUNT] != null) {
        newState[CURRENT_ACCOUNT] = result[CURRENT_ACCOUNT];
      }

      if (result[NETWORK] != null) {
        newState[NETWORK] = result[NETWORK];
      }

      if (result[CONNECTED_DAPPS] != null) {
        newState[CONNECTED_DAPPS] = result[CONNECTED_DAPPS];
      }
    }
  );

  return newState;
}

// Updates the persisted state
export async function updateState(f: (c: IWalletContext) => IWalletContext) {
  let currentState = await getSavedState();
  let newState = f(currentState);
  await chrome.storage.local.set({ ...newState });
}

export const WalletContext = createContext<IWalletContext>(DefaultContext);
