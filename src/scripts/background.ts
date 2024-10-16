import { Command, BackgroundCommand } from "../communication";
import renderExtension from "../popup/renderExtension";

chrome.runtime.onMessage.addListener(
  (command: Command, _sender, sendResponse) => {
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
  }
);
