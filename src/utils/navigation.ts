import { useContext } from "react";
import { updateState } from "../context/context";

export const enum Screen {
  Welcome = "none",
  SyncAddress = "sync_address",
  QrToSign = "sign",
  QrToRead = "scan_qr_to_send",
}

export function watchAddress() {
  let baseUrl = "";
  let chainId = 11155111;

  if (chainId == 11155111)
    baseUrl = "https://eth-sepolia.blockscout.com/address";

  let address = "0x9A85ed0190C0946C7aF69C11c184A1598199d0c3";

  var newURL = `${baseUrl}/${address}`;

  chrome.tabs.create({ url: newURL });
}

export function checkContractVerification() {
  let baseUrl = "";
  let chainId = 11155111;

  if (chainId == 11155111) baseUrl = "https://eth.blockscout.com/";

  let address = "0x9A85ed0190C0946C7aF69C11c184A1598199d0c3";

  var newURL = `${baseUrl}/?module=contract&action=getsourcecode&address=${address}`;

  fetch(newURL)
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data here
      if (data.ABI == null || data.ABI == "") {
        console.log("Contract not verified");
      } else {
        console.log("Contract verified");
      }
    })
    .catch((error) => {
      // Handle any errors that occur during the request
      console.log(`Error: ${error}`);
    });
}

export async function changeScreen(screen: Screen) {
  await updateState((currentState) => {
    console.log("=>", currentState);
    currentState.source = screen;
    return currentState;
  });
}

export function goToSignScreenWithQr(data: string) {
  chrome.storage.local
    .set({ signData: data })
    .then(async () => await changeScreen(Screen.QrToSign));
}
