import { Command } from "./models";
import { configureAndRenderExtension, setChainId } from "./utils/popup";
import { sendMessageToExtension } from "./utils/utils";

chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  console.log(
    "from background",
    JSON.stringify(message, undefined, 2),
    _sender
  );
  const command: Command = message;

  // Depending on which command is executed, we need to render the popup
  switch (message) {
    case "open-popup":
      await configureAndRenderExtension(command);
      sendResponse({ status: "oka" });
      break;
    default:
      break;
  }
});
