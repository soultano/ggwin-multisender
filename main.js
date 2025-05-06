const tonConnect = new TonConnectUI.TonConnectUI({
  manifestUrl: "https://soultano.github.io/ggwin-multisender/tonconnect-manifest.json",
  buttonRootId: "connectWalletBtn"
});

const sendBtn = document.getElementById("sendBtn");
const walletField = document.getElementById("wallets");
const walletAddressDisplay = document.getElementById("walletAddress");

// Показываем подключённый адрес
tonConnect.onStatusChange(wallet => {
  if (wallet?.account?.address) {
    walletAddressDisplay.textContent = `Кошелёк: ${wallet.account.address}`;
  }
});

sendBtn.addEventListener("click", async () => {
  const wallet = tonConnect.wallet;
  if (!wallet) {
    alert("Сначала подключи кошелёк");
    return;
  }

  const addresses = walletField.value
    .split("\n")
    .map(a => a.trim())
    .filter(Boolean);

  if (addresses.length === 0) {
    alert("Вставь адреса получателей");
    return;
  }

  const fromAddress = wallet.account.address;
  const jettonWallet = "UQAT4kuGQHPhVBw0htnonfELVeeB7t0ov08fJ8fwx8FZ9arZ"; // твой GGWIN Jetton Wallet

  for (const toAddress of addresses) {
    try {
      const cell = window.ton.beginCell()
        .storeUint(0xf8a7ea5, 32)
        .storeUint(0, 64)
        .storeAddress(window.ton.Address.parse(toAddress))
        .storeAddress(window.ton.Address.parse(fromAddress))
        .storeCoins(window.ton.toNano("15000"))
        .storeAddress(null)
        .storeUint(0, 1)
        .storeCoins(0)
        .storeAddress(null)
        .endCell();

      await tonConnect.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: jettonWallet,
            amount: window.ton.toNano("0.05").toString(),
            payload: cell.toBoc().toString("base64")
          }
        ]
      });

      console.log(`✅ Успешно отправлено на ${toAddress}`);
    } catch (e) {
      console.error(`❌ Ошибка на ${toAddress}:`, e);
    }
  }
});
