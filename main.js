import { TonConnectUI } from "@tonconnect/ui";
import { beginCell, toNano, Address } from "@ton/core";

// Инициализация TonConnect
const tonConnect = new TonConnectUI({
  manifestUrl: "https://soultano.github.io/ggwin-multisender/tonconnect-manifest.json",
  buttonRootId: "connectWalletBtn"
});

// Отображение подключённого адреса
const walletAddressDisplay = document.getElementById("walletAddress");
tonConnect.onStatusChange(wallet => {
  if (wallet?.account?.address) {
    walletAddressDisplay.textContent = `Кошелёк: ${wallet.account.address}`;
  }
});

// Функция отправки jetton
async function sendJetton(toAddress, wallet) {
  const transfer = beginCell()
    .storeUint(0xf8a7ea5, 32)
    .storeUint(0, 64)
    .storeAddress(Address.parse(toAddress))
    .storeAddress(Address.parse(wallet.account.address))
    .storeCoins(toNano("15000"))
    .storeAddress(null)
    .storeUint(0, 1)
    .storeCoins(0)
    .storeAddress(null)
    .endCell();

  await tonConnect.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
      {
        address: "UQAT4kuGQHPhVBw0htnonfELVeeB7t0ov08fJ8fwx8FZ9arZ", // ЗАМЕНИ на твой GGWIN jetton wallet
        amount: toNano("0.05").toString(),
        payload: transfer.toBoc().toString("base64")
      }
    ]
  });
}

// Обработка кнопки "Разослать"
const sendBtn = document.getElementById("sendBtn");
const walletField = document.getElementById("wallets");

sendBtn.addEventListener("click", async () => {
  const addresses = walletField.value.split("\n").map(a => a.trim()).filter(Boolean);
  if (addresses.length === 0) {
    alert("Вставь адреса получателей");
    return;
  }

  const wallet = await tonConnect.wallet;
  if (!wallet) {
    alert("Сначала подключи кошелёк");
    return;
  }

  for (const addr of addresses) {
    try {
      await sendJetton(addr, wallet);
      console.log(`✅ Отправлено на ${addr}`);
    } catch (e) {
      console.error(`❌ Ошибка на ${addr}:`, e);
    }
  }
});
