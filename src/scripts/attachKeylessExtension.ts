"use strict";
import { BrowserProvider, Eip1193Provider } from "ethers";
import {
  EIP6963AnnounceProviderEvent,
  EIP6963ProviderDetail,
} from "web3/lib/commonjs/web3_eip6963";
import { WalletProvider } from "../models/provider";

export enum SupportedWallets {
  METAMASK = "MetaMask",
  TRUST_WALLET = "Trust Wallet",
  PHANTOM = "Phantom",
}

declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": EIP6963AnnounceProviderEvent;
  }
}

declare global {
  interface Window {
    ethereum: any;
  }
}

const ACCOUNT = "0x9A85ed0190C0946C7aF69C11c184A1598199d0c3";

let providers: Map<string, EIP6963ProviderDetail> = new Map();

let accountsChanged: any = undefined;
let chainChanged: any = undefined;
let networkChanged: any = undefined;
let connect: any = undefined;

const originalEthereum = window.ethereum;

class Provider implements Eip1193Provider {
  wallet = "Keyless";

  isMetaMask = true;

  constructor() {}

  request(request: {
    method: string;
    params?: Array<any> | Record<string, any>;
  }): Promise<any> {
    return process_request(request.method, request.params);
    //return Promise.resolve();
  }

  enable() {
    console.log("connecting");
    return new Promise((f: any) => f()).then((a: any) =>
      console.log("===>", a)
    );
  }

  on(event: string, callback: any) {
    console.log("event:", event, callback);
    switch (event) {
      case "accountsChanged":
        accountsChanged = callback;
        break;
      case "chainChanged":
        chainChanged = callback;
        break;
      case "networkChanged":
        networkChanged = callback;
        break;
      case "connect":
        connect = callback;
        break;

      default:
        break;
    }
    // callback()
  }

  send(method: string, params: Array<any> | Record<string, any>): Promise<any> {
    return process_request(method, params);
  }
}

function process_request(
  method: string,
  params?: Array<any> | Record<string, any>
): Promise<any> {
  console.log("process =====>", method, JSON.stringify(params, undefined, 2));
  switch (method) {
    case "eth_chainId":
      return eth_chainId();
    case "eth_requestAccounts":
    case "eth_accounts":
      return eth_requestAccounts();
    case "net_version":
      return net_version();
    case "wallet_requestPermissions":
      return requestPermissions();
    default:
      console.log("default");
      return originalEthereum.request({ method, params });
  }
}

async function requestPermissions(): Promise<any> {
  return {
    jsonrpc: "2.0",
    result: [
      {
        parentCapability: "eth_accounts",
        invoker: "https://www.sushi.com",
        caveats: [
          {
            type: "restrictReturnedAccounts",
            value: [ACCOUNT],
          },
        ],
        date: Date.now(),
      },
    ],
  };
  // return {"jsonrpc":"2.0","id": undefined,"result":true};
}

async function eth_accounts(): Promise<any> {
  // await accountsChanged(ACCOUNT);
  // return {"jsonrpc":"2.0", "result":[ACCOUNT]};
  console.log("asd");
  return ACCOUNT;
}

async function eth_requestAccounts(): Promise<any> {
  console.log(chainChanged);
  if (accountsChanged) {
    await accountsChanged(ACCOUNT);
  }
  //originalEthereum.request({ method: 'eth_requestAccounts' });
  // return Promise.resolve("0x9A85ed0190C0946C7aF69C11c184A1598199d0c3us");
  return [ACCOUNT];
  // return {"jsonrpc":"2.0","result":[ACCOUNT]};
}

async function eth_chainId(): Promise<any> {
  console.log(chainChanged);
  if (chainChanged) {
    await chainChanged("0x1");
  }

  return "0x1";
  // return {"jsonrpc":"2.0","id": undefined,"result":"0x1"};
}

async function net_version(): Promise<any> {
  console.log(networkChanged);
  if (networkChanged) {
    await networkChanged("1");
  }

  return { jsonrpc: "2.0", id: undefined, result: "1" };
}

async function attachKeylessExtension() {
  const custom_provider = new Provider();
  // const provider = new BrowserProvider(custom_provider);
  window.ethereum = custom_provider;
  console.log(window.ethereum);

  /*
    console.log("Provider", provider);*/
  
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
    }); });

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


window.addEventListener('signMessageEvent', async (event) => {
    console.log("Received signMessageEvent:", event);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("AAAAAAAu12319283912391923");
    if (request.type === 'signMessageEvent') {
      // Dispatch a custom event to the main window
      const event = new CustomEvent('signMessageEvent', {
        detail: request.payload
      });
      
      // Dispatch the event to the main window
      window.dispatchEvent(event);
      sendResponse({ status: 'event dispatched' });
    }
    return true;
  });

console.log("** KeyLess - loading..");
window.addEventListener("load", attachKeylessExtension);

window.addEventListener(
  "eip6963:announceProvider",
  (event: EIP6963AnnounceProviderEvent) => {
    const { icon, rdns, uuid, name } = event.detail.info;

    if (!icon || !rdns || !uuid || !name) {
      console.error("invalid eip6963 provider info received!");
      return;
    }

    providers.set(name, event.detail);
  }
);
