// Import required modules and utilities
const { createWallets } = require('./utils/wallets');
const { createToken } = require('./utils/tokens');
const { simulateTransactions } = require('./utils/transactions');
const { Connection } = require('@solana/web3.js');
const config = require('../config/config.json');

// Create a connection to the Solana network using the RPC URL from config
const connection = new Connection(config.rpcUrl, 'confirmed');

// Function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    try {
        console.log("Starting volume creation...");

        // Step 1: Create multiple wallets with retry logic
        const walletCount = 5;  // Number of wallets to create (you can adjust this)
        const wallets = await createWallets(walletCount);
        console.log(`Wallets created: ${wallets.map(wallet => wallet.publicKey.toBase58())}`);

        // Step 2: Create a token using the first wallet as the mint authority with retry logic
        const maxAttempts = 5; // Maximum attempts for token creation
        let mint;
        let attempts = 0;

        while (attempts < maxAttempts) {
            try {
                mint = await createToken(wallets[0], connection);
                console.log(`Token created with mint address: ${mint.publicKey.toBase58()}`);
                break; // Exit loop if token creation is successful
            } catch (error) {
                if (error.message.includes('429')) {
                    attempts++;
                    const waitTime = Math.pow(2, attempts) * 1000; // Exponential backoff
                    console.log(`Rate limit hit during token creation. Retrying in ${waitTime / 1000} seconds...`);
                    await delay(waitTime);
                } else {
                    console.error('Error creating token:', error);
                    return; // Exit if it's a different error
                }
            }
        }

        if (!mint) {
            console.error('Failed to create token after multiple attempts.');
            return;
        }

        // Step 3: Simulate buy/sell transactions between wallets to create volume
        await simulateTransactions(wallets, mint, connection);
        console.log("Transactions simulated successfully.");

    } catch (err) {
        // Log any errors during execution
        console.error("Error during execution:", err);
    }
}

// Run the main function
main();
