import React, { useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import { WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

const App = () => {
  const wallet = useWallet();

  // Network connection
  const connection = new Connection("https://staging-rpc.dev2.eclipsenetwork.xyz");
  
  const programId = new PublicKey("replace_with_your_program_id"); // Your program ID
  const provider = new AnchorProvider(connection, wallet, { preflightCommitment: "processed" });

  const startGame = async () => {
    try {
      const program = await Program.at(programId, provider);
      await program.methods.startGame().rpc();
      alert("Game started!");
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  return (
    <div>
      <WalletProvider wallets={[new PhantomWalletAdapter()]} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          {wallet.connected && (
            <button onClick={startGame}>Start Pacman Game</button>
          )}
        </WalletModalProvider>
      </WalletProvider>
    </div>
  );
};

export default App;
