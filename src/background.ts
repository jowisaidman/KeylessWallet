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
    default:
      break;
  }

  sendResponse({ status: "ok" });
});
