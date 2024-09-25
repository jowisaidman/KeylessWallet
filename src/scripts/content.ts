import { Web3 } from "web3";
import {
  sendMessageToExtension,
  Command,
  BackgroundCommand,
  RpcCall,
} from "../communication";
import { NETWORK, CONNECTED_DAPPS, IWalletContext } from "../context/context";
import convertToHex from "../utils/convertToHex";

async function injectExtensionScript(url: string) {
  try {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL(url);
    script.async = false;
    script.type = "module";

    const node = document.head || document.documentElement;
    node.prepend(script);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Dispatches the response event to the injected script.
// The response can come from the popup, background script or from here (content script)
function dispatchResponseEvent(command: Command, detail: any) {
  const responseEvent = new CustomEvent(command.id, {
    detail,
  });
  window.dispatchEvent(responseEvent);
}

// Gets an specific key from the current state of the wallet
async function getCurrentStateValue(key: keyof IWalletContext): Promise<any> {
  let result = await chrome.storage.local.get([key]);
  return result[key];
}

// Gets an specific key from the current state of the wallet
async function updateCurrentStateValue(
  key: keyof IWalletContext,
  newValue: any
) {
  await chrome.storage.local.set({ [key]: newValue });
}

// This listener is the nexus between the injected script in the DOM and the popup, because it has
// access to both chrome.runtime and window.dispatchEvent|addEventListener APIs.
//
// To communicate with the background script and the popup it uses chrome.runtime API.
// To communicate with the injected script in the dom it uses window.dispatchEvent|addEventListener
window.addEventListener(
  "message",
  async (event: CustomEventInit<Command>) => {
    // TODO Type correclty
    const command: any = event.detail;
    switch (command.type) {
      case RpcCall.EthAccounts: {
        let connectedDapps = await getCurrentStateValue(CONNECTED_DAPPS);
        let connectedAccounts =
          connectedDapps != null ? connectedDapps[command.data.origin] : [];
        dispatchResponseEvent(command, connectedAccounts);
        break;
      }
      case RpcCall.EthRequestAccounts: {
        let connectedDapps = await getCurrentStateValue(CONNECTED_DAPPS);
        // TODO Check that the current account is the one that is trying to connect
        // ATM we support one account so it is the same
        // Respond directly if the dApp is already connected
        if (command.data.origin in connectedDapps) {
          dispatchResponseEvent(command, connectedDapps[command.data.origin]);
        }
        // Otherwise open the popup to give permission to the dApp
        else {
          let response: any = await chrome.runtime.sendMessage(
            new Command(BackgroundCommand.OpenPopup)
          );
          if (response.success) {
            let extensionResponse = await sendMessageToExtension(command);
            dispatchResponseEvent(command, extensionResponse);
          }
        }
        break;
      }
      case RpcCall.EthSendTranasaction:
      case RpcCall.WalletSwitchEthereumChain: {
        let response: any = await chrome.runtime.sendMessage(
          new Command(BackgroundCommand.OpenPopup)
        );
        if (response.success) {
          let extensionResponse = await sendMessageToExtension(command);
          dispatchResponseEvent(command, extensionResponse);
        }
        break;
      }
      case RpcCall.EthChainId: {
        let currentNetwork = await getCurrentStateValue(NETWORK);
        dispatchResponseEvent(command, convertToHex(currentNetwork.value));
        break;
      }
      case RpcCall.NetVersion: {
        let currentNetwork = await getCurrentStateValue(NETWORK);
        dispatchResponseEvent(command, currentNetwork.value);
        break;
      }
      case RpcCall.WalletRevokePermissions: {
        let connectedDapps = await getCurrentStateValue(CONNECTED_DAPPS);
        // TODO: At the moment we remove the whole key, when we support multiple address we will
        // have to remove the current address
        delete connectedDapps[command.data.origin];
        await updateCurrentStateValue(CONNECTED_DAPPS, connectedDapps);
        dispatchResponseEvent(command, null);
        break;
      }
    }
  },
  false
);

injectExtensionScript("js/attachKeylessExtension.js");

console.log("Content script loaded");
