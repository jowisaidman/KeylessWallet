import React, { useContext } from "react";
import { Button } from "../components/Button";
import { Tabs, Tab } from "../components/Tabs";
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";
import Title from "../components/Title";
import { Input } from "../components/Input";
import AccountAvatar from "../components/AccountAvatar";
import AccountLabel from "../components/AccountLabel";
import { getTransaction } from "../transaction";
import { WalletContext, IWalletContext } from "../context/context";
import { changeScreen, Screen } from "../navigation";
import createAvatar from "../avatarGenerator";

export default () => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);

  async function back() {
    await changeScreen(Screen.Welcome);
  }

  async function send() {
    await changeScreen(Screen.QrToSign);
  }

  return (
    <div className="flex flex-col items-center gap-5 grow p-5 h-full justify-between">
      <Title title="Send Transaction" />
      <ul className="steps lg:steps-horizontal">
        <li className="step step-primary font-bold">Choose&#10;&#13;Account</li>
        <li className="step step-primary font-bold">Review</li>
        <li className="step">Sign</li>
        <li className="step">Send</li>
      </ul>

      <label className="form-control w-full max-w-xs">
        <div className="flex justify-between mb-3">
          <div className="flex flex-col">
            <div className="label">
              <span className="label-text font-bold">From</span>
            </div>

            <div className="flex items-center">
              <AccountAvatar
                imageData={walletContext.currentAccount?.avatar || ""}
                className="mr-2"
                size="md"
              />
              <AccountLabel
                account={walletContext.currentAccount?.address || ""}
                label={walletContext.currentAccount?.label || ""}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="label">
              <span className="label-text font-bold">Network</span>
            </div>

            <div className="flex items-center">
              <img
                src={walletContext.network.icon || "generic_chain.svg"}
                width="32px"
                className="mr-2"
              />
              <label className="font-bold text-lg">{walletContext.network.label}</label>
            </div>
          </div>
        </div>
        <div className="flex justify-between mb-3">
          <div className="flex flex-col">
            <div className="label">
              <span className="label-text font-bold">To</span>
            </div>

            <div className="flex items-center">
              <AccountAvatar
                imageData={createAvatar(JSON.parse(transactionContext.data!).to || "")}
                className="mr-2"
                size="md"
              />
              <AccountLabel
                account={JSON.parse(transactionContext.data!).to || ""}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="label">
              <span className="label-text font-bold">Value</span>
            </div>
            <label className="font-bold text-lg">{JSON.parse(transactionContext.data!).value}</label>
          </div>
        </div>
      </label>
      <div className="flex items-center space-x-3 items-end mt-auto">
        <Button onClick={back} className="px-10" centered>
          Cancel
        </Button>
        <Button onClick={send} variant="primary" centered className="px-10">
          Next
        </Button>
      </div>
    </div>
  );
};
