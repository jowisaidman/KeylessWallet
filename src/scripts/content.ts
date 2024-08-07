import { Web3 } from "web3";

async function injectExtensionScript(url: string) {
  try {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL(url);
    script.async = false;
    script.type = "module";

    const node = document.head || document.documentElement;
    node.prepend(script);
    window.postMessage("attach");
  } catch (error) {
    console.log(error);
    throw error;
  }
}

injectExtensionScript("js/attach.js");
