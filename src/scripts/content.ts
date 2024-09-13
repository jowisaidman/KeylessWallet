import { Web3 } from "web3";
import { Command, sendMessageToExtension } from "../communication";

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

window.addEventListener(
  "message",
  (event: CustomEventInit<Command>) => {
    const command: any = event.detail;
    console.log("from content script", JSON.stringify(command));
    switch (command.type) {
      case "eth_requestAccounts":
      case "eth_sendTransaction":
        console.log("aca?");
        chrome.runtime.sendMessage("open-popup", (response) => {
          console.log("open-popup response", response);
          sendMessageToExtension(command)
            .then((extensionResponse) => {
              const responseEvent = new CustomEvent(command.id, {
                detail: extensionResponse,
              });

              window.dispatchEvent(responseEvent);
              console.log("extension response ", extensionResponse);
            });
        });
        break;
    }
  },
  false
);

injectExtensionScript("js/attachKeylessExtension.js");

console.log("Content script loaded");
