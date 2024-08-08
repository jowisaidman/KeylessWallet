import React, { useEffect, useState } from "react";
import { LabelledButton } from "../components/LabelledButton";
import { Tabs, Tab } from "../components/Tabs";
import { Button } from "../components/Button";
import { Command } from "../models";
import { dispatchEvent } from "../utils/utils";

export default () => {
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>();


  async function connectMetamask() {
    setBalance(window.parent.chrome.toString());
    
    const message = 'Hello, World!';
    const from = '0xd0D1D4953Ccd9DDE54D9bFA9815483cba77dD5bf';
    
    chrome.runtime.sendMessage({
      type: 'signMessageEvent',
      payload: {
        message,
        from
      }
    }, (response) => {
      console.log('Response from background script:', response);
    });
  }


  useEffect(() => {
    chrome.storage.sync.get(["account"], (result) => {
        //if (!result.account) {
        //  chrome.storage.sync.set({ source: "sync" });
        //} else {
        //  setAccount(result.account);
        //}
    })
  }, []);

  //useEffect(() => {
  //    if (account != "") {
  //        getBalance(account).then(setBalance);
  //    }
  //}, [account])

  return (
    <div className="flex flex-col items-center gap-5 grow mt-5 pb-5 h-full">
      <div className={`flex flex-col items-center justify-center`}>
        <div className="text-primary font-bold">Account</div>
        <div className="text-secondary">
          {account}
        </div>
        <div className="font-bold text-3xl mt-3 mb-3">{balance} Eth</div>

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
          >
            ↙
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
            Connect metamask
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
