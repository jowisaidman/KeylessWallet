import { Eip1193Provider } from "ethers";
import { Command } from "../../models";

const ACCOUNT = "0xc573952EFF8FA663Cbc9CdA02f85BddBEeD275F3";
const NETWORK_ID = "0x14A34"; // Sepolia
// const NETWORK_ID ="0x1";

// Callback functions injected by the dApp.
// They are initialized as indefined and filled when the dApp injects them
let accountsChanged: any = undefined;
let chainChanged: any = undefined;
let networkChanged: any = undefined;
let connect: any = undefined;

interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

enum RpcErrorCode {
    // The user rejected the request.
    UserRejectedRequest = 4001,

    // The requested method and/or account has not been authorized by the user.
    Unauthorized = 4100,

    // The Provider does not support the requested method.
    UnsupportedMethod = 4200,

    // The Provider is disconnected from all chains.
    Disconnected = 4900,

    // 	The Provider is not connected to the requested chain.
    ChainDisconnected = 4901
}

interface ProviderRpcError extends Error {
  code: RpcErrorCode;
  data?: unknown;
}

class Provider implements Eip1193Provider {
  // Function used to dispatch events to the extension
  dispatchEvent: (c: Command) => void;

  wallet = "Keyless";

  // For testing, we say we are metamask
  // isMetaMask = true;

  constructor(dispatchEvent: (c: Command) => void) {
    this.dispatchEvent = dispatchEvent;
  }

  // Process RPC
  request(request: RequestArguments): Promise<any> {
    return this.process_request(request.method, request.params);
  }

  // This method is deprecated but still used by some dApps
  send(method: string, params: readonly unknown[] | object): Promise<any> {
    return this.process_request(method, params);
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

  process_request(
    method: string,
    params?: Array<any> | Record<string, any>
  ): Promise<any> {
    console.log("process =====>", method, JSON.stringify(params, undefined, 2));
    switch (method) {
      case "eth_chainId":
        return eth_chainId();
      case "eth_sendTransaction":
        this.dispatchEvent({
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

export default Provider;
