import { useContext } from "react";
import { updateState } from "./context/context";
import { SingleValue } from "react-select";
import { updateProvider } from "./transaction";
import { Network } from "./networks";
import { ethers, Transaction } from "ethers";

export const enum Screen {
  Welcome = "none",
  AccountPermission = "account_permission",
  SyncAddress = "sync_address",
  QrToSign = "sign",
  QrToRead = "scan_qr_to_send",
  SendToChain = "send_to_chain",
  Send = "send",
  SendReview = "send_review",
  SwitchChain = "switch_chain",
  Loading = "loading",
  DappTxReview = "dapp_tx_review",
  QrToSignDapp = "qr_to_sign_dapp",
}

export async function changeScreen(screen: Screen) {
  await updateState((currentState) => {
    currentState.source = screen;
    return currentState;
  });
}

export function goToSignScreenWithQr(data: string) {
  chrome.storage.local
    .set({ signData: data })
    .then(async () => await changeScreen(Screen.QrToSign));
}
