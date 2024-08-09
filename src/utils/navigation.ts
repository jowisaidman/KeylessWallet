import { useContext } from "react";
import { WalletContext, updateState } from "../context/context";

export const enum Screen {
  Welcome = "none",
  SyncAddress = "sync_address",
}

export function watchAddress() {
  let baseUrl = "";
  let chainId = 11155111;

  if (chainId == 11155111) baseUrl = "https://eth-sepolia.blockscout.com/address";

  let address = "0x9A85ed0190C0946C7aF69C11c184A1598199d0c3";
  
  var newURL = `${baseUrl}/${address}`;

  chrome.tabs.create({ url: newURL });
}

export function changeScreen(screen: Screen) {
  updateState((currentState) => {
    currentState.source = screen;
    return currentState;
  });
}
