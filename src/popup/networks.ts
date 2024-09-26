export type Network = {
  value: string;
  label: string;
  icon?: string;
};

// Supported networks
export const networks: Network[] = [
  { value: "1", label: "Ethereum", icon: "ethereum.svg" },
  { value: "137", label: "Polygon", icon: "polygon.svg" },
  { value: "42161", label: "Arbitrum", icon: "arbitrum.svg" },
  { value: "8453", label: "Base", icon: "base.svg" },
  { value: "11155111", label: "Ethereum Sepolia" },
  { value: "84532", label: "Base Sepolia" },
];
