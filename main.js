const log = (msg) => {
  document.getElementById('log').textContent += msg + '\n';
};

async function send() {
  const raw = document.getElementById('addresses').value;
  const addresses = raw.split('\n').map(s => s.trim()).filter(Boolean);

  for (const address of addresses) {
    try {
      log(`Отправка 15k GGWIN на ${address}...`);
      // Тут пока заглушка — позже подключим API или смарт-контракт
      await new Promise(resolve => setTimeout(resolve, 500));
      log(`✅ Успешно`);
    } catch (e) {
      log(`❌ Ошибка: ${e.message}`);
    }
  }
}
