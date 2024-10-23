type CommandType = RpcCall | BackgroundCommand | string;

export class Command {
  id: string;

  type: CommandType;

  data: any;

  constructor(type: CommandType, data?: any) {
    this.id = `command_${Math.floor(Math.random() * 1000000)}`;
    this.type = type;
    this.data = data;
  }
}

export enum RpcCall {
  EthRequestAccounts = "eth_requestAccounts",
  EthAccounts = "eth_accounts",
  EthSendTranasaction = "eth_sendTransaction",
  EthChainId = "eth_chainId",
  EthEstimateGas = "eth_estimateGas",
  EthCall = "eth_call",
  EthGetBlockNumber = "eth_blockNumber",
  NetVersion = "net_version",
  WalletRevokePermissions = "wallet_revokePermissions",
  WalletSwitchEthereumChain = "wallet_switchEthereumChain",
  WalletRequestPermissions = "wallet_requestPermissions",
}

export enum BackgroundCommand {
  OpenPopup,
}

export type CommandResult = {
  id: string;
  data: any;
};
