import { TonConnectUI } from "@tonconnect/ui";

const tonConnect = new TonConnectUI({
  manifestUrl: "https://soultano.github.io/ggwin-multisender/tonconnect-manifest.json",
  buttonRootId: "connectWalletBtn"
});

const sendBtn = document.getElementById("sendBtn");
const walletField = document.getElementById("wallets");
const walletAddressDisplay = document.getElementById("walletAddress");

sendBtn.addEventListener("click", async () => {
  const connectedWallet = await tonConnect.wallet;
  if (!connectedWallet) {
    alert("Сначала подключи кошелёк");
    return;
  }

  const addresses = walletField.value.split("\n").map(a => a.trim()).filter(Boolean);
  if (addresses.length === 0) {
    alert("Вставь адреса получателей");
    return;
  }

  // ⚠️ ВНИМАНИЕ: Здесь будет логика отправки — сейчас только выводим адреса
  import { beginCell, toNano, Address } from '@ton/core';

async function sendJetton(toAddress) {
  const wallet = await tonConnect.wallet;
  if (!wallet) return;

  const transfer = beginCell()
    .storeUint(0xf8a7ea5, 32) // opcode Jetton transfer
    .storeUint(0, 64)         // query_id
    .storeAddress(Address.parse(toAddress))
    .storeAddress(Address.parse(wallet.account.address))
    .storeCoins(toNano('15000'))
    .storeAddress(null)
    .storeUint(0, 1) // no custom_payload
    .storeCoins(0)   // forward_amount
    .storeAddress(null) // forward_payload
    .endCell();

  await tonConnect.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
      {
        address: "<UQAT4kuGQHPhVBw0htnonfELVeeB7t0ov08fJ8fwx8FZ9arZ>", // 🔁 ЗАМЕНИ на твой GGWIN jetton wallet
        amount: toNano("0.05").toString(), // оплата за gas
        payload: transfer.toBoc().toString("base64")
      }
    ]
  });
}

  console.log("Отправим 15000 GGWIN на:");
  addresses.forEach(addr => console.log(addr));
});
for (const addr of addresses) {
  try {
    await sendJetton(addr);
    console.log(`✅ Отправлено на ${addr}`);
  } catch (e) {
    console.error(`❌ Ошибка на ${addr}:`, e);
  }
}

// Показываем подключённый адрес
tonConnect.onStatusChange(wallet => {
  if (wallet?.account?.address) {
    walletAddressDisplay.textContent = `Кошелёк: ${wallet.account.address}`;
  }
});
