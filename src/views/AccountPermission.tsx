import React, { useContext, FC } from "react";
import { Button } from "../components/Button";
import { Tabs, Tab } from "../components/Tabs";
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";
import { getTransaction } from "../utils/transaction";
import { WalletContext, IWalletContext } from "../context/context";
import { changeScreen, Screen } from "../utils/navigation";

export const AccountPermission: FC<{ syncedWithStorage: boolean, sendResponse: (r: object) => void }> = ({
  syncedWithStorage,
  sendResponse,
}) => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);

  async function back() {
    await changeScreen(Screen.Welcome);
  }

  async function ok() {
      console.log("ehhh");
    sendResponse([walletContext.currentAccount?.address]);
    await changeScreen(Screen.Welcome);
  }

  return (
      <div>
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
  );
};

export default AccountPermission;
