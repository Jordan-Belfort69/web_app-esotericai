// ===== CORE: Telegram WebApp + утилиты =====

window.AppCore = (() => {
  const tg = window.Telegram ? window.Telegram.WebApp : null;

  // Инициализация мини‑приложения Telegram
  function initTelegram() {
    if (!tg) return;
    tg.ready();
    tg.expand();
  }

  // initData для бэкенда
  function getInitData() {
    return tg && tg.initData ? tg.initData : null;
  }

  // Форматирование дат из API
  function formatDate(iso) {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("ru-RU");
    } catch {
      return iso.slice(0, 10);
    }
  }

  // Подпись тарифа
  function tierLabel(tier) {
    if (tier === "pro") return "🌙 PRO";
    if (tier === "mystic") return "🔮 Mystic";
    return "🆓 Free";
  }

  // Текст статуса подписки
  function subStatus(tier) {
    if (tier === "pro") return "Активна 🌙 PRO";
    if (tier === "mystic") return "Активна 🔮 Mystic";
    return "Бесплатный доступ";
  }

  return {
    tg,
    initTelegram,
    getInitData,
    formatDate,
    tierLabel,
    subStatus,
  };
})();
