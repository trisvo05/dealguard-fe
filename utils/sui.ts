import { SuiClient } from "@mysten/sui/client";

const NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK || "devnet";

const NETWORKS: Record<string, string> = {
    localnet: "http://127.0.0.1:9000",
    devnet: "https://fullnode.devnet.sui.io:443",
    testnet: "https://fullnode.testnet.sui.io:443",
    mainnet: "https://fullnode.mainnet.sui.io:443",
};

export const suiClient = new SuiClient({
  url: NETWORKS[NETWORK] || NETWORKS.devnet,
});
