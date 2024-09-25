// import { v4 as uuidv4 } from "uuid";
import { Eip1193Provider } from "ethers";

/**
 * Represents the assets needed to display a wallet
 */
export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export const ProviderInfo = {
  uuid: "13d173a8-ed2c-4022-97b9-eac2a40fe6b5",
  name: "KeylessWallet",
  icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
  rdns: "com.keylesswallet.KeylessWallet",
} as EIP6963ProviderInfo;

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: Eip1193Provider;
}

export class ProviderDetail implements EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;

  provider: Eip1193Provider;

  constructor(info: EIP6963ProviderInfo, provider: Eip1193Provider) {
    this.info = info;
    this.provider = provider;
  }
}
