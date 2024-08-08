import { EIP1193Provider } from "web3";
import { ProviderRequest, Command } from ".";
import { dispatchEvent } from "../utils/utils";

export class WalletProvider {
  name: string;
  provider: EIP1193Provider<any>;

  constructor(name: string, provider: EIP1193Provider<any>) {
    this.name = name;
    this.provider = provider;
  }

  interceptRequests() {
    if (!this.provider.request) return;

    const originalRequest = this.provider.request;
    const request: ProviderRequest<unknown[] | undefined> = (request) => {
      if (request.method == "eth_sendTransaction") {
        const command: Command = {
          type: request.method,
          data: request.params,
        };

        dispatchEvent(command);
      }
      return originalRequest(request);
    };

    // @ts-ignore
    this.provider.request = request;
  }

  async notifyChainId(): Promise<void> {
    if (!this.provider.request) return;

    const chainId = (await this.provider.request({
      method: "eth_chainId",
    })) as string;
    const command: Command = {
      type: "eth_chainId",
      data: {
        chainId: parseInt(chainId, 16),
      },
    };

    dispatchEvent(command);
  }

  on(event: "chainChanged", listener: (chainId: string) => void): void {
    this.provider.on(event, listener);
  }
}
