import { Command } from "../communication";
import { Screen } from "./navigation";

export default async function renderExtension(): Promise<unknown> {
  await chrome.storage.local.set({ source: Screen.Loading });
  return (chrome.action as any).openPopup();
}
