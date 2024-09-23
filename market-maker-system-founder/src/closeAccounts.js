const { closeTokenAccount } = require('./utils/token');

async function closeAccounts(tokenAccounts, mint, ownerWallet) {
    for (let account of tokenAccounts) {
        await closeTokenAccount(mint, account, ownerWallet);
    }
}

module.exports = { closeAccounts };
