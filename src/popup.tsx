import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Welcome from "./views/Welcome";
import SyncAddress from "./views/SyncAddress";
import QrToSign from "./views/QrToSign";
import { changeScreen, Screen, goToSignScreenWithQr } from "./utils/navigation";
import { Command } from "./models";
import {
  WalletContext,
  IWalletContext,
  getSavedState,
  WalletStateKey,
  DefaultContext,
} from "./context/context";

const Popup = () => {
  const [walletContext, setWalletContext] =
    useState<IWalletContext>(DefaultContext);

  // Tells us if we synced with saved state the first time we enter the popup
  const [syncedWithStorage, setSyncedWithStorage] = useState<boolean>(false);

  const [command, setCommand] = useState<Command | null>(null);

  // Effect 1: Add listener to sync persisted state with local state
  useEffect(() => {
    const listener = async () => {
      await chrome.storage.local.get(WalletStateKey, (result) => {
        setWalletContext(result[WalletStateKey]);
      });
    };
    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  // Effect 2: Sync local state with storage data on mount
  useEffect(() => {
    chrome.storage.local.get(WalletStateKey, async (result) => {
      setWalletContext(result[WalletStateKey]);
      setSyncedWithStorage(true);
    });
  }, []);

  // Process commands
  useEffect(() => {
    const listener = async () => {
      await chrome.storage.local.get(["command"], (result) => {
        setCommand(result["command"]);
      });
    };
    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  useEffect(() => {
    chrome.storage.local.get(["command"], (result) => {
      if (result["command"]) {
        setCommand(result["command"]);
      }
    });
  }, []);

  // Process commands
  useEffect(() => {
    if (command) {
      console.log("Processing ", command, JSON.stringify(command.data[0]));
      switch (command["type"]) {
        case "eth_sendTransaction": {
          goToSignScreenWithQr(JSON.stringify(command.data[0]));
          /*
          chrome.storage.local
            .set({ signData: JSON.stringify(command.data[0]) })
            .then(() => changeScreen(Screen.QrToSign));
            */
          break;
        }
        default:
          console.warn("Unknown command", command);
          break;
      }
    }
    // Remove command after processing it
    chrome.storage.local.set({ command: null });
  }, [command]);

  function getScreen() {
    switch (walletContext?.source) {
      case Screen.SyncAddress: {
        return <SyncAddress />;
      }
      case Screen.QrToSign: {
        return <QrToSign />;
      }
      default: {
        return <Welcome syncedWithStorage={syncedWithStorage} />;
      }
    }
  }

  return (
    <WalletContext.Provider value={walletContext}>
      <div className="bg-default min-w-[390px] min-h-[600px] text-default flex flex-col text-sm">
        <div className="flex py-2.5 bg-layer justify-between pl-3 pr-2">
          <div className="flex">
            <img src="/icon_nb_48.png" alt="Keyless logo" />
            <div className="font-bold text-2xl mt-2 mb-2">&nbsp; Keyless</div>
            <div className="text-center px-3 py-1 m-3 rounded-2xl text-[#66EFF0] bg-[#66EFF0]/[0.1]">
              Alpha
            </div>
          </div>
          <img
            src="/close.svg"
            alt="Close icon"
            className="cursor-pointer"
            onClick={() => window.close()}
          />
        </div>
        <div className="flex flex-col grow justify-center items-center m-3 px-5">
          {getScreen()}
        </div>
      </div>
    </WalletContext.Provider>
  );
};

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
