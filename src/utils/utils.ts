import { Command } from "../models";

export function dispatchEvent(command: Command) {
  const event = new CustomEvent("KeylessInterception", {
    detail: command,
  });

  window.dispatchEvent(event);
}