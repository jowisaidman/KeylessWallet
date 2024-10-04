import React, { useContext, useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "../components/Button";
import ButtonIcon from "../components/ButtonIcon";
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
import { getTransaction } from "../transaction";
import { WalletContext, IWalletContext } from "../context/context";
import { changeScreen, Screen } from "../navigation";
import { estimateGasFee, GasFee } from "../../utils/transaction";

export default () => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);

  const [loadingFees, setLoadingFees] = useState(true);
  const [fees, setFees] = useState<GasFee | null>(null);

  let addressTo = useRef<HTMLInputElement>(null);
  let valueToSend = useRef<HTMLInputElement>(null);

  let feeModal = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    estimateGasFee().then((fees) => {
      console.log(fees);
      setFees(fees);
      setLoadingFees(false);
    });
  }, []);

  function openFeeModal() {
    (feeModal.current as any)?.showModal();
  }

  async function back() {
    await changeScreen(Screen.Welcome);
  }

  async function send() {
    const addressToValue = addressTo.current?.value;
    const valueToSendValue = valueToSend.current?.value;
    if (addressToValue != null && valueToSendValue != null) {
      transactionContext.transaction.setValue(valueToSendValue);
      transactionContext.transaction.setTo(addressToValue);
      transactionContext.transaction.setChainId(
        Number(walletContext.network.value)
      );
      await changeScreen(Screen.SendReview);
    }
  }

  return (
    <ScreenContainer>
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
              <label className="font-bold text-lg">
                {walletContext.network.label}
              </label>
            </div>
          </div>
        </div>
        <Input
          label="To"
          placeholder={walletContext.currentAccount!.address}
          ref={addressTo}
        />
        <Input
          label="Amount"
          placeholder="2.35"
          insideLabel="ETH"
          ref={valueToSend}
        />
        <div className="label">
          <span className="label-text font-bold mt-2">Transaction Fee</span>
        </div>

        {loadingFees && <div className="skeleton h-5 w-full"></div>}
        {!loadingFees && (
          <div className="flex justify-between">
            <label className="text-lg">
              {ethers.formatUnits(fees!.maxFeePerGas, "ether")}
            </label>
            <label className="text-lg flex">
              ETH{" "}
              <ButtonIcon icon="pencil-line" onClick={openFeeModal} size="xs" />
            </label>
          </div>
        )}
      </label>
      <Footer>
        <Button onClick={back} className="px-10" centered>
          Cancel
        </Button>
        <Button onClick={send} variant="primary" centered className="px-10">
          Next
        </Button>
      </Footer>

      <dialog id="my_modal_1" className="modal" ref={feeModal}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Change transaction fee</h3>

          <div role="tablist" className="tabs tabs-boxed mt-3">
            <a
              role="tab"
              className="tab tooltip tooltip-bottom"
              data-tip="Slow"
            >
              <i className="ri-slow-down-line text-lg"></i>
            </a>
            <a
              role="tab"
              className="tab tab-active tooltip tooltip-bottom"
              data-tip="Normal"
            >
              <i className="ri-timer-line text-lg"></i>
            </a>
            <a
              role="tab"
              className="tab tooltip tooltip-bottom"
              data-tip="Fast"
            >
              <i className="ri-speed-up-line text-lg"></i>
            </a>
            <a
              role="tab"
              className="tab tooltip tooltip-bottom text-lg"
              data-tip="Custom"
            >
              <i className="ri-question-mark"></i>
            </a>
          </div>
          <div className="flex flex-col p-3">
            <Input
              label="Max base fee"
              placeholder="2.35"
              insideLabel="GWEI"
              ref={valueToSend}
            />
            <Input
              label="Priority tip"
              placeholder="2.35"
              insideLabel="GWEI"
              ref={valueToSend}
            />
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cancel</button>
              <button className="btn btn-primary mx-2">Ok</button>
            </form>
          </div>
        </div>
      </dialog>
    </ScreenContainer>
  );
};
