const { Token } = require('@solana/spl-token');
const config = require('../../config/config.json');

// Function to simulate buy/sell transactions
async function simulateTransactions(wallets, mint, connection) {
    const amount = 100;  // Amount of tokens for each transaction
    for (let i = 0; i < wallets.length - 1; i++) {
        const fromWallet = wallets[i];
        const toWallet = wallets[i + 1];

        // Create token accounts
        const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(fromWallet.publicKey);
        const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(toWallet.publicKey);

        // Transfer tokens (simulate buy/sell)
        await mint.transfer(fromTokenAccount.address, toTokenAccount.address, fromWallet.publicKey, [], amount / 2);
        console.log(`Transferred ${amount / 2} tokens from ${fromWallet.publicKey.toBase58()} to ${toWallet.publicKey.toBase58()}`);
    }
}

module.exports = { simulateTransactions };
