import { Command, BackgroundCommand } from "./communication";
import { renderExtension } from "./utils/popup";
import { sendMessageToExtension } from "./utils/utils";

chrome.runtime.onMessage.addListener((command: Command , _sender, sendResponse) => {
  console.log(
    "from background",
    JSON.stringify(command, undefined, 2),
    _sender
  );

  // Depending on which command is executed, we need to render the popup
  switch (command.type) {
    case BackgroundCommand.OpenPopup:
      renderExtension()
        .then(() => sendResponse({ success: true }))
        .catch((e) => {
          console.error("There was an error opening the popup");
          sendResponse({ success: true });
        });
      return true;
      break;
    default:
      break;
  }

  return false;
});
