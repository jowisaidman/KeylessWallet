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


console.log('Content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CONNECT_METAMASK') {
    console.log('CONNECT_METAMASK message received in content script');

    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts: any[]) => {
          console.log('Connected account:', accounts[0]);
          sendResponse({ type: 'METAMASK_CONNECTED', account: accounts[0] });
        })
        .catch((error: { message: any; }) => {
          console.error('User denied account access', error);
          sendResponse({ type: 'METAMASK_CONNECTION_FAILED', error: error.message });
        });
    } else {
      console.log('MetaMask is not installed');
      sendResponse({ type: 'METAMASK_NOT_INSTALLED' });
    }
    
    return true;
  }
});

injectExtensionScript("js/requestMetamask.js")