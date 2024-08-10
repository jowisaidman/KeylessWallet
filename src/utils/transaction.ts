import { ethers } from 'ethers'

// const NODE_URL = 'https://scroll-testnet.rpc.grove.city/v1/a7a7c8e2';
const NODE_URL = 'https://eth-sepolia.api.onfinality.io/public';
// const web3 = new Web3(NODE_URL);
export const provider = new ethers.JsonRpcProvider(NODE_URL);
        // "chainId": 534351,
export function getTransaction(to: string, value: number, nonce: number): string {
    const tx = {
        "type": 2,
        "chainId": 11155111,
        "nonce": nonce,
        "maxPriorityFeePerGas": "882358428",
        "maxFeePerGas": "42874510220",
        "gasLimit": 22000,
        "to": to,
        "value": `${value}`,
        "data":"0x",
        "accessList": []
    };

    return JSON.stringify(tx);
}

export async function sendToChain(signedTransaction: string) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "jsonrpc":"2.0",
        "id":0,
        "method":"eth_sendRawTransaction",
        "params":[signedTransaction]
      })
    };

    try {
        let receipt = await fetch(NODE_URL, requestOptions);
        console.log(`txn receipt`, await receipt.text());
    } catch(e) {
        console.log(`Error sending tx to chain ${e}`);
    }
}

// Returns the balance in ethers
export async function getBalance(account: string): Promise<string> {
    const balance = await provider.getBalance(account);
    return ethers.formatUnits(balance, 'ether').substring(0, 6);
}

export async function getNextNonce(account: string): Promise<number> {
    return await provider.getTransactionCount(account);
}
