import React, { useEffect, useState, useContext } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Welcome from "./views/Welcome";
import SyncAddress from "./views/SyncAddress";
import { WalletContext, IWalletContext, getSavedState, WalletStateKey } from "./context/context";

const Popup = () => {
    const [walletContext, setWalletContext] = useState<IWalletContext>(getSavedState());

useEffect(() => {
    const listener = () => {
      chrome.storage.sync.get([WalletStateKey], (result) => {
        setWalletContext(result[WalletStateKey]);
      });
    };
    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  // Effect 2: Sync local state with storage data on mount
  /*
  useEffect(() => {
    // 'sync' can be 'local', depends on your usecase
    chrome.storage.sync.get(["source"], (result) => {
      setSource(result.source);
    });
  }, []);
  */
    /*
  const [source, setSource] = useState<string>("none");

  const initPlugin = async () => {
    const storageSource = await chrome.storage.local.get("source");

    if (storageSource.source) {
      setSource(storageSource.source);
    }
  };

  useEffect(() => {
    const listener = () => {
      chrome.storage.sync.get(["source"], (result) => {
        setSource(result.source);
      });
    };
    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  // Effect 2: Sync local state with storage data on mount
  useEffect(() => {
    // 'sync' can be 'local', depends on your usecase
    chrome.storage.sync.get(["source"], (result) => {
      setSource(result.source);
    });
  }, []);

  function checkSource() {
    chrome.storage.sync.get(["source"], (result) => {
      if (result.source) {
        setSource(result.source);
      }
    });
  }


  useEffect(() => {
    initPlugin();
  }, []);
  */

  function getScreen() {
    switch (walletContext.source) {
      case "sync_address": {
        return <SyncAddress />;
      }
      default: {
        return <Welcome />;
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
