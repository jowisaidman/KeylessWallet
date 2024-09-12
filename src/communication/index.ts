// This module is in charge of the communication between the injected script in the DOM
// and the popup
import { Command, CommandDestiny, CommandResult } from './types';

export { Command, CommandDestiny, CommandResult };

// Dispatches an event that is listened by the background script.
//
// This function is used by the injected script in the page to send messages
// to the background script. The background reads the message and forwards
// it to the popup. Once the popup has a response, the response is caught
// by the background script and it sends an event with the commandId, that is
// caight by the listener created in this function and resolves the promise
// with the response so the injected script can read it
export function dispatchEvent(command: Command): Promise<unknown> {
  const id = Math.floor(Math.random() * 1000000);
  const commandId = `command_${id}`;
  const event = new CustomEvent("message", {
    detail: { id: commandId, ...command },
  });

  window.dispatchEvent(event);

  return new Promise((resolve, reject) => {
    const listener = (event: any) => {
      console.log("from command event", JSON.stringify(event), event);
      if (event.id == commandId) {
        // Deregister self
        window.removeEventListener(commandId, listener);
        resolve(event.detail.data);
      }
    };

    window.addEventListener(commandId, listener, true);
  });
}

// Sends message to extension
//
// This function is used by the content script to send a message to the popup. When the message is
// replied, the Promise returned by this function is resolved and, with that resolution, the
// content script sends an event with the command id so it can be caught by the injected script
export function sendMessageToExtension(event: CustomEvent): Promise<unknown> {
  return new Promise((resolve, reject) => {
    console.log("sending", event);
    chrome.runtime.sendMessage(event.detail, (response) => {
      console.log("from sendmessage", JSON.stringify(response));
      resolve(response);
    });
  });
}
