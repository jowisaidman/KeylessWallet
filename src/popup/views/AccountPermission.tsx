import React, { useContext, FC, useEffect } from "react";
import { Button } from "../components/Button";
import { Tabs, Tab } from "../components/Tabs";
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";
import { WalletContext, IWalletContext } from "../context/context";
import Loading from "../components/Loading";
import AccountAvatar from "../components/AccountAvatar";
import AccountLabel from "../components/AccountLabel";
import Title from "../components/Title";
import { changeScreen, Screen } from "../navigation";
import { updateState } from "../context/context";
import { RpcError, RpcErrorCode } from "../../scripts/eip1193/provider";

type EventData = {
  origin: string;
};

export const AccountPermission: FC<{
  syncedWithStorage: boolean;
  sendResponse: (r: object) => void;
  eventData: EventData;
}> = ({ syncedWithStorage, sendResponse, eventData }) => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);

  useEffect(() => {
    // If the origin is null we probably have a bug, to not leave the addon blank, we move back
    // to welcome
    if (eventData == null) {
      changeScreen(Screen.Welcome);
    }
  }, []);

  async function back() {
    sendResponse(
      new RpcError(
        RpcErrorCode.UserRejectedRequest,
        "user rejected the request"
      )
    );
    await changeScreen(Screen.Welcome);
  }

  async function ok() {
    const address = walletContext.currentAccount?.address!;
    const url = eventData.origin;
    await updateState((currentState) => {
      if (currentState.connectedDapps[url] == null) {
        currentState.connectedDapps[url] = [address];
      } else if (!currentState.connectedDapps[url].includes(address)) {
        currentState.connectedDapps[url].push(address);
      }
      return currentState;
    });
    sendResponse([walletContext.currentAccount?.address]);
    await changeScreen(Screen.Welcome);
  }

  return (
    <div className="flex flex-col items-center gap-5 grow p-5 h-full justify-between">
      {eventData == null ? (
        <Loading />
      ) : (
        <>
          <Title title="Account Permission" />
          <i className="ri-plug-line text-8xl text-secondary bg-base-300 rounded-full p-5"></i>
          <p className="text-center text-lg">
            The site{" "}
            <span className="font-bold text-accent">{eventData.origin}</span> is
            requesting permission to access your accounts
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>Allow</th>
                <th>Account</th>
              </tr>
            </thead>
            <tr>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked
                    disabled
                  />
                </label>
              </th>
              <td>
                <div className="flex items-center gap-3">
                  <AccountAvatar
                    imageData={walletContext.currentAccount?.avatar || ""}
                    size="md"
                  />
                  <AccountLabel
                    account={walletContext.currentAccount?.address || ""}
                    label={walletContext.currentAccount?.label || ""}
                  />
                </div>
              </td>
            </tr>
          </table>
          <div className="flex items-center space-x-3 items-end mt-auto">
            <Button onClick={back} className="px-10" centered>
              Cancel
            </Button>
            <Button onClick={ok} variant="primary" centered className="px-10">
              Allow
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountPermission;
