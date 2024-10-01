import React, { useContext, FC, useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Tabs, Tab } from "../components/Tabs";
import Title from "../components/Title";
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";
import { getTransaction } from "../transaction";
import { WalletContext, IWalletContext } from "../context/context";
import Loading from "../components/Loading";
import { changeScreen, Screen } from "../navigation";
import convertToHex from "../../utils/convertToHex";
import { updateState } from "../context/context";
import { networks, Network } from "../networks";
import { RpcError, RpcErrorCode } from "../../scripts/eip1193/provider";

type EventData = any; /*= {
    origin: string;
    0: { chainId: string }[];
};*/

export const SwitchChain: FC<{
  syncedWithStorage: boolean;
  sendResponse: (r: object | null) => void;
  eventData: EventData;
}> = ({ syncedWithStorage, sendResponse, eventData }) => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);

  const [networkToSwitch, setNetworkToSwitch] = useState<Network | undefined>();

  useEffect(() => {
    // If the origin is null we probably have a bug, to not leave the addon blank, we move back
    // to welcome
    console.log("la data", eventData);
    if (eventData == null) {
      changeScreen(Screen.Welcome);
    } else {
      const chainIdToChange = eventData[0].chainId;
      const network = networks.find(
        (n: Network) => convertToHex(n.value) == chainIdToChange
      );
      if (network != null) {
        setNetworkToSwitch(network);
      } else {
        sendResponse(
          new RpcError(RpcErrorCode.UnrecognizedChainId, "unssuported chain")
        );
        changeScreen(Screen.Welcome);
      }
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
    await updateState((currentState) => {
      currentState.network = networkToSwitch!;
      return currentState;
    });
    sendResponse(null);
    await changeScreen(Screen.Welcome);
  }

  return (
    <div className="flex flex-col items-center gap-5 grow p-5 h-full justify-between">
      {eventData == null || networkToSwitch == null ? (
        <Loading />
      ) : (
        <>
          <Title title="Switch chain" />
          <div className="flex">
            <img
              src={walletContext.network.icon || "generic_chain.svg"}
              width="64px"
            ></img>
            <i className="ri-arrow-right-line text-8xl text-secondary p-5"></i>
            <img
              src={networkToSwitch.icon || "generic_chain.svg"}
              width="64px"
            ></img>
          </div>
          <p className="text-center text-lg">
            The site{" "}
            <span className="font-bold text-accent">{eventData.origin}</span>{" "}
            wants to switch from{" "}
            <span className="font-bold text-accent">
              {walletContext.network.label}{" "}
            </span>{" "}
            to
            <span className="font-bold text-accent">
              {" "}
              {networkToSwitch.label}
            </span>
          </p>
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

export default SwitchChain;
