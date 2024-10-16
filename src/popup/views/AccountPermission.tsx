import React, { useContext, FC, useEffect } from "react";
import { Button } from "../components/Button";
import { Tabs, Tab } from "../components/Tabs";
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";
import { getTransaction } from "../transaction";
import {
  WalletContext,
  IWalletContext,
} from "../context/context";
import Loading from "../components/Loading";
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
    <div className="flex flex-col items-center gap-5 grow px-5 h-full">
      {eventData == null ? (
        <Loading />
      ) : (
        <>
          <div className="text-primary font-bold text-2xl my-2">
            Account Permission
          </div>
          <p>
            The site {eventData.origin} is requesting permission to connect to{" "}
            <br />
            {walletContext.currentAccount?.address}
          </p>
          <div className="flex items-center space-x-3 items-end mt-auto mb-6">
            <Button
              onClick={back}
              variant="secondary"
              className="px-10"
              centered
              size="lg"
            >
              Cancel
            </Button>
            <Button
              onClick={ok}
              variant="primary"
              centered
              className="px-10"
              size="lg"
            >
              Ok
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountPermission;
