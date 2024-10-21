import React, { useContext, useEffect } from "react";
import { ethers } from "ethers";
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
import ScreenContainer, { Footer } from "../components/ScreenContainer";
import { WalletContext, IWalletContext } from "../context/context";
import { changeScreen, Screen } from "../navigation";
import createAvatar from "../avatarGenerator";

export default () => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);

  useEffect(() => {
    if (transactionContext.transaction.preview().to == null) {
      changeScreen(Screen.Welcome);
    }
  }, []);

  function back() {
    changeScreen(Screen.Send);
  }

  function send() {
    changeScreen(Screen.QrToSign);
  }

  if (transactionContext.transaction.preview().to == null) {
    return null;
  } else {
    return (
      <ScreenContainer>
        <Title title="Send Transaction" />
        <ul className="steps lg:steps-horizontal">
          <li className="step step-primary font-bold">
            Choose&#10;&#13;Account
          </li>
          <li className="step step-primary font-bold">Review</li>
          <li className="step">Sign</li>
          <li className="step">Send</li>
        </ul>

        <table className="table">
          <tr>
            <th>
              <div className="label">
                <span className="label-text font-bold">Network</span>
              </div>
            </th>
            <td>
              <div className="flex items-center">
                <img
                  src={walletContext.network.icon || "generic_chain.svg"}
                  width="32px"
                  className="mr-2"
                />
                <label className="font-bold text-lg">
                  {walletContext.network.label}
                </label>
              </div>{" "}
            </td>
          </tr>
          <tr>
            <th>
              <div className="label">
                <span className="label-text font-bold">From</span>
              </div>
            </th>
            <td>
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
            </td>
          </tr>
          <tr>
            <th>
              <div className="label">
                <span className="label-text font-bold">To</span>
              </div>
            </th>
            <td>
              <div className="flex items-center">
                <AccountAvatar
                  imageData={createAvatar(
                    transactionContext.transaction.preview().to!
                  )}
                  className="mr-2"
                  size="md"
                />
                <AccountLabel
                  account={transactionContext.transaction.preview().to!}
                />
              </div>
            </td>
          </tr>
          <tr>
            <th>
              <div className="label">
                <span className="label-text font-bold">Amount</span>
              </div>
            </th>
            <td>
              <label className="font-bold text-lg">
                {ethers.formatUnits(
                  String(transactionContext.transaction.preview().value),
                  "ether"
                )}{" "}
                {walletContext.network.unitNames[0]}
              </label>
            </td>
          </tr>
          <tr>
            <th>
              <div className="label">
                <span className="label-text font-bold">Max fee</span>
              </div>
            </th>
            <td>
              <label className="text-lg">
                {ethers.formatUnits(
                  String(transactionContext.transaction.preview().maxFeePerGas),
                  "ether"
                )}{" "}
                {walletContext.network.unitNames[0]}
              </label>
            </td>
          </tr>
          <tr>
            <th>
              <div className="label">
                <span className="label-text font-bold">Priority Fee</span>
              </div>
            </th>
            <td>
              <label className="text-lg">
                {ethers.formatUnits(
                  String(
                    transactionContext.transaction.preview()
                      .maxPriorityFeePerGas
                  ),
                  "ether"
                )}{" "}
                {walletContext.network.unitNames[0]}
              </label>
            </td>
          </tr>
        </table>
        <Footer>
          <Button onClick={back} className="px-10" centered>
            Back
          </Button>
          <Button onClick={send} variant="primary" centered className="px-10">
            Next
          </Button>
        </Footer>
      </ScreenContainer>
    );
  }
};
