import inquirer from "inquirer";
import { distribute } from "./lib/distribute.js";
import { sweep } from "./lib/sweep.js";
import { checkBalances } from "./lib/balance.js";
import terminalKit from "terminal-kit";
const term = terminalKit.terminal;

// Fungsi untuk menampilkan banner
function showBanner() {
  term.clear();
  term.moveTo(1, 1);
  term.green.bold("╔════════════════════════════════════╗\n");
  term.green.bold("║       🚀 Wallet-Manager v1.0       ║\n");
  term.green.bold("╚════════════════════════════════════╝\n\n");
  term.brightMagenta.bold("by xXin98\n");
}

async function main() {
  showBanner(); // tampilkan banner di awal

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "📦 Pilih Menu:",
        choices: [
          { name: "1. Distribute ETH", value: "distribute" },
          { name: "2. Sweep Wallets", value: "sweep" },
          { name: "3. Check Balances", value: "check" },
          { name: "4. Keluar", value: "exit" },
        ],
      },
    ]);

    if (action === "exit") {
      console.log("👋 Keluar...");
      break;
    }

    try {
      if (action === "distribute") {
        await distribute();
      } else if (action === "sweep") {
        await sweep();
      } else if (action === "check") {
        await checkBalances();
      }
    } catch (e) {
      console.error("❌ Terjadi kesalahan:", e.message);
    }
  }
}

main();
