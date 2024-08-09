import { useContext } from "react";
import { updateState } from "../context/context";

export const enum Screen {
  Welcome = "none",
  SyncAddress = "sync_address",
}

export async function changeScreen(screen: Screen) {
  await updateState((currentState) => {
    console.log("current state", currentState);
    currentState.source = screen;
    return currentState;
  });
}
