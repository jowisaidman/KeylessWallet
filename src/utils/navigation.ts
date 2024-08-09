import { useContext } from "react";
import { WalletContext, updateState } from "../context/context";

export const enum Screen {
  Welcome = "none",
  SyncAddress = "sync_address",
}

export function changeScreen(screen: Screen) {
  updateState((currentState) => {
    currentState.source = screen;
    return currentState;
  });
}
