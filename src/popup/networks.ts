type ExplorerUrls = {
  hash: string;
  address: string;
};

export type Network = {
  value: string;
  label: string;
  icon?: string;
  explorerUrls: ExplorerUrls;
};

// Supported networks
export const networks: Network[] = [
  {
    value: "1",
    label: "Ethereum",
    icon: "ethereum.svg",
    explorerUrls: {
      hash: "https://etherscan.io/tx/<hash>",
      address: "https://etherscan.io/address/<address>",
    },
  },
  {
    value: "137",
    label: "Polygon",
    icon: "polygon.svg",
    explorerUrls: {
      hash: "https://polygonscan.com/tx/<hash>",
      address: "https://polygonscan.com/address/<address>",
    },
  },
  {
    value: "42161",
    label: "Arbitrum",
    icon: "arbitrum.svg",
    explorerUrls: {
      hash: "https://arbiscan.io/tx/<hash>",
      address: "https://arbiscan.io/address/<address>",
    },
  },
  {
    value: "8453",
    label: "Base",
    icon: "base.svg",
    explorerUrls: {
      hash: "https://basescan.org/tx/<hash>",
      address: "https://basescan.org/address/<address>",
    },
  },
  {
    value: "11155111",
    label: "Ethereum Sepolia",
    explorerUrls: {
      hash: "https://sepolia.etherscan.io/tx/<hash>",
      address: "https://sepolia.etherscan.io/address/<address>",
    },
  },
  {
    value: "84532",
    label: "Base Sepolia",
    explorerUrls: {
      hash: "https://sepolia.basescan.org/tx/<hash>",
      address: "https://sepolia.basescan.org/address/<address>",
    },
  },
];
