"use strict";
import { Eip1193Provider } from "ethers";
import { configureAndRenderExtension } from "../utils/popup";
import { dispatchEvent } from "../utils/utils";
import Provider from "./eip1193";

// We need this declaration to be able to inject our provider in window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}

async function attachKeylessExtension() {
  const customProvider = new Provider(dispatchEvent);
  window.ethereum = customProvider;
  console.log(window.ethereum);

  console.log(`** Interception done **`);
}

console.log("** KeyLess - loading..");
window.addEventListener("load", attachKeylessExtension);
