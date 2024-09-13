import { Command } from "./models";
import { renderExtension } from "./utils/popup";
import { sendMessageToExtension } from "./utils/utils";

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
      renderExtension(command).then(() =>
        sendResponse({ status: "ok" })
      );
      return true;
      break;
    default:
      break;
  }

  return false;
});
