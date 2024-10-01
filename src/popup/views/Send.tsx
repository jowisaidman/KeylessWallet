import React, { useContext, useRef } from "react";
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

export default () => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);

  let addressTo = useRef<HTMLInputElement>(null);
  let valueToSend = useRef<HTMLInputElement>(null);

  async function back() {
    await changeScreen(Screen.Welcome);
  }

  async function send() {
    const addressToValue = addressTo.current?.value;
    const valueToSendValue = valueToSend.current?.value;
    if (addressToValue != null && valueToSendValue  != null) {
        const transaction = getTransaction(addressToValue, Number(valueToSendValue));
        transactionContext.setData(transaction);
        await changeScreen(Screen.SendReview);
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 grow p-5 h-full justify-between">
      <Title title="Send Transaction" />
      <ul className="steps lg:steps-horizontal">
        <li className="step step-primary font-bold">Choose&#10;&#13;Account</li>
        <li className="step">Review</li>
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
        <Input label="To" placeholder={walletContext.currentAccount!.address} ref={addressTo} />
        <Input label="Amount" placeholder="2.35" insideLabel="ETH" ref={valueToSend} />
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
