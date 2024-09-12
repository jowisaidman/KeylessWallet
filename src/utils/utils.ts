import { Command } from "../models";

// Dispatches an event that is listened by the background script.
//
// This function is used by the injected script in the page to send messages
// to the background script. The background reads the message and forwards
// it to the popup. Once the popup has a response, the response is caught
// by the background script and it sends an event with the commandId, that is
// caight by the listener created in this function and resolves the promise
// with the response so the injected script can read it
export function dispatchEvent(command: Command) {
  const id = Math.floor(Math.random() * 1000000);
  const commandId = `command_${id}`;
  const event = new CustomEvent("KeylessInterception", {
    detail: { id: listenerId, ...command },
  });

  window.dispatchEvent(event);

  return new Promise((resolve, reject) => {
    const listener = (event: any) => {
      if (event.detail.data.id == commandId) {
        // Deregister self
        window.removeEventListener(listenerId, listener);
        resolve(event.detail.data);
      }
    };

    window.addEventListener(listenerId, listener);
  });
}

// Sends message to extension
// This function uses the chrome.runtime api to send a message to the popup.
// Returns a promise that encapsulates the response from the popup
export function sendMessageToExtension(event: CustomEvent) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(event.detail, (response) => {
      console.log("from sendmessage", JSON.stringify(response));
      if (response.complete) {
        resolve(response);
      } else {
        reject("Something wrong");
      }
    });
  });
}
