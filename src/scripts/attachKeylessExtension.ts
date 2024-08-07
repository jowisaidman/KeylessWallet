"use strict";
import { BrowserProvider, Eip1193Provider } from "ethers";
import { EIP6963AnnounceProviderEvent, EIP6963ProviderDetail } from "web3/lib/commonjs/web3_eip6963";
import { WalletProvider } from "../models/provider";

export enum SupportedWallets {
    METAMASK = "MetaMask",
    TRUST_WALLET = "Trust Wallet",
    PHANTOM = "Phantom"
  }

declare global{
  interface WindowEventMap {
    "eip6963:announceProvider": EIP6963AnnounceProviderEvent
  }
}

let providers: Map<string, EIP6963ProviderDetail> = new Map();


async function attachKeylessExtension() {
    window.dispatchEvent(new Event("eip6963:requestProvider"));

  let wallet_providers: Array<WalletProvider> = [];
  Object.values(SupportedWallets).forEach((elem) => {
    let provider = providers.get(elem);
    if (provider) {
        wallet_providers.push(new WalletProvider(elem, provider.provider));
      }
    }
  );

  wallet_providers.forEach(async (provider) => {
    provider.interceptRequests();
    await provider.notifyChainId();
    
    provider.on("chainChanged", (chainId: any) => {
      const event = new CustomEvent("KeylessInterception", {
        detail: {
          type: "eth_chainId",
          data: {
            chainId: parseInt(chainId, 16),
          },
        },
      });

      window.dispatchEvent(event);
    });
  });

  if (wallet_providers.length == 0) {
    console.log("** No wallet installed **");
  }

  console.log(`** Interception done **`);
}

//window.addEventListener(
//  "message",
//  (event) => {
//      console.log("AAAAAAAAAAAAAAAAA");
//      attachKeylessExtension();
//  },
//  false,
//);

console.log('** KeyLess - loading..');
window.addEventListener('load', attachKeylessExtension);

window.addEventListener("eip6963:announceProvider", (event: EIP6963AnnounceProviderEvent) => {
    const { icon, rdns, uuid, name } = event.detail.info;
  
    if (!icon || !rdns || !uuid || !name) {
        console.error("invalid eip6963 provider info received!");
        return;
    }
  
    providers.set(name, event.detail);
})