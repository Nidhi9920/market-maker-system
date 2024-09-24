const { Keypair, Connection, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const config = require('../../config/config.json');
const connection = new Connection(config.rpcUrl, "confirmed");

// Function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to create multiple wallets and request SOL airdrops
async function createWallets(walletCount) {
    let wallets = [];
    const maxAttempts = 5; // Maximum attempts for airdrop

    for (let i = 0; i < walletCount; i++) {
        const wallet = Keypair.generate();
        wallets.push(wallet);

        let attempts = 0;
        let airdropSuccess = false;

        while (attempts < maxAttempts && !airdropSuccess) {
            try {
                // Airdrop SOL for transaction fees
                await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL * 1);
                console.log(`Wallet ${i + 1}: ${wallet.publicKey.toBase58()} created and funded`);
                airdropSuccess = true; // Mark airdrop as successful
            } catch (error) {
                if (error.message.includes('429')) {
                    attempts++;
                    const waitTime = Math.pow(2, attempts) * 1000; // Exponential backoff
                    console.log(`Rate limit hit while requesting airdrop. Retrying in ${waitTime / 1000} seconds...`);
                    await delay(waitTime);
                } else {
                    console.error('Error requesting airdrop:', error);
                    break; // Break on non-rate-limit errors
                }
            }
        }

        if (!airdropSuccess) {
            console.error(`Failed to fund wallet ${wallet.publicKey.toBase58()} after ${maxAttempts} attempts.`);
        }
    }
    return wallets;
}

module.exports = { createWallets };
