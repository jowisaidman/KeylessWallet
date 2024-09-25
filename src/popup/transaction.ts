import { ethers } from "ethers";

// const NODE_URL = 'https://scroll-testnet.rpc.grove.city/v1/a7a7c8e2';
const SEPOLIA_NODE_URL = "https://ethereum-sepolia-rpc.publicnode.com";
const SEPOLIA_BASE_NODE_URL = "https://base-sepolia-rpc.publicnode.com";
// const web3 = new Web3(NODE_URL);
export let provider = new ethers.JsonRpcProvider(SEPOLIA_BASE_NODE_URL);
let node_url = SEPOLIA_BASE_NODE_URL;
// "chainId": 534351,
export function getTransaction(to: string, value: number): string {
  const tx = {
    type: 2,
    chainId: 84532,
    maxPriorityFeePerGas: "882358428",
    maxFeePerGas: "42874510220",
    gasLimit: 22000,
    to: to,
    value: `${value}`,
    data: "0x",
    accessList: [],
  };

  return JSON.stringify(tx);
}

export async function sendToChain(signedTransaction: string) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 10,
      method: "eth_sendRawTransaction",
      params: [signedTransaction],
    }),
  };

  try {
    let receipt = await fetch(node_url, requestOptions);
    console.log(`txn receipt`, await receipt.text());
  } catch (e) {
    console.log(`Error sending tx to chain ${e}`);
  }
}

// Returns the balance in ethers
export async function getBalance(account: string): Promise<string> {
  const balance = await provider.getBalance(account);
  return ethers.formatUnits(balance, "ether").substring(0, 6);
}

export async function getNextNonce(account: string): Promise<number> {
  return await provider.getTransactionCount(account);
}

export async function updateProvider(chainId: string) {
  let new_node_url = "";

  if (chainId == "1") new_node_url = "https://ethereum-rpc.publicnode.com";
  else if (chainId == "11155111") new_node_url = SEPOLIA_NODE_URL;
  else if (chainId == "8453") new_node_url = "https://base-rpc.publicnode.com";
  else if (chainId == "84532") new_node_url = SEPOLIA_BASE_NODE_URL;

  provider = new ethers.JsonRpcProvider(new_node_url);
  node_url = new_node_url;
}
