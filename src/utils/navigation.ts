import { useContext } from "react";
import { updateState } from "../context/context";

export const enum Screen {
  Welcome = "none",
  SyncAddress = "sync_address",
}

export function changeScreen(screen: Screen) {
  updateState((currentState) => {
      console.log("changing screen", currentState);
    currentState.source = screen;
    return currentState;
  });
}
