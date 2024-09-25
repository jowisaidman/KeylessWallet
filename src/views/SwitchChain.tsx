import React, { useContext, FC, useEffect, useState } from "react";
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
import Loading from "../components/Loading";
import { changeScreen, Screen } from "../utils/navigation";
import convertToHex from "../utils/convertToHex";
import { updateState } from "../context/context";
import { networks } from "../utils/networks";
import { RpcError, RpcErrorCode } from "../scripts/eip1193/provider";

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

  const [networkToSwitch, setNetworkToSwitch] = useState<
    { value: string; label: string } | undefined
  >();

  useEffect(() => {
    // If the origin is null we probably have a bug, to not leave the addon blank, we move back
    // to welcome
    console.log("la data", eventData);
    if (eventData == null) {
      changeScreen(Screen.Welcome);
    } else {
      const chainIdToChange = eventData[0].chainId;
      const network = networks.find(
        (n) => convertToHex(n.value) == chainIdToChange
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
    <div className="flex flex-col items-center gap-5 grow px-5 h-full">
      {eventData == null || networkToSwitch == null ? (
        <Loading />
      ) : (
        <>
          <div className="text-primary font-bold text-2xl my-2">
            Switch chain
          </div>
          <p>
            The site {eventData.origin} wants to switch the chain to
            {networkToSwitch.label} (chain id {networkToSwitch.value})
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

export default SwitchChain;
