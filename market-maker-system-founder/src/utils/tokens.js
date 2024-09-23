const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const config = require('../../config/config.json');

// Create a new SPL token
async function createToken(ownerWallet, connection) {
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
}

// Close SPL token account
async function closeTokenAccount(mint, tokenAccount, ownerWallet) {
    await mint.closeAccount(tokenAccount.address, ownerWallet.publicKey, ownerWallet.publicKey, []);
    console.log(`Token account ${tokenAccount.address.toBase58()} closed`);
}

module.exports = { createToken, closeTokenAccount };
