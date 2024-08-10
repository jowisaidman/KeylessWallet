import { Command } from "./models";
import { configureAndRenderExtension, setChainId } from "./utils/popup";

chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  const command: Command = message;

  switch (command.type) {
    case "eth_sendTransaction":
      await configureAndRenderExtension(command);
      break;
    case "eth_chainId":
      await setChainId(command);
      break;
    case "signWithMetamask":
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'CONNECT_METAMASK' }, sendResponse);

        });
        return true;
    default:
      break;
  }

  sendResponse({ status: "ok" });
});
