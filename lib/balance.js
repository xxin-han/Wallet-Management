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

export async function checkBalances() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallets = await readWallets("data/wallets.csv");
  console.log(`\n🔍 Jumlah wallet ditemukan: ${wallets.length}\n`);

  let total = 0n;

  for (const { privateKey } of wallets) {
    const wallet = new ethers.Wallet(privateKey.trim());
    const address = wallet.address;
    try {
      const balance = await provider.getBalance(address);
      total += balance;
      console.log(`📥 ${address} = ${ethers.formatEther(balance)} ETH`);
    } catch (e) {
      console.log(`❌ Gagal cek saldo ${address}: ${e.message}`);
    }
  }

  console.log(`\n💰 Total saldo semua wallet: ${ethers.formatEther(total)} ETH\n`);
}
