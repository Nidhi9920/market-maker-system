const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const config = require('../../config/config.json');

// Function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create a new SPL token with retry logic for rate limiting
async function createToken(ownerWallet, connection) {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
        try {
            const mint = await Token.createMint(
                connection,
                ownerWallet,
                ownerWallet.publicKey,
                null,
                9,  // Token decimals
                TOKEN_PROGRAM_ID
            );
            console.log(`Token created with mint: ${mint.publicKey.toBase58()}`);
            return mint;
        } catch (error) {
            if (error.message.includes('429')) {
                attempts++;
                const waitTime = Math.pow(2, attempts) * 1000; // Exponential backoff
                console.log(`Rate limit hit. Retrying in ${waitTime / 1000} seconds...`);
                await delay(waitTime);
            } else {
                console.error('Error creating token:', error);
                throw error; // Rethrow if not rate limit error
            }
        }
    }

    throw new Error('Max attempts reached. Unable to create token.');
}

// Close SPL token account with error handling
async function closeTokenAccount(mint, tokenAccount, ownerWallet) {
    try {
        await mint.closeAccount(tokenAccount.address, ownerWallet.publicKey, ownerWallet.publicKey, []);
        console.log(`Token account ${tokenAccount.address.toBase58()} closed`);
    } catch (error) {
        console.error('Error closing token account:', error);
    }
}

module.exports = { createToken, closeTokenAccount };
