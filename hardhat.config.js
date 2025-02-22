require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      accounts: {
        // Numero di account da generare (default: 20)
        count: 20,
        // Saldo iniziale di ciascun account (in wei)
        // Ad esempio: "1000000000000000000000000" equivale a 1.000.000 ETH
        accountsBalance: "1000000000000000000000000",
      },
    },
  },
};