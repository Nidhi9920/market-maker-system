const { Keypair, Connection, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const config = require('../../config/config.json');
const connection = new Connection(config.rpcUrl, "confirmed");

// Function to create multiple wallets and request SOL airdrops
async function createWallets(walletCount) {
    let wallets = [];
    for (let i = 0; i < walletCount; i++) {
        const wallet = Keypair.generate();
        wallets.push(wallet);

        // Airdrop SOL for transaction fees
        await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL * 1);
        console.log(`Wallet ${i + 1}: ${wallet.publicKey.toBase58()} created and funded`);
    }
    return wallets;
}

module.exports = { createWallets };
