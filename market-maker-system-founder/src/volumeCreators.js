const { createWallets } = require('./utils/wallets');
const { createToken } = require('./utils/tokens');
const { simulateTransactions } = require('./utils/transactions');
const { Connection } = require('@solana/web3.js');
const config = require('../config/config.json');

const connection = new Connection(config.rpcUrl, 'confirmed');

async function main() {
    console.log("Starting volume creation...");

    // Step 1: Create wallets
    const wallets = await createWallets(5);  // Create 5 wallets
    console.log("Wallets created:", wallets.map(wallet => wallet.publicKey.toBase58()));

    // Step 2: Create a token
    const mint = await createToken(wallets[0], connection);
    console.log("Token created:", mint.publicKey.toBase58());

    // Step 3: Simulate transactions
    await simulateTransactions(wallets, mint, connection);
    console.log("Transactions simulated successfully.");
}

main().catch((err) => {
    console.error("Error during execution:", err);
});
