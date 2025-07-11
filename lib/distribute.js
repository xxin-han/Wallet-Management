import { config } from "dotenv";
config();
import { ethers } from "ethers";
import fs from "fs";
import csv from "csv-parser";
import prompt from "prompt-sync";
const ask = prompt({ sigint: true });

export async function distribute() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const sourceWallet = new ethers.Wallet(process.env.SOURCE_PRIVATE_KEY, provider);

  const recipients = await new Promise((resolve, reject) => {
    const addresses = [];
    fs.createReadStream("data/recipients.csv")
      .pipe(csv())
      .on("data", (row) => {
        if (row.ADDRESS && ethers.isAddress(row.ADDRESS.trim())) {
          addresses.push(row.ADDRESS.trim());
        }
      })
      .on("end", () => resolve(addresses))
      .on("error", reject);
  });

  console.log(`📬 Jumlah penerima ditemukan: ${recipients.length}`);
  const amountEth = ask("💰 Masukkan jumlah ETH per penerima: ");
  let amount;
  try {
    amount = ethers.parseEther(amountEth.trim());
  } catch {
    console.error("❌ Jumlah tidak valid."); return;
  }

  const balance = await provider.getBalance(sourceWallet.address);
  const feeData = await provider.getFeeData();
  const gasLimit = 21000n;
  const gasPerTx = feeData.maxFeePerGas * gasLimit;
  const totalAmount = amount * BigInt(recipients.length);
  const totalCost = gasPerTx * BigInt(recipients.length) + totalAmount;

  if (balance < totalCost) {
    console.log("❌ Saldo tidak cukup."); return;
  }

  for (const to of recipients) {
    try {
      const tx = await sourceWallet.sendTransaction({
        to,
        value: amount,
        gasLimit,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
      });
      await tx.wait();
      console.log(`✅ Sent to ${to} | Tx: ${tx.hash}`);
    } catch (e) {
      console.log(`❌ Gagal ke ${to}: ${e.message}`);
    }
  }
}
