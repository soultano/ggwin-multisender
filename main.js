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
  console.log("Отправим 15000 GGWIN на:");
  addresses.forEach(addr => console.log(addr));
});

// Показываем подключённый адрес
tonConnect.onStatusChange(wallet => {
  if (wallet?.account?.address) {
    walletAddressDisplay.textContent = `Кошелёк: ${wallet.account.address}`;
  }
});
