// ===== ИСПРАВЛЕННЫЙ КОД =====
window.AppCore = (() => {
const tg = window.Telegram?.WebApp;

function initTelegram() {
    if (!tg) {
        console.error("❌ Telegram WebApp не инициализирован!");
        return;
    }
    tg.ready();
    tg.expand();
    
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        console.log("✅ Telegram WebApp инициализирован");
        console.log("👤 Текущий пользователь: ", tg.initDataUnsafe.user);
        console.log("🆔 user_id: ", tg.initDataUnsafe.user.id);
    }
}

function getInitData() {
    if (tg && tg.initData) {
        console.log("📤 Отправляем initData для user_id: ", tg.initDataUnsafe.user.id);
        return tg.initData;
    }

    if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
        return "user=%7B%22id%22%3A+123456789%2C+%22first_name%22%3A+%22TestUser%22%2C+%22last_name%22%3A+%22%22%2C+%22username%22%3A+%22testuser%22%2C+%22language_code%22%3A+%22ru%22%2C+%22allows_write_to_pm%22%3A+true%7D&auth_date=1769704536&hash=26828877c6abfa2ddceedd7f27fecee9c2895c030276045a854fc5b0cc8451ce";
    }

    const urlParams = new URLSearchParams(window.location.search);
    const tgWebAppData = urlParams.get('tgWebAppData');
    if (tgWebAppData) {
        return tgWebAppData;
    }

    return urlParams.get('initData') || null;
}

function formatDate(iso) {
    if (!iso) return "—";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("ru-RU");  // ✅ Без пробела
    } catch {
        return iso.slice(0, 10);
    }
}

function tierLabel(tier) {
    if (tier === "pro") return "🌙 PRO";
    if (tier === "mystic") return "🔮 Mystic";
    return "🆓 Free";
}

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