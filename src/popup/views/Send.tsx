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
import { WalletContext, IWalletContext } from "../context/context";
import { changeScreen, Screen } from "../navigation";
import { estimateGasFee, GasFee } from "../../utils/transaction";

enum FeeConfiguration {
  Slow,
  Normal,
  Fast,
  Custom,
}

export default () => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const ephemeralContext =
    useContext<ITransactionContext>(TransactionContext);

  const [loadingFees, setLoadingFees] = useState(true);

  // This feees are the ones returned from the node
  const [fees, setFees] = useState<GasFee>({
    maxFeePerGas: BigInt(0),
    maxPriorityFeePerGas: BigInt(0),
  });

  // At the beginning they are the same as fees state, but they can change if the user selects
  // other few configuration from the modal
  const [configuredFees, setConfiguredFees] = useState<GasFee>({
    maxFeePerGas: BigInt(0),
    maxPriorityFeePerGas: BigInt(0),
  });

  const [feeConfiguration, setFeeConfiguration] = useState<FeeConfiguration>(
    FeeConfiguration.Normal
  );

  let addressTo = useRef<HTMLInputElement>(null);
  let valueToSend = useRef<HTMLInputElement>(null);
  let maxFee = useRef<HTMLInputElement>(null);
  let priorityFee = useRef<HTMLInputElement>(null);

  let feeModal = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    estimateGasFee(ephemeralContext.rpcProvider!).then((fees) => {
      setFees(fees);
      setConfiguredFees(fees);
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
      ephemeralContext.transaction.setValue(
        String(ethers.parseUnits(valueToSendValue, "ether"))
      );
      ephemeralContext.transaction.setTo(addressToValue);
      ephemeralContext.transaction.setChainId(
        Number(walletContext.network.value)
      );
      ephemeralContext.transaction.setMaxFeePerGas(
        String(configuredFees.maxFeePerGas)
      );
      ephemeralContext.transaction.setMaxPriorityFeePerGas(
        String(configuredFees.maxPriorityFeePerGas)
      );
      ephemeralContext.transaction.setGasLimit("21000");
      ephemeralContext.transaction.setData("0x");
      await changeScreen(Screen.SendReview);
    }
  }

  // Gets fee estimation based on the fee configuration
  function getFeeEstimation(): GasFee {
    switch (feeConfiguration) {
      case FeeConfiguration.Slow:
        return {
          maxFeePerGas: (fees.maxFeePerGas * BigInt(80)) / BigInt(100),
          maxPriorityFeePerGas:
            (fees.maxPriorityFeePerGas * BigInt(80)) / BigInt(100),
        };
      case FeeConfiguration.Fast:
        return {
          maxFeePerGas: (fees.maxFeePerGas * BigInt(120)) / BigInt(100),
          maxPriorityFeePerGas:
            (fees.maxPriorityFeePerGas * BigInt(120)) / BigInt(100),
        };
      case FeeConfiguration.Normal:
      case FeeConfiguration.Custom:
      default:
        return {
          maxFeePerGas: fees.maxFeePerGas,
          maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
        };
    }
  }

  useEffect(() => {
    if (maxFee.current != null && priorityFee.current != null) {
      const estimation = getFeeEstimation();
      maxFee.current!.value = ethers.formatUnits(
        estimation.maxFeePerGas,
        "gwei"
      );
      priorityFee.current!.value = ethers.formatUnits(
        estimation.maxPriorityFeePerGas,
        "gwei"
      );
    }
  }, [feeConfiguration]);

  // Sets the fee configuration
  function changeFeesConfiguration() {
    if (maxFee.current != null && priorityFee.current != null) {
      setConfiguredFees({
        maxFeePerGas: BigInt(
          ethers.formatUnits(
            ethers.parseUnits(maxFee.current.value, "gwei"),
            "wei"
          )
        ),
        maxPriorityFeePerGas: BigInt(
          ethers.formatUnits(
            ethers.parseUnits(priorityFee.current.value, "gwei"),
            "wei"
          )
        ),
      });
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
          insideLabel={walletContext.network.unitNames[0]}
          ref={valueToSend}
        />
        <div className="label">
          <span className="label-text font-bold mt-2">Transaction Fee</span>
        </div>

        {loadingFees && <div className="skeleton h-5 w-full"></div>}
        {!loadingFees && (
          <div className="flex justify-between">
            <label className="text-lg">
              {ethers.formatUnits(configuredFees.maxFeePerGas, "ether")}
            </label>
            <label className="text-lg flex">
              {walletContext.network.unitNames[0]}
              <ButtonIcon icon="pencil-line" onClick={openFeeModal} size="xs" />
            </label>
          </div>
        )}
      </label>
      <Footer>
        <Button onClick={back} className="px-10" centered>
          Cancel
        </Button>
        <Button
          onClick={send}
          variant="primary"
          centered
          className="px-10"
          disabled={loadingFees}
        >
          Next
        </Button>
      </Footer>

      {!loadingFees && (
        <dialog id="my_modal_1" className="modal" ref={feeModal}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Change transaction fee</h3>

            <div role="tablist" className="tabs tabs-boxed mt-3">
              <a
                role="tab"
                className={`tab tooltip tooltip-bottom ${
                  feeConfiguration == FeeConfiguration.Slow ? "tab-active" : ""
                }`}
                data-tip="Slow"
                onClick={() => {
                  setFeeConfiguration(FeeConfiguration.Slow);
                }}
              >
                <i className="ri-slow-down-line text-lg"></i>
              </a>
              <a
                role="tab"
                className={`tab tooltip tooltip-bottom ${
                  feeConfiguration == FeeConfiguration.Normal
                    ? "tab-active"
                    : ""
                }`}
                data-tip="Normal"
                onClick={() => {
                  setFeeConfiguration(FeeConfiguration.Normal);
                }}
              >
                <i className="ri-timer-line text-lg"></i>
              </a>
              <a
                role="tab"
                className={`tab tooltip tooltip-bottom ${
                  feeConfiguration == FeeConfiguration.Fast ? "tab-active" : ""
                }`}
                data-tip="Fast"
                onClick={() => {
                  setFeeConfiguration(FeeConfiguration.Fast);
                }}
              >
                <i className="ri-speed-up-line text-lg"></i>
              </a>
              <a
                role="tab"
                className={`tab tooltip tooltip-bottom ${
                  feeConfiguration == FeeConfiguration.Custom
                    ? "tab-active"
                    : ""
                }`}
                data-tip="Custom"
                onClick={() => {
                  setFeeConfiguration(FeeConfiguration.Custom);
                  maxFee.current?.focus();
                }}
              >
                <i className="ri-question-mark"></i>
              </a>
            </div>
            <div className="flex flex-col p-3">
              <Input
                label="Max base fee"
                insideLabel={walletContext.network.unitNames[1]}
                className="text-neutral"
                ref={maxFee}
                defaultValue={ethers.formatUnits(
                  configuredFees.maxFeePerGas,
                  "gwei"
                )}
                disabled={feeConfiguration != FeeConfiguration.Custom}
              />
              <Input
                label="Priority tip"
                insideLabel={walletContext.network.unitNames[1]}
                className="text-neutral mt-2"
                ref={priorityFee}
                defaultValue={ethers.formatUnits(
                  configuredFees.maxPriorityFeePerGas,
                  "gwei"
                )}
                disabled={feeConfiguration != FeeConfiguration.Custom}
              />
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Cancel</button>
                <button
                  className="btn btn-primary mx-2"
                  onClick={changeFeesConfiguration}
                >
                  Ok
                </button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </ScreenContainer>
  );
};
