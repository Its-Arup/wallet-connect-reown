import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createAppKit } from '@reown/appkit/react'
import { arbitrum, mainnet, AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { WagmiProvider } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import "./styles.css"
import { createSIWE } from './utils/siweUtils.ts'

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.reown.com
// const projectId = import.meta.env.VITE_PROJECT_ID;
const projectId = "2a5d78860f76e35498f437ef3bdffd08";
if (!projectId) throw new Error("Project ID is undefined");

// 2. Create metadata
const metadata = {
  name: "AppKit SIWE",
  description: "AppKit SIWE Example",
  url: "https://reown.com",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Set the networks
export const chains: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, arbitrum];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  projectId,
  ssr: true
});

// 5. Create a SIWE configuration object
const siweConfig = createSIWE(chains);


// 6. Create modal
createAppKit({ 
    adapters: [wagmiAdapter], 
    networks: chains, 
    projectId, 
    siweConfig, 
    metadata,
    features: {
      email: true, // default to true
      socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook', 'farcaster'],
      emailShowWallets: true, // default to true
    } 
  });



  
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <div className="centered-div">
            <appkit-button />
          </div>
        </QueryClientProvider>
      </WagmiProvider>
  </StrictMode>,
)
