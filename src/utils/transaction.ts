import { ethers, Transaction } from "ethers";

const SEPOLIA_NODE_URL = "https://ethereum-sepolia-rpc.publicnode.com";
const SEPOLIA_BASE_NODE_URL = "https://base-sepolia-rpc.publicnode.com";
export let provider = new ethers.JsonRpcProvider(SEPOLIA_BASE_NODE_URL);

// Status of the tx
export enum TransactionItemStatus {
  Successful,
  Error,
  Pending,
}

// Type of the tx
export enum TransactionItemType {
  // Native coin transfers
  Common,
  // ERC-20 transfers
  Erc20,
  // Dapp transaction
  Dapp,
}

// This is the detail for common transactions. We will have other types, for example for ERC-20
// transactions
type TransactionItemDetail = {
  to: string;
  value: bigint;
};

// This is an item from a transaction performed with the plugin. We use this in the list of
// performed transactions
export interface TransactionItem {
    date: number;

  status: TransactionItemStatus;

  hash: string;

  type: TransactionItemType;

  detail: TransactionItemDetail;
}

export class TransactionItemBuilder {
  private item: Partial<TransactionItem> = {};

  setStatus(status: TransactionItemStatus): TransactionItemBuilder {
    this.item.status = status;
    return this;
  }

  setDate(date: number): TransactionItemBuilder {
    this.item.date = date;
    return this;
  }

  setHash(hash: string): TransactionItemBuilder {
    this.item.hash = hash;
    return this;
  }

  setDetail(detail: TransactionItemDetail): TransactionItemBuilder {
    this.item.type = TransactionItemType.Common;
    this.item.detail = detail;
    return this;
  }

  build(): TransactionItem {
    if (
      this.item.status != undefined &&
      this.item.hash != undefined &&
      this.item.type != undefined &&
      this.item.detail != undefined
    ) {
      return this.item as TransactionItem;
    } else {
      throw new Error("a mandatory field is missing");
    }
  }
}

export interface EIP1559Transaction {
  // The type field indicates that it's an EIP-1559 transaction (usually type 2).
  type: number; // Should be 2 for EIP-1559

  //
  // Fields inherited from legacy transactions:
  //

  // The number of transactions sent from this address.
  nonce: number;

  // (Optional) Address to send the transaction to. Can be undefined for contract creation.
  to?: string;

  // The amount of Ether to send (in wei).
  value: string;

  // Encoded contract data or empty for a simple Ether transfer.
  data: string;

  //
  // Fields specific to EIP-1559 transactions:
  //

  // The ID of the chain (e.g., 1 for mainnet, 3 for ropsten).
  chainId: number;

  // Max priority fee (tip) per gas in wei.
  maxPriorityFeePerGas: string;

  // Max total fee per gas (base fee + priority fee) in wei.
  maxFeePerGas: string;

  // The maximum gas allowed for the transaction.
  gasLimit: string;

  //
  // Optional for signature
  //

  // Recovery ID for the transaction.
  v?: string;

  // ECDSA signature r value.
  r?: string;

  // ECDSA signature s value.
  s?: string;
}

export class EIP1559TransactionBuilder {
  private transaction: Partial<EIP1559Transaction> = {};

  constructor() {
    this.transaction.type = 2; // EIP-1559 transactions are of type 2.
  }

  setNonce(nonce: number): EIP1559TransactionBuilder {
    this.transaction.nonce = nonce;
    return this;
  }

  setTo(to: string): EIP1559TransactionBuilder {
    this.transaction.to = to;
    return this;
  }

  setValue(value: string): EIP1559TransactionBuilder {
    this.transaction.value = value;
    return this;
  }

  setData(data: string): EIP1559TransactionBuilder {
    this.transaction.data = data;
    return this;
  }

  setChainId(chainId: number): EIP1559TransactionBuilder {
    this.transaction.chainId = chainId;
    return this;
  }

  setMaxPriorityFeePerGas(
    maxPriorityFeePerGas: string
  ): EIP1559TransactionBuilder {
    this.transaction.maxPriorityFeePerGas = maxPriorityFeePerGas;
    return this;
  }

  setMaxFeePerGas(maxFeePerGas: string): EIP1559TransactionBuilder {
    this.transaction.maxFeePerGas = maxFeePerGas;
    return this;
  }

  setGasLimit(gasLimit: string): EIP1559TransactionBuilder {
    this.transaction.gasLimit = gasLimit;
    return this;
  }

  setSignature(v: string, r: string, s: string): EIP1559TransactionBuilder {
    this.transaction.v = v;
    this.transaction.r = r;
    this.transaction.s = s;
    return this;
  }

  preview(): Readonly<Partial<EIP1559Transaction>> {
    return this.transaction;
  }

  build(): EIP1559Transaction {
    // Ensure required fields are present before returning the transaction.
    if (
      this.transaction.nonce === undefined ||
      this.transaction.chainId === undefined ||
      this.transaction.maxFeePerGas === undefined ||
      this.transaction.maxPriorityFeePerGas === undefined ||
      this.transaction.gasLimit === undefined ||
      this.transaction.value === undefined ||
      this.transaction.data === undefined
    ) {
      throw new Error("Missing required fields to build the transaction.");
    }

    // TypeScript will infer the types of the completed transaction due to the Partial type.
    return this.transaction as EIP1559Transaction;
  }
}

export type GasFee = {
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
};

export async function estimateGasFee(): Promise<GasFee> {
  let feeData = await provider.getFeeData();

  return {
    maxFeePerGas: feeData.maxFeePerGas!,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas!,
  };
}
