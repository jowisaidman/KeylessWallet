import { Eip1193Provider } from "ethers";
import { Command, RpcCall } from "../../communication";

// Type describing callback functions
type callbackFunction = (...args: any[]) => void;
type eventFunction = (e: Event) => void;

interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export class RpcError implements ProviderRpcError {
  message: string;

  code: number;

  data?: unknown;

  name: string;

  constructor(code: RpcErrorCode, message: string, data?: unknown) {
    this.message = message;
    this.code = code as number;
    this.data = data;
    this.name = RpcErrorCode[code as number];
  }
}

export enum RpcErrorCode {
  // The user rejected the request.
  UserRejectedRequest = 4001,

  // The requested method and/or account has not been authorized by the user.
  Unauthorized = 4100,

  // The Provider does not support the requested method.
  UnsupportedMethod = 4200,

  // The Provider is disconnected from all chains.
  Disconnected = 4900,

  // The Provider is not connected to the requested chain.
  ChainDisconnected = 4901,

  // Unrecognized chain Id. Used if the chain id is not supported
  UnrecognizedChainId = 4902,
}

class Provider implements Eip1193Provider {
  // Function used to dispatch events to the extension
  dispatchEvent: (c: Command) => Promise<unknown>;

  // Dictionary that contains a list of callbacks when an event is emitted
  events: EventTarget;

  // We keep track of which callback functions we registered in the event emitter to be able to remove them later
  registeredFunctions: Map<callbackFunction, eventFunction>;

  // We keep track of how many listeners are registered for specific events to be able to return true or false in the emit function. According to the official documentation, the EvenetEmitter's function returns true if there are listeners for the events or false otherwise
  registeredEvents: Map<string, number>;

  wallet = "Keyless";

  constructor(dispatchEvent: (c: Command) => Promise<unknown>) {
    this.dispatchEvent = dispatchEvent;
    this.events = new EventTarget();
    this.registeredFunctions = new Map();
    this.registeredEvents = new Map();
  }

  // Process RPC
  request(request: RequestArguments): Promise<any> {
    return this.processRequest(request.method, request.params);
  }

  // This method is deprecated but still used by some dApps
  send(method: string, params: readonly unknown[] | object): Promise<any> {
    return this.processRequest(method, params);
  }

  // EventEmitter's minimal implementation. We don't extend this from
  // node:events because it is not available in web context
  // We use native EventTarget
  on(event: string, callback: callbackFunction): this {
    const fn = (e: Event) => callback(...(<CustomEvent>e).detail);
    this.registeredFunctions.set(callback, fn);
    let registeredEvent = this.registeredEvents.get(event);
    this.registeredEvents.set(
      event,
      registeredEvent == null ? 1 : registeredEvent + 1
    );
    this.events.addEventListener(event, fn);
    return this;
  }

  removeListener(event: string, callback: callbackFunction): this {
    const fn = this.registeredFunctions.get(callback);
    if (fn != null) {
      let registeredEvent = this.registeredEvents.get(event);

      // If we are here this should never be null.. but you know how it is...
      if (registeredEvent != null) {
        if (registeredEvent == 1) {
          this.registeredEvents.delete(event);
        } else {
          this.registeredEvents.set(event, registeredEvent - 1);
        }
      }
      this.events.removeEventListener(event, fn);
    }

    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    this.events.dispatchEvent(new CustomEvent(event, { detail: args }));
    return this.registeredEvents.has(event);
  }

  processRequest(
    method: string,
    params?: Array<any> | Record<string, any>
  ): Promise<any> {
    console.log("ee ", method, params);
    const p = { origin: window.origin, ...params };
    return this.dispatchEvent(new Command(method, p)).then((r: any) => {
      switch (method) {
        case RpcCall.EthChainId:
          this.emit("chainChanged", r);
          break;
        case RpcCall.NetVersion:
          this.emit("networkChanged", r);
          break;
      }
      return r;
    });
  }
}

export default Provider;
