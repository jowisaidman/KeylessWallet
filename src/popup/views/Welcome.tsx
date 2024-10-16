import React, { FC } from "react";
import { useContext, useEffect, useState } from "react";
import { LabelledButton } from "../components/LabelledButton";
import { Button } from "../components/Button";
import { Tabs, Tab } from "../components/Tabs";
import { WalletContext, IWalletContext } from "../context/context";
import {
  watchAddress,
  changeScreen,
  Screen,
  changeNetwork,
} from "../navigation";
import { getBalance, sendToChain } from "../transaction";
import { networks } from "../networks";
import Select from "react-select";

export const Welcome: FC<{ syncedWithStorage: boolean }> = ({
  syncedWithStorage,
}) => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const [balance, setBalance] = useState<string>();

  useEffect(() => {
    console.log("contexto", walletContext);
    if (syncedWithStorage && walletContext.currentAccount == null) {
      changeScreen(Screen.SyncAddress);
    }
  }, [walletContext]);

  useEffect(() => {
    if (syncedWithStorage && walletContext.currentAccount != null) {
      getBalance(walletContext.currentAccount?.address).then(setBalance);
    }
  }, [walletContext.currentAccount, walletContext.network]);

  return (
    <div className="flex flex-col items-center gap-5 grow mt-5 pb-5 h-full">
      <div className={`flex flex-col items-center justify-center`}>
        <div className="text-primary font-bold">Network</div>

        {walletContext.network.label}
        {walletContext.network.value}

        <Select
          className="text-secondary"
          id="networkSelector"
          options={networks}
          onChange={changeNetwork}
          defaultValue={walletContext.network}
        />

        <div className="text-primary font-bold">Account</div>

        <div className="text-secondary">
          {walletContext.currentAccount?.address || "No Address Loaded"}
        </div>
        <Button
          variant="secondary"
          size="lg"
          className="mt-3"
          onClick={() => {
            console.log(walletContext);
            watchAddress(
              walletContext.currentAccount?.address,
              walletContext.network?.value
            );
          }}
        >
          Address information
        </Button>

        <div className="font-bold text-3xl mt-3 mb-3">{balance} Eth</div>

        <div className="flex items-center space-x-3">
          <LabelledButton
            variant="primary"
            centered
            size="lg"
            className="px-5"
            label="Send"
            onClick={async () => await changeScreen(Screen.Send)}
          >
            ↗
          </LabelledButton>
          <LabelledButton
            variant="primary"
            centered
            size="lg"
            className="px-5"
            label="Receive"
          >
            ↙
          </LabelledButton>
          <LabelledButton
            variant="primary"
            centered
            size="lg"
            className="px-5"
            label="Sync Account"
            onClick={async () => await changeScreen(Screen.SyncAddress)}
          >
            &#8634;
          </LabelledButton>
        </div>
        <br />

        <Tabs>
          <Tab label="Tokens">
            <div className="py-4">Token list</div>
          </Tab>
          <Tab label="History">
            <div className="py-4">Transaction history</div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Welcome;
