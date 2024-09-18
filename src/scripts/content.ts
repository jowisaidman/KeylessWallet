import { Web3 } from "web3";
import {
  sendMessageToExtension,
  Command,
  BackgroundCommand,
  RpcCall,
} from "../communication";
import { NETWORK, CONNECTED_DAPPS } from "../context/context";
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
    console.log("from content script", JSON.stringify(command));
    switch (command.type) {
      case RpcCall.EthAccounts: {
        let result = await chrome.storage.local.get([CONNECTED_DAPPS]);
        console.log("connected DAPPS", result);
        let connectedAccounts =
          result[CONNECTED_DAPPS] != null
            ? result[CONNECTED_DAPPS][command.data.origin]
            : [];
        const responseEvent = new CustomEvent(command.id, {
          detail: connectedAccounts,
        });
        window.dispatchEvent(responseEvent);
        break;
      }
      // Rpc calls that need to open the popup to do some action
      case RpcCall.EthRequestAccounts:
      case RpcCall.EthSendTranasaction: {
        let response: any = await chrome.runtime.sendMessage(
          new Command(BackgroundCommand.OpenPopup)
        );
        console.log("open-popup response", response);
        if (response.success) {
          let extensionResponse = await sendMessageToExtension(command);
          const responseEvent = new CustomEvent(command.id, {
            detail: extensionResponse,
          });

          window.dispatchEvent(responseEvent);
          console.log("extension response ", extensionResponse);
        }
        break;
      }
      case RpcCall.EthChainId: {
        let result = await chrome.storage.local.get([NETWORK]);
        console.log("chain id request", result);
        const responseEvent = new CustomEvent(command.id, {
          detail: convertToHex(result.network.value),
        });

        window.dispatchEvent(responseEvent);
        break;
      }
      case RpcCall.NetVersion: {
        let result = await chrome.storage.local.get([NETWORK]);
        console.log("chain id request", result);
        const responseEvent = new CustomEvent(command.id, {
          detail: result.network.value,
        });

        window.dispatchEvent(responseEvent);
        break;
      }
    }
  },
  false
);

injectExtensionScript("js/attachKeylessExtension.js");

console.log("Content script loaded");
