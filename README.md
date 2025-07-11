# 💼 Wallet-Management

Sistem manajemen dompet digital berbasis Node.js yang mendukung distribusi massal dan konsolidasi dana menggunakan wallet hangat (warm wallets). Proyek ini cocok untuk automasi transaksi ETH atau token ERC-20 menggunakan private key dan koneksi RPC langsung.

---

## 📁 Struktur Project

```
Wallet-Management/
├── data/
│   ├── recipients.csv       # Daftar alamat penerima
│   └── wallets.csv          # Daftar private key wallet hangat
├── lib/
│   ├── balance.js           # Mengecek saldo wallet (ETH/token)
│   ├── distribute.js        # Mengirim dana ke banyak alamat
│   └── sweep.js             # Menarik semua saldo ke wallet utama
├── cli.js                   # Entry point CLI
├── package.json             # Metadata dan dependensi
├── package-lock.json        # Lockfile npm
└── .env                     # Konfigurasi environment (dibuat manual)
```

---

## 🧩 Modul `lib/`

### 1. `balance.js`
Digunakan untuk membaca saldo ETH atau token dari wallet.

### 2. `distribute.js`
Mengelola proses distribusi dana dari wallet utama ke daftar penerima dalam `recipients.csv`.

### 3. `sweep.js`
Memindahkan seluruh saldo dari semua wallet farm ke wallet utama yang didefinisikan di `.env`.

---

## Clone Repository

```bash
git clone https://github.com/xxin-han/Wallet-Management.git
cd Wallet-Management
```

## ⚙️ Konfigurasi `.env`

Buat file `.env` di direktori root dengan format berikut:

```bash
nano .env
```

```env
RPC_URL=https://<infura-or-alchemy-url>
SOURCE_PRIVATE_KEY=<private-key-wallet-utama>
RECEIVER=<alamat-wallet-utama>
TOKEN=eth                            # atau alamat contract ERC20
GAS_PRICE_GWEI=30
```

Contoh:

```env
RPC_URL=https://mainnet.infura.io/v3/your_project_id
SOURCE_PRIVATE_KEY=0xabc123...
RECEIVER=0xdef456...
TOKEN=eth
GAS_PRICE_GWEI=30
```

> 🛡️ Jangan bagikan file `.env` ke siapapun.

---

## 📂 Format Data

Masuk ke directory data lalu lakukan konfigurasi seperti berikut:

### 🔸 `wallets.csv`
Berisi daftar **private key** dari wallet farm yang digunakan untuk mengirim dana ke wallet utama.

```csv
privateKey
0x71e90...
0x21c4f...
```

### 🔸 `recipients.csv`

Berisi daftar alamat tujuan (penerima) dari dana.

```csv
ADDRESS
0x3Fa8B20...
0x129c826...
```

---


## 🚀 Run Wallet

Install terlebih dahulu:

```bash
npm install
```

Lalu jalankan CLI:

```bash
node cli.js
```

> CLI akan memandu kamu dalam menjalankan fungsi: cek saldo, distribusi dana, atau sweep ke wallet utama.

---

## 📚 Dependensi

- `ethers.js` (untuk koneksi ke jaringan dan transaksi)
- `dotenv` (untuk membaca file `.env`)
- `csv-parser` atau `fs` (untuk membaca file CSV)

---

## 🤝 Kontribusi

Pull request, issue, dan saran sangat disambut. Pastikan tidak menyertakan data sensitif saat berkontribusi.
