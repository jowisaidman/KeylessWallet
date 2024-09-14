import { useContext } from "react";
import { updateState } from "../context/context";
import { SingleValue } from "react-select";
import { updateProvider } from "./transaction";
import { ethers, Transaction } from "ethers";

export const enum Screen {
  Welcome = "none",
  AccountPermission = "account_permission",
  SyncAddress = "sync_address",
  QrToSign = "sign",
  QrToRead = "scan_qr_to_send",
  SendToChain = "send_to_chain",
  Send = "send",
  Loading = "loading",
}

export async function changeNetwork(
  network: SingleValue<{ value: string; label: string }>
) {
  console.log("changeNetwork", network);
  await updateState((currentState) => {
    if (network !== null) {
      currentState.network = network;
    }
    return currentState;
  });
  if (network !== null && network.value !== undefined) {
    updateProvider(network.value);
  }
}

export function watchAddress(
  address: string | undefined,
  chainId: string | undefined
) {
  let baseUrl = "";

  console.log("chainId", chainId);
  console.log("address", address);

  if (chainId == "1") baseUrl = "https://eth.blockscout.com/";
  else if (chainId == "11155111")
    baseUrl = "https://eth-sepolia.blockscout.com";
  else if (chainId == "8453") baseUrl = "https://base.blockscout.com/";
  else if (chainId == "84532") baseUrl = "https://base-sepolia.blockscout.com/";

  var newURL = `${baseUrl}/address/${address}`;

  chrome.tabs.create({ url: newURL });
}

export function watchTransaction(
  raw: string | null,
  chainId: string | undefined
) {
  let baseUrl = "";

  console.log("chainId", chainId);
  console.log("raw", raw);

  let txHash = Transaction.from(raw!).hash;

  if (chainId == "1") baseUrl = "https://eth.blockscout.com/";
  else if (chainId == "11155111")
    baseUrl = "https://eth-sepolia.blockscout.com";
  else if (chainId == "8453") baseUrl = "https://base.blockscout.com/";
  else if (chainId == "84532") baseUrl = "https://base-sepolia.blockscout.com/";

  var newURL = `${baseUrl}/tx/${txHash}`;

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
