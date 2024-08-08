import React from "react";
import { LabelledButton } from "../components/LabelledButton";
import { Tabs, Tab } from "../components/Tabs";

export default () => {
  return (
    <div className="flex flex-col items-center gap-5 grow mt-5 pb-5 h-full">
      <div className={`flex flex-col items-center justify-center`}>
        <div className="text-primary font-bold">Account</div>
        <div className="text-secondary">
          0x9A85ed0190C0946C7aF69C11c184A1598199d0c3us
        </div>
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
          >
            ↙
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
