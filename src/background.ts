import { configureAndRenderExtension } from "./utils/popup";
import { Command, sendMessageToExtension } from "./communication";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log(
    "from background",
    JSON.stringify(message, undefined, 2),
    _sender
  );
  const command: Command = message;

  // Depending on which command is executed, we need to render the popup
  switch (message) {
    case "open-popup":
      configureAndRenderExtension(command).then(() =>
        sendResponse({ status: "ok" })
      );
      break;
    default:
      break;
  }

  return true;
});
