import { Command } from "../models";

const WIDTH = 400;
const HEIGHT = 645;

const wait = async (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const calculatePosition = async () => {
  const latestWindow = await chrome.windows.getLastFocused();

  if (
    latestWindow.left !== undefined &&
    latestWindow.top !== undefined &&
    latestWindow.width !== undefined
  ) {
    const top = latestWindow.top;
    const left = latestWindow.left - WIDTH;
    return { top, left };
  }

  return { top: 0, left: 0 };
};

const getWalletWindowId = async () => {
  const lastWindowPopup = await chrome.windows.getLastFocused({
    windowTypes: ["popup"],
    populate: true,
  });
  const walletPopupWindowId =
    lastWindowPopup && lastWindowPopup.tabs
      ? lastWindowPopup.tabs[0].windowId
      : undefined;

  return walletPopupWindowId;
};

const waitForWalletWindowId = async () => {
  let retries = 10;

  while (retries > 0) {
    await wait(1000);

    const walletWindowId = await getWalletWindowId();

    if (walletWindowId) return walletWindowId;

    retries--;
  }
};

const closeWindowWithTarget = (targetId: number, listeningId: number) => {
  function listener(_tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) {
    if (removeInfo.windowId === listeningId) {
      chrome.storage.local
        .set({
          source: "none",
          event: undefined,
          chainId: undefined,
        })
        .then((_) => console.log(`Extension reset`))
        .catch((error) =>
          console.error(
            `Error resetting extension: ${JSON.stringify(error, null, 4)}`
          )
        );
      chrome.windows.remove(targetId);
      chrome.tabs.onRemoved.removeListener(listener);
    }

    if (removeInfo.windowId === targetId) {
      chrome.storage.local
        .set({
          source: "none",
          event: undefined,
          chainId: undefined,
        })
        .then((_) => console.log(`Extension reset`))
        .catch((error) =>
          console.error(
            `Error resetting extension: ${JSON.stringify(error, null, 4)}`
          )
        );

      chrome.windows.remove(targetId);
      chrome.tabs.onRemoved.removeListener(listener);
    }
  }

  chrome.tabs.onRemoved.addListener(listener);
};

export async function configureAndRenderExtension(command: Command) {
  await chrome.storage.local.set({ event: command });

  await chrome.windows.getCurrent();

  const walletId = await waitForWalletWindowId();

  if (walletId) {
    const { top, left } = await calculatePosition();
    await chrome.storage.local.set({ source: "wallet" });

    const extension = await chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: WIDTH,
      height: HEIGHT,
      top,
      left,
      focused: true,
    });
    if (extension.id) {
      closeWindowWithTarget(extension.id, walletId);

      chrome.windows.update(extension.id, {
        focused: true,
        drawAttention: true,
      });
    }
  }
}

export async function setChainId(command: Command) {
  await chrome.storage.local.set({ chainId: command.data.chainId });
}
