import { Command, RpcCall } from "./models";
import { configureAndRenderExtension, setChainId } from "./utils/popup";

chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  const command: Command = message;

  console.log("command:", JSON.stringify(command));

  switch (command.type) {
    case "eth_sendTransaction":
      await configureAndRenderExtension(command);

      break;
    case "eth_chainId":
      await setChainId(command);
      break;
    case RpcCall.EthRequestAccounts:
      await configureAndRenderExtension(command);
      sendResponse({ status: "DESDE BACKGROUND AMIGO" });
      console.log("request accounts");
      break;
    default:
      break;
  }

  sendResponse({ status: "ok" });
});
