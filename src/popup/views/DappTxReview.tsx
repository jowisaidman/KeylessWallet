import React, { useContext, useEffect, useState } from "react";
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
import Loading from "../components/Loading";
import AccountLabel from "../components/AccountLabel";
import ScreenContainer, { Footer } from "../components/ScreenContainer";
import { WalletContext, IWalletContext } from "../context/context";
import { changeScreen, Screen } from "../navigation";
import createAvatar from "../avatarGenerator";
import { estimateGasLimit } from "../../utils/transaction";

export default () => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const ephemeralContext = useContext<ITransactionContext>(TransactionContext);

  let [estimatingGasLimit, setEstimatingGasLimit] = useState(true);

  useEffect(() => {
    if (ephemeralContext.dappTransactionEvent == null) {
      changeScreen(Screen.Welcome);
    } else {
      estimateGasLimit(
        ephemeralContext.dappTransactionEvent!.data[0],
        ephemeralContext.rpcProvider!
      ).then((r) => {
        ephemeralContext.dappTransactionEvent!.data[0].gasLimit = r.toString();
        setEstimatingGasLimit(false);
      });
    }
  }, []);

  function back() {
    changeScreen(Screen.Send);
  }

  function send() {
    changeScreen(Screen.QrToSignDapp);
  }

  return (
    <ScreenContainer>
      {ephemeralContext.dappTransactionEvent == null || estimatingGasLimit ? (
        <Loading />
      ) : (
        <>
          <Title title="Sign Transaction" />
          <ul className="steps lg:steps-horizontal">
            <li className="step step-primary font-bold">Review</li>
            <li className="step">Sign</li>
            <li className="step">Send</li>
          </ul>

          <p className="text-center text-lg">
            The site{" "}
            <span className="font-bold text-accent">
              {ephemeralContext.dappTransactionEvent!.data.origin}
            </span>{" "}
            wants to sign the following transaction on network
            <span className="font-bold text-accent">
              {" "}
              {walletContext.network.label}{" "}
            </span>{" "}
            :
          </p>

          <div
            className="p-3 w-full text-wrap"
            style={{ overflowWrap: "break-word" }}
          >
            {JSON.stringify(
              ephemeralContext.dappTransactionEvent!.data[0],
              undefined,
              2
            )}
          </div>

          <Footer>
            <Button onClick={back} className="px-10" centered>
              Back
            </Button>
            <Button onClick={send} variant="primary" centered className="px-10">
              Next
            </Button>
          </Footer>
        </>
      )}
    </ScreenContainer>
  );
};
