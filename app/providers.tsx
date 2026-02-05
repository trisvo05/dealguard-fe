"use client";

import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import "@mysten/dapp-kit/dist/index.css";

// Config options for the networks
const { networkConfig } = createNetworkConfig({
  localnet: { url: "http://127.0.0.1:9000", network: 'localnet' },
  devnet: { url: "https://fullnode.devnet.sui.io:443", network: 'devnet' },
  testnet: { url: "https://fullnode.testnet.sui.io:443", network: 'testnet' },
  mainnet: { url: "https://fullnode.mainnet.sui.io:443", network: 'mainnet' },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
           {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
