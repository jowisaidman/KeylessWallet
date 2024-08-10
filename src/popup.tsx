import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Welcome from "./views/Welcome";
import SyncAddress from "./views/SyncAddress";
import QrToSign from "./views/QrToSign";
import QrToRead from "./views/QrToRead";
import SendToChain from "./views/SendToChain";
import Send from "./views/Send";
import { changeScreen, Screen, goToSignScreenWithQr } from "./utils/navigation";
import { Command } from "./models";
import {
  WalletContext,
  IWalletContext,
  getSavedState,
  DefaultContext,
  SOURCE,
  CURRENT_ACCOUNT,
} from "./context/context";
import { TransactionContext, ITransactionContext } from "./context/transaction";

const Popup = () => {
  const [walletContext, setWalletContext] =
    useState<IWalletContext>(DefaultContext);

  const [transaction, setTransaction] = useState<string | null>(null);

  const transactionContext = {
    data: transaction,
    setData: setTransaction,
  };

  // Tells us if we synced with saved state the first time we enter the popup
  const [syncedWithStorage, setSyncedWithStorage] = useState<boolean>(false);

  const [command, setCommand] = useState<Command | null>(null);

  // Effect 1: Add listener to sync persisted state with local state
  useEffect(() => {
    const listener = async () => {
      await chrome.storage.local.get(
        [SOURCE, CURRENT_ACCOUNT, "command"],
        (result) => {
          console.log(1, result);
          setWalletContext({ ...result } as IWalletContext);
          setCommand(result["command"]);
        }
      );
    };

    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  // Effect 2: Sync local state with storage data on mount
  useEffect(() => {
    chrome.storage.local.get([SOURCE, CURRENT_ACCOUNT, "command"], (result) => {
      console.log(2, result);
      setWalletContext({ ...result } as IWalletContext);
      setSyncedWithStorage(true);
      setCommand(result["command"]);
    });
  }, []);

  // Process commands
  useEffect(() => {
    if (syncedWithStorage && command) {
      console.log(walletContext, syncedWithStorage);
      console.log("Processing ", command, JSON.stringify(command.data[0]));
      const commandType = command["type"];
      const commandData = command.data[0];

      // Remove command after processing it
      chrome.storage.local.set({ command: null }).then(async () => {
        switch (commandType) {
          case "eth_sendTransaction": {
            setTransaction(JSON.stringify(command.data[0]));
            changeScreen(Screen.QrToSign);
            break;
          }
          default:
            console.warn("Unknown command", command);
            break;
        }
      });
    }
  }, [command, syncedWithStorage]);

  function getScreen() {
    switch (walletContext?.source) {
      case Screen.SyncAddress: {
        return <SyncAddress />;
      }
      case Screen.QrToSign: {
        return <QrToSign />;
      }
      case Screen.QrToRead: {
        return <QrToRead />;
      }
      case Screen.SendToChain: {
        return <SendToChain />;
      }
      case Screen.Send: {
        return <Send />;
      }
      default: {
        return <Welcome syncedWithStorage={syncedWithStorage} />;
      }
    }
  }

  return (
    <WalletContext.Provider value={walletContext}>
      <TransactionContext.Provider value={transactionContext}>
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
      </TransactionContext.Provider>
    </WalletContext.Provider>
  );
};

const container = document.getElementById("root")!;
const root = createRoot(container);
/*
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
*/

root.render(<Popup />);
