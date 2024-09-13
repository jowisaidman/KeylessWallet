/*
export type Command = {
  type: string;
  data: any;
};*/

export interface JsonRpcRequest<TRequest> {
  id: string | number | undefined;
  jsonrpc: "2.0";
  method: string;
  params?: TRequest;
}

export type ProviderRequest<T> = (
  request: JsonRpcRequest<T>
) => Promise<unknown>;
