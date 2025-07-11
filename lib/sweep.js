import { config } from "dotenv";
import fs from "fs";
import csv from "csv-parser";
import { ethers } from "ethers";

config();

function readWallets(path) {
  return new Promise((resolve) => {
    const results = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results));
  });
}

export async function sweep() {
  const { RPC_URL, RECEIVER, TOKEN, GAS_PRICE_GWEI } = process.env;
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const gasPrice = ethers.parseUnits(GAS_PRICE_GWEI, "gwei");
  const isEth = TOKEN.toLowerCase() === "eth";

  const wallets = await readWallets("data/wallets.csv");
  console.log(`\n🔍 Jumlah wallet ditemukan: ${wallets.length}\n`);

  for (const { privateKey } of wallets) {
    const wallet = new ethers.Wallet(privateKey.trim(), provider);

    try {
      if (isEth) {
        const balance = await provider.getBalance(wallet.address);
        const amount = balance - gasPrice * 21000n;

        if (amount <= 0n) {
          console.log(`❌ Wallet ${wallet.address} tidak cukup ETH`);
          continue;
        }

        const tx = await wallet.sendTransaction({
          to: RECEIVER,
          value: amount,
          gasPrice,
          gasLimit: 21000,
        });

        console.log(`✅ ETH dari ${wallet.address} terkirim. TX: ${tx.hash}`);
      } else {
        const erc20 = new ethers.Contract(
          TOKEN,
          ["function balanceOf(address) view returns (uint256)", "function transfer(address to, uint256 amount) returns (bool)"],
          wallet
        );

        const balance = await erc20.balanceOf(wallet.address);
        if (balance <= 0n) {
          console.log(`❌ Wallet ${wallet.address} tidak punya token`);
          continue;
        }

        const tx = await erc20.transfer(RECEIVER, balance, { gasPrice });
        console.log(`✅ Token dari ${wallet.address} terkirim. TX: ${tx.hash}`);
      }
    } catch (e) {
      console.log(`⚠️  Error di wallet ${wallet.address}: ${e.message}`);
    }
  }

  console.log("\n🎉 Selesai sweeping semua wallet!");
}
