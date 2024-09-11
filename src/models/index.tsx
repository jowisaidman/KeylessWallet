export type Command = {
  type: string;
  data: any;
};

export interface JsonRpcRequest<TRequest> {
  id: string | number | undefined;
  jsonrpc: "2.0";
  method: string;
  params?: TRequest;
}

export type ProviderRequest<T> = (
  request: JsonRpcRequest<T>
) => Promise<unknown>;

export enum RpcCall {
  EthSendTransaction = "eth_sendTransaction",
  EthRequestAccounts = "eth_requestAccounts",
  EthAccounts = "eth_accounts",
  EthChainId = "eth_chainId",
}
