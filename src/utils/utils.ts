import { Command } from "../communication";

// Dispatches an event that is listened by the content script.
//
// content script can use chrome.runtime APIs and window.addEventListener APIs. When we use this
// function, we are dispatching a new event that is caught by the content script,and then decides what to do based on which command is sent.
// For example, if we send and rpc call from the injected script that must open the popup so the
// user can take some action the content script will send a messge to the background script to open
// the popup and after that that command is successful, then it uses the chrome.runtime API to
// forward the rpc call to the popup
//
// A listener is created to be able await for the response of the popup in the injected script
// in the DOM
export function dispatchEvent(command: Command): Promise<unknown> {
  const event = new CustomEvent("message", {
    detail: command,
  });

  window.dispatchEvent(event);

  return new Promise((resolve, reject) => {
    const listener = (event: any) => {
      console.log("from command event", JSON.stringify(event), event);
      if (event.type == command.id) {
        // Deregister self
        window.removeEventListener(command.id, listener);
        resolve(event.detail.data);
      }
    };

    window.addEventListener(command.id, listener, true);
  });
}

// Sends message to extension
// This function uses the chrome.runtime api to send a message to the popup.
// Returns a promise that encapsulates the response from the popup.
export function sendMessageToExtension(event: CustomEvent): Promise<unknown> {
  return new Promise((resolve, reject) => {
    console.log("sending", event);
    chrome.runtime.sendMessage(event, (response) => {
      console.log("from sendmessage", JSON.stringify(response));
      resolve(response);
    });
  });
}
