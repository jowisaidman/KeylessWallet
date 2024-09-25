import { Eip1193Provider } from "ethers";
import {
  ProviderInfo,
  EIP6963ProviderInfo,
  EIP6963ProviderDetail,
  ProviderDetail,
} from "./providerInfo";

export { ProviderInfo };

export function setupAnnounceProvider(
  provider: Eip1193Provider,
  info: EIP6963ProviderInfo
) {
  const announceEvent = new CustomEvent("eip6963:announceProvider", {
    detail: Object.freeze({ info, provider }),
  });

  // The Wallet dispatches an announce event which is heard by
  // the DApp code that had run earlier
  window.dispatchEvent(announceEvent);

  // The Wallet listens to the request events which may be
  // dispatched later and re-dispatches the `EIP6963AnnounceProviderEvent`
  window.addEventListener("eip6963:requestProvider", () => {
    window.dispatchEvent(announceEvent);
  });
}
