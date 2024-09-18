import React, { useContext, FC } from "react";
import { Button } from "../components/Button";
import { Tabs, Tab } from "../components/Tabs";
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";
import { getTransaction } from "../utils/transaction";
import {
  WalletContext,
  IWalletContext,
  CONNECTED_DAPPS,
} from "../context/context";
import { changeScreen, Screen } from "../utils/navigation";
import { updateState } from "../context/context";

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

  async function back() {
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
      <div className="text-primary font-bold text-2xl my-2">
        Account Permission
      </div>
      <p>
        The site {eventData.origin} is requesting permission to connect to
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
    </div>
  );
};

export default AccountPermission;
