import { Command } from "../communication";

export async function renderExtension(): Promise<unknown> {
  await chrome.storage.local.set({ source: "none" });
  return (chrome.action as any).openPopup();
}
