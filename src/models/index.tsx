export class Command {
    id: string;

    type: string

    data: any;

    constructor(type: string, data?: object) {
        this.id = `command_${Math.floor(Math.random() * 1000000)}`;
        this.type = type;
        this.data = data;
    }
}

export interface JsonRpcRequest<TRequest> {
  id: string | number | undefined;
  jsonrpc: "2.0";
  method: string;
  params?: TRequest;
}

export type ProviderRequest<T> = (
  request: JsonRpcRequest<T>
) => Promise<unknown>;
