import { Command } from "../models";
import { v4 as uuidv4 } from 'uuid';

// This function dispatches an event that is caight by the background script. It generates a unique
// request ID so we can await for a response in the popup. The background script will forward the
// message using the chrome.runtime.sendMessage API, the popup will catch it, do what it has to do
// and return a response through the sendResponse method.
// That response will be catched and a new event will be generated that will be caught by the one
// time use listener used here
export function dispatchEvent(command: Command): Promise<any> {
  console.log(`COMANDOOO ${JSON.stringify(command)}`);
  // const id = uuidv4();
  const id = "1234";
  command.data.id = id;

  const event = new CustomEvent("KeylessInterception", {
    detail: command,
  });

  window.dispatchEvent(event);

  const listenerId = `request_${id}`;
  return new Promise((resolve, reject) => {
      const listener = (event: any) => {
        if(event.detail.data.id == id) {
          // Deregister self
          window.removeEventListener(listenerId, listener);
          resolve(event.detail.data);
        }
      }

      window.addEventListener(listenerId, listener);
    });
}

/**
 * Promise wrapper for chrome.tabs.sendMessage
 * @param tabId
 * @param item
 * @returns {Promise<any>}
 */
export function sendMessagePromise(event: CustomEvent) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(event.detail, (response) => {
      if (response.complete) {
        resolve(response);
      } else {
        reject("Something wrong");
      }
    });
  });
}

/**
 * Promise wrapper for chrome.tabs.sendMessage
 * @param tabId
 * @param item
 * @returns {Promise<any>}
 */
export function sendMessageToContent(event: CustomEvent) {
    window.postMessage("KeylessInterception");
}
