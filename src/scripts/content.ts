import { Web3 } from "web3";
import { Command, BackgroundCommand, RpcCall } from "../communication";
import { sendMessageToExtension } from "../utils/utils";

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
  (event: CustomEventInit<Command>) => {
    const command: any = event.detail;
    console.log("from content script", JSON.stringify(command));
    switch (command.type) {
      // Rpc calls that need to open the popup to do some action
      case RpcCall.EthRequestAccounts:
      case RpcCall.EthSendTranasaction:
        chrome.runtime.sendMessage(
          new Command(BackgroundCommand.OpenPopup),
          (response) => {
            console.log("open-popup response", response);
            if (response.success) {
              sendMessageToExtension(command).then((extensionResponse) => {
                const responseEvent = new CustomEvent(command.id, {
                  detail: extensionResponse,
                });

                window.dispatchEvent(responseEvent);
                console.log("extension response ", extensionResponse);
              });
            }
          }
        );
        break;
    }
  },
  false
);

injectExtensionScript("js/attachKeylessExtension.js");

console.log("Content script loaded");
