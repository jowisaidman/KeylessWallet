import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Welcome from "./views/Welcome";
import AccountPermission from "./views/AccountPermission";
import Loading from "./views/Loading";
import SyncAddress from "./views/SyncAddress";
import QrToSign from "./views/QrToSign";
import QrToRead from "./views/QrToRead";
import SendToChain from "./views/SendToChain";
import SwitchChain from "./views/SwitchChain";
import Send from "./views/Send";
import SendReview from "./views/SendReview";
import { changeScreen, Screen, goToSignScreenWithQr } from "./navigation";
import { Command, RpcCall } from "../communication";
import {
  WalletContext,
  IWalletContext,
  getSavedState,
  DefaultContext,
} from "./context/context";
import { SOURCE, CURRENT_ACCOUNT, NETWORK, SAVED_STATE_KEYS } from "../storage";
import {
  TransactionContext,
  ITransactionContext,
  DefaultTransactionContext,
} from "./context/transaction";

// We set the sendResponse function from the chrome.runtime.addListener callback here to be able to
// pass it to the view that has to request the action from the user
// TODO: Check a better way of doing this...
var sendResp: any = null;

const Popup = () => {
  const [walletContext, setWalletContext] =
    useState<IWalletContext>(DefaultContext);

  const [transactionContext, setTransactionContext] =
    useState<ITransactionContext>(DefaultTransactionContext);

  // This state is used to propagate the event data received from the DOM to the screen that will
  // solve the request
  const [eventData, setEventData] = useState<object | null>(null);

  // Tells us if we synced with saved state the first time we enter the popup
  const [syncedWithStorage, setSyncedWithStorage] = useState<boolean>(false);

  const [command, setCommand] = useState<Command | null>(null);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (command: Command | undefined, _sender, sendResponse) => {
        if (command != null) {
          switch (command.type) {
            case RpcCall.WalletRequestPermissions:
            case RpcCall.EthRequestAccounts: {
              sendResp = sendResponse;
              setEventData(command.data);
              changeScreen(Screen.AccountPermission);
              break;
            }
            case RpcCall.WalletSwitchEthereumChain: {
              sendResp = sendResponse;
              setEventData(command.data);
              changeScreen(Screen.SwitchChain);
              break;
            }
            default: {
              changeScreen(Screen.Welcome);
              break;
            }
          }
        } else {
          console.log("received null command");
        }

        return true;
      }
    );
  }, []);

  // Effect 1: Add listener to sync persisted state with local state
  useEffect(() => {
    const listener = async () => {
      const result = await chrome.storage.local.get(SAVED_STATE_KEYS);
      setWalletContext({ ...result } as IWalletContext);
    };
    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  // Effect 2: Sync local state with storage data on mount
  useEffect(() => {
    chrome.storage.local.get(SAVED_STATE_KEYS, (result) => {
      console.log(2, result);
      if (Object.keys(result).length === 0) {
        setWalletContext(DefaultContext);
      } else {
        setWalletContext({ ...result } as IWalletContext);
      }
      setSyncedWithStorage(true);
    });
  }, []);

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
      case Screen.SendReview: {
        return <SendReview />;
      }
      case Screen.Loading: {
        return <Loading />;
      }
      case Screen.AccountPermission: {
        return (
          <AccountPermission
            syncedWithStorage={syncedWithStorage}
            sendResponse={sendResp!}
            eventData={eventData as any}
          />
        );
      }
      case Screen.SwitchChain: {
        return (
          <SwitchChain
            syncedWithStorage={syncedWithStorage}
            sendResponse={sendResp!}
            eventData={eventData as any}
          />
        );
      }
      default: {
        return <Welcome />;
      }
    }
  }

  return (
    <WalletContext.Provider value={walletContext}>
      <TransactionContext.Provider value={transactionContext}>
        <div className="bg-default min-w-[390px] min-h-[600px] text-default flex flex-col">
          {syncedWithStorage ? (
            walletContext.currentAccount != null ? (
              getScreen()
            ) : (
              <SyncAddress />
            )
          ) : (
            <Loading />
          )}
        </div>
      </TransactionContext.Provider>
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

// root.render(<Popup />);
