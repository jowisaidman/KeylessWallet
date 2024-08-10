import React, { FC } from "react";
import { useContext, useEffect, useState } from "react";
import { LabelledButton } from "../components/LabelledButton";
import { Button } from "../components/Button";
import { Tabs, Tab } from "../components/Tabs";
import { WalletContext, IWalletContext } from "../context/context";
import { watchAddress, changeScreen, Screen } from "../utils/navigation";

export const Welcome: FC<{ syncedWithStorage: boolean }> = ({
  syncedWithStorage,
}) => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const [sign, setSign] = useState("");

  useEffect(() => {
    if (syncedWithStorage && walletContext.currentAccount == null) {
      changeScreen(Screen.SyncAddress);
    }
  }, [walletContext]);

  const connectMetamask = async () => {
    console.log('Retrieving signed message from storage');
  
    try {
      const result: any = await new Promise((resolve, reject) => {
        chrome.storage.local.get("signedMessage", (data) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(data.signedMessage);
          }
        });
      });
  
      console.log("Signed message: ", result);
      setSign(result);
  
    } catch (error) {
      console.error('Error retrieving signed message:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 grow mt-5 pb-5 h-full">
      <div className={`flex flex-col items-center justify-center`}>
        <div className="text-primary font-bold">Network</div>

        <select className="text-secondary" id="networkSelector">
          <option value="1">Ethereum Mainnet</option>
          <option value="11155111">Ethereum Sepolia</option>
          <option value="8453">Base</option>
          <option value="84532">Base Sepolia</option>
        </select>

        <div className="text-primary font-bold">Account</div>

        <div className="text-secondary">
          {walletContext.currentAccount?.address || "No Address Loaded"}
        </div>
        <Button
          variant="secondary"
          size="lg"
          className="mt-3"
          onClick={() => {
            const networkSelector = document.getElementById('networkSelector') as HTMLSelectElement;
            const selectedValue = networkSelector.value;
            watchAddress(walletContext.currentAccount?.address, parseInt(selectedValue, 10));
          }}>
            Address information
        </Button>

        <div className="font-bold text-3xl mt-3 mb-3">0 Eth</div>

        <div className="flex items-center space-x-3">
          <LabelledButton
            variant="primary"
            centered
            size="lg"
            className="px-5"
            label="Send"
          >
            ↗
          </LabelledButton>
          <LabelledButton
            variant="primary"
            centered
            size="lg"
            className="px-5"
            label="Receive"
            onClick={async () => await changeScreen(Screen.QrToSign)}
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

        <div>
          <Button
            variant="primary"
            centered
            size="lg"
            className="px-5"
            onClick={connectMetamask}
          >
            Connect Metamask
          </Button>
        </div>

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
