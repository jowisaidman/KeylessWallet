import { useContext } from "react";
import { WalletContext } from '../context/context';

export enum Screen {
  Welcome = "none",
  SyncAddress = "sync_address",
}

export function changeScreen(screen: Screen) {
    // const context = useContext(WalletContext);
    // context.source = screen;
    chrome.storage.sync.set({ source: screen });
}
