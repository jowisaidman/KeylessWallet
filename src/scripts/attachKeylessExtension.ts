"use strict";
import { Eip1193Provider } from "ethers";
import { configureAndRenderExtension } from "../utils/popup";
import { dispatchEvent } from "../utils/utils";

declare global {
  interface Window {
    ethereum: any;
  }
}

const ACCOUNT = "0x5049eefB03A5340aC55239eF1d2e21E35339E748";
const NETWORK_ID = "0x14A34"; // Sepolia
// const NETWORK_ID ="0x1";

// Callback function injected by the dApp
let accountsChanged: any = undefined;
let chainChanged: any = undefined;
let networkChanged: any = undefined;
let connect: any = undefined;

class Provider implements Eip1193Provider {
  wallet = "Keyless";

  // For testing, we say we are metamask
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
  }

  send(method: string, params: Array<any> | Record<string, any>): Promise<any> {
    return process_request(method, params);
  }
  // callback()
}

function process_request(
  method: string,
  params?: Array<any> | Record<string, any>
): Promise<any> {
  console.log("process =====>", method, JSON.stringify(params, undefined, 2));
  switch (method) {
    case "eth_chainId":
      return eth_chainId();
    case "eth_sendTransaction":
      dispatchEvent({
        type: method,
        data: params,
      });
      return new Promise(() => {});
    case "eth_requestAccounts":
    case "eth_accounts":
      return eth_requestAccounts();
    case "net_version":
      return net_version();
    case "wallet_requestPermissions":
      return requestPermissions();
    default:
      console.log("default");
      return Promise.resolve(1);
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
}

async function eth_accounts(): Promise<any> {
  return ACCOUNT;
}

async function eth_requestAccounts(): Promise<any> {
  console.log(chainChanged);
  if (accountsChanged) {
    await accountsChanged(ACCOUNT);
  }
  return [ACCOUNT];
  // return {"jsonrpc":"2.0","result":[ACCOUNT]};
}

async function eth_chainId(): Promise<any> {
  console.log(chainChanged);
  if (chainChanged) {
    await chainChanged(NETWORK_ID);
  }

  return NETWORK_ID;
}

async function net_version(): Promise<any> {
  console.log(networkChanged);
  if (networkChanged) {
    await networkChanged(NETWORK_ID);
  }

  return NETWORK_ID;
}

async function attachKeylessExtension() {
  const custom_provider = new Provider();
  window.ethereum = custom_provider;
  console.log(window.ethereum);

  console.log(`** Interception done **`);
}

console.log("** KeyLess - loading..");
window.addEventListener("load", attachKeylessExtension);
