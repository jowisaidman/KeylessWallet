import React, { useEffect, useState, useRef } from "react";
import { Button } from "../components/Button";
import { Tabs, Tab } from "../components/Tabs";
import { QrReader } from "../components/QrReader";
import { AccountAvatar } from "../components/AccountAvatar";
import { AccountLabel } from "../components/AccountLabel";
import { Input } from "../components/Input";
import Title from "../components/Title";
import { changeScreen, Screen } from "../navigation";
import { updateState } from "../context/context";
import createAvatar from "../avatarGenerator";

export default () => {
  const [account, setAccount] = useState<string>();
  const [avatar, setAvatar] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(true);
  let accountLabel = useRef<HTMLInputElement>(null);

  function onScanAddress(account: string) {
    const avatar = createAvatar(account);
    setAvatar(avatar);
    setAccount(account);
    setScanning(false);
  }

  async function confirmAccount() {
    await updateState((currentState) => {
      const label = accountLabel.current?.value;
      currentState.currentAccount = {
        address: account!,
        type: "offline_wallet",
        label,
        avatar,
      };
      return currentState;
    });
    await changeScreen(Screen.Welcome);
  }

  function retry() {
    setScanning(true);
  }

  function cancel() {
    changeScreen(Screen.Welcome);
  }

  return (
    <div className="flex flex-col items-center gap-5 grow p-5 h-full justify-between">
      {scanning ? (
        <>
          <Title
            title="Sync with the offline wallet"
            subtitle="Scan the QR code showed in the offline to sync up your address"
          />
          <QrReader readInterval={500} onSuccess={onScanAddress} />

          <div className="flex items-center space-x-3 items-end mt-auto">
            <Button onClick={cancel} variant="primary" centered>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <Title
            title="Scanned address"
            subtitle="Check that the first and last digits are ok"
          />
          <AccountAvatar imageData={avatar} />
          <AccountLabel label={account!} />
          <label className="form-control w-full max-w-xs">
            <Input
              label="Account name (optional)"
              placeholder="Account 1"
              ref={accountLabel}
            />
          </label>
          <div className="flex items-center space-x-3 items-end mt-auto">
            <Button onClick={retry} className="px-10" centered>
              Retry
            </Button>
            <Button
              onClick={confirmAccount}
              variant="primary"
              centered
              className="px-10"
            >
              Confirm
            </Button>
          </div>
        </>
      )}
      <div></div>
    </div>
  );
};
