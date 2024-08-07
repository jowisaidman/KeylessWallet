"use strict";
import { BrowserProvider, Eip1193Provider } from "ethers";

declare global {
    interface Window {
        ethereum: any;
    }
}
class Provider implements Eip1193Provider {
    constructor() {}

    request(request: { method: string, params?: Array<any> | Record<string, any> }): Promise<any> {
        console.log(request);
        return Promise.resolve("a");
    }

}
async function attach() {
    const custom_provider = new Provider;
    window.ethereum = custom_provider;
    console.log(window.ethereum);
    const provider = new BrowserProvider(window.ethereum);

    console.log("Provider", provider);
    provider.on("network", (newNetwork: any, oldNetwork: any) => {
      // When a provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      if (oldNetwork) {
        // chain has changed
      }
    });

}

window.addEventListener(
  "message",
  (event) => {
      console.log("AAAAAAAAAAAAAAAAA");
      attach();
  },
  false,
);

console.log('** KeyLess - loading..');
window.addEventListener('load', attach);
