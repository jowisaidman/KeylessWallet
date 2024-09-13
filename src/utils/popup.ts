import { Command } from "../models";

const WIDTH = 400;
const HEIGHT = 645;

export async function renderExtension(command: Command): Promise<unknown> {
  await chrome.storage.local.set({ source: "none" });
  return (chrome.action as any).openPopup();
}
