import { Web3 } from "web3";
import { Command } from "../models";

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
  "KeylessInterception",
  (event: CustomEventInit<Command>) => {
    chrome.runtime.sendMessage(event.detail, (_response) => {
      console.log(`** Keyless interception - message sent **`);
    });
  },
  false
);

injectExtensionScript("js/attachKeylessExtension.js");
injectExtensionScript("js/requestMetamask.js")