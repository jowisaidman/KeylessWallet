import React, { FC } from "react";
import { useContext, useEffect, useState } from "react";
import { LabelledButton } from "../components/LabelledButton";
import { Button } from "../components/Button";
import { Tabs, Tab } from "../components/Tabs";
import { WalletContext, IWalletContext } from "../context/context";
import NetworkSelector from "../components/NetworkSelector";
import TransactionHistory from "../components/TransactionHistory";
import OptionsMenu from "../components/OptionsMenu";
import AccountLabel from "../components/AccountLabel";
import AccountAvatar from "../components/AccountAvatar";
import EmptyState from "../components/EmptyState";
import ButtonIcon from "../components/ButtonIcon";
import { changeScreen, Screen } from "../navigation";
import { getBalance, TransactionItem, EIP1559TransactionBuilder } from "../../utils/transaction";
import { networks, changeNetwork } from "../networks";
import { ethers } from "ethers";
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";

const COPY_ADDRESS_TOOLTIP_TEXT = "Copy address";

export const Welcome: FC<{}> = ({}) => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const ephemeralContext = useContext<ITransactionContext>(TransactionContext);

  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  const [copyAddressTooltip, setCopyAddressTooltip] = useState<string>(
    COPY_ADDRESS_TOOLTIP_TEXT
  );

  useEffect(() => {
    if (walletContext.currentAccount == null) {
      changeScreen(Screen.SyncAddress);
    }
  }, [walletContext]);

  // Refresh balance when landing here or network parameters change
  useEffect(() => {
    if (walletContext.currentAccount != null) {
        if (ephemeralContext.rpcProvider == null) {
          ephemeralContext.rpcProvider = new ethers.JsonRpcProvider(
            walletContext.network.rpcEndpoints[0]
          );
        }
      refreshBalance();
    }
  }, [
    walletContext.currentAccount,
    walletContext.network,
    ephemeralContext.rpcProvider,
  ]);

  // Reset transactions if we are in Welcome
  useEffect(() => {
      console.log("always?");
        ephemeralContext.transaction = new EIP1559TransactionBuilder();
        ephemeralContext.dappTransactionEvent = null;
  }, [])


  function refreshBalance() {
    if (
      walletContext.currentAccount != null &&
      ephemeralContext.rpcProvider != null
    ) {
      setLoadingBalance(true);
      getBalance(
        walletContext.currentAccount!.address,
        ephemeralContext.rpcProvider
      ).then((b) => {
        ephemeralContext.currentBalance = b;
        setLoadingBalance(false);
      });
    }
  }

  function getTrasactionHistory(): TransactionItem[] | null {
    let address = walletContext.currentAccount!.address;
    let chainId = Number(walletContext.network.value);
    if (
      walletContext.transactionHistory[address] == null ||
      walletContext.transactionHistory[address][chainId] == null
    ) {
      return null;
    } else {
      return walletContext.transactionHistory[address][chainId];
    }
  }

  function openAddressInExplorer() {
    if (walletContext.currentAccount != null) {
      window.open(
        walletContext.network.explorerUrls.address.replace(
          "<address>",
          walletContext.currentAccount!.address
        ),
        "_blank"
      );
    }
  }

  function copyAddress() {
    if (walletContext.currentAccount != null) {
      navigator.clipboard.writeText(walletContext.currentAccount!.address);
      setCopyAddressTooltip("Address copied!");
      setTimeout(() => setCopyAddressTooltip(COPY_ADDRESS_TOOLTIP_TEXT), 3000);
    }
  }

  return (
    <>
      <div className="flex w-full p-2 justify-between">
        <NetworkSelector
          selectedChain={walletContext.network.value}
          changeNetwork={changeNetwork}
        />
        <OptionsMenu />
      </div>

      <div className="flex flex-col items-center">
        <div className="text-center">
          <AccountAvatar
            imageData={walletContext.currentAccount?.avatar || ""}
            className="mb-3"
          />
          <AccountLabel
            account={walletContext.currentAccount?.address || ""}
            label={walletContext.currentAccount?.label || ""}
            className="mb-2"
          />
          <div className="flex justify-center">
            <ButtonIcon
              icon="file-copy-line"
              tooltip={copyAddressTooltip}
              onClick={copyAddress}
              size="sm"
            />
            <ButtonIcon
              icon="search-line"
              tooltip="Open block explorer"
              onClick={openAddressInExplorer}
              size="sm"
            />
            <ButtonIcon
              icon="refresh-line"
              tooltip="Refresh balance"
              onClick={refreshBalance}
              size="sm"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        {loadingBalance ? (
          <div className="skeleton h-8 w-28 m-3"></div>
        ) : (
          <div className="font-bold text-3xl m-3">
            {ethers
              .formatUnits(ephemeralContext.currentBalance, "ether")
              .substring(0, 6)}{" "}
            {walletContext.network.unitNames[0]}
          </div>
        )}

        <div className="flex items-center space-x-3">
          <ButtonIcon
            variant="primary"
            size="md"
            label="Send"
            tooltip="Send tokens"
            icon="arrow-right-up-line"
            onClick={() => changeScreen(Screen.Send)}
          />
          <ButtonIcon
            variant="primary"
            size="md"
            label="Receive"
            tooltip="Show a QR of your address"
            icon="arrow-left-down-line"
            onClick={() => changeScreen(Screen.Send)}
          />
          <ButtonIcon
            variant="primary"
            size="md"
            label="Resync"
            icon="loop-right-line"
            tooltip="Re-sync offline acount"
            onClick={() => changeScreen(Screen.SyncAddress)}
          />
        </div>
        <div className="bg-base-200 border-base-300 overflow-y-auto rounded-box my-4 w-[90%]">
          {getTrasactionHistory() != null ? (
            <TransactionHistory
              transactions={getTrasactionHistory()!}
              explorerUrl={walletContext.network.explorerUrls.hash}
              chainUnit={walletContext.network.unitNames[0]}
            />
          ) : (
            <EmptyState
              icon="file-paper-line"
              text="No transactions yet"
              subtext={`This account did not performed any transaction on ${walletContext.network.label} yet`}
              className="p-6"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Welcome;
