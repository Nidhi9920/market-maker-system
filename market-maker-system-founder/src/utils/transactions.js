const { Token } = require('@solana/spl-token');
const config = require('../../config/config.json');

// Function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to simulate buy/sell transactions with retry logic
async function simulateTransactions(wallets, mint, connection) {
    const amount = 100;  // Amount of tokens for each transaction
    const maxAttempts = 5; // Maximum attempts for each transfer

    for (let i = 0; i < wallets.length - 1; i++) {
        const fromWallet = wallets[i];
        const toWallet = wallets[i + 1];

        // Create token accounts
        const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(fromWallet.publicKey);
        const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(toWallet.publicKey);

        let attempts = 0;
        let transferSuccess = false;

        while (attempts < maxAttempts && !transferSuccess) {
            try {
                // Transfer tokens (simulate buy/sell)
                await mint.transfer(fromTokenAccount.address, toTokenAccount.address, fromWallet.publicKey, [], amount / 2);
                console.log(`Transferred ${amount / 2} tokens from ${fromWallet.publicKey.toBase58()} to ${toWallet.publicKey.toBase58()}`);
                transferSuccess = true; // Mark transfer as successful
            } catch (error) {
                if (error.message.includes('429')) {
                    attempts++;
                    const waitTime = Math.pow(2, attempts) * 1000; // Exponential backoff
                    console.log(`Rate limit hit during transfer. Retrying in ${waitTime / 1000} seconds...`);
                    await delay(waitTime);
                } else {
                    console.error('Error transferring tokens:', error);
                    break; // Break on non-rate-limit errors
                }
            }
        }

        if (!transferSuccess) {
            console.error(`Failed to transfer tokens from ${fromWallet.publicKey.toBase58()} to ${toWallet.publicKey.toBase58()} after ${maxAttempts} attempts.`);
        }
    }
}

module.exports = { simulateTransactions };
