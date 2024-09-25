// This script is injected in the DOM and is the nexus between the extension and the dApp
"use strict";
import { Eip1193Provider } from "ethers";
import { dispatchEvent } from "../communication";
import Provider from "./eip1193";
import { ProviderInfo, setupAnnounceProvider } from "./eip6963";

// We need this declaration to be able to inject our provider in window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}

async function attachKeylessExtension() {
  const customProvider = new Provider(dispatchEvent);

  window.ethereum = customProvider;
  setupAnnounceProvider(customProvider, ProviderInfo);
  console.log(window.ethereum);
}

console.log("** KeyLess - loading..");
window.addEventListener("load", attachKeylessExtension);
