import { Command } from "./models";
import { configureAndRenderExtension, setChainId } from "./utils/popup";
import { sendMessageToExtension } from "./utils/utils";

chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  const command: Command = message;
  console.log("from background", JSON.stringify(message, undefined, 2));

  switch (command.type) {
    case "eth_requestAccounts":
      let response = await sendMessageToExtension(message);
      console.log(response);
      break;
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
