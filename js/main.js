// Хелпер для получения initData из Telegram WebApp
const AppAuth = {
    getInitData() {
        const tg = AppCore.tg;
        if (!tg) return null;
        return tg.initData || null;
    },
};

// ===== РОУТЕР ЭКРАНОВ =====
// profile / buy / buy-confirm / history / tasks / task1 / task2 / referral /
// tarot / tarot-inner / rituals / tip / horoscope / more / help / status
const AppRouter = {
    stack: ["profile"],
    current() {
        return this.stack[this.stack.length - 1];
    },

    go(screen) {
        this.stack.push(screen);
        this.apply();
    },

    back() {
        const cur = this.current();

        // Внутренний экран Таро → назад в корневой Таро
        if (cur === "tarot-inner") {
            this.stack = ["tarot"];
            this.apply();
            return;
        }

        // из списка задач категории → назад в экран разделов заданий
        if (cur === "tasks-list") {
            this.stack = ["tasks"];
            this.apply();
            return;
        }

        // Остальные внутренние → на корневой экран
        if (["buy", "buy-confirm", "history", "tasks", "referral", "status", "promocodes"].includes(cur)) {
            this.stack = ["profile"];
        } else if (["tip", "horoscope"].includes(cur)) {
            this.stack = ["rituals"];
        } else if (cur === "help") {
            this.stack = ["more"];
        } else {
            this.stack = ["profile"];
        }

        this.apply();
    },

    apply() {
        const screen = this.current();

        // 0) шапка профиля: видна только на главном профиле
        const profileHeader = document.querySelector(".profile-header");
        if (profileHeader) {
            if (screen === "profile") {
                profileHeader.style.display = "flex";
            } else {
                profileHeader.style.display = "none";
            }
        }

        // 1) переключаем основной таб
        if (
            [
                "profile",
                "buy",
                "buy-confirm",
                "history",
                "tasks",
                "tasks-list",
                "referral",
                "status",
                "promocodes",
            ].includes(screen)
        ) {
            AppNavigation.switchTab("profile", screen === "profile" ? "main" : "subscreen");
        } else if (screen === "tarot" || screen === "tarot-inner") {
            // для внутренних экранов Таро всё равно держим вкладку "Таро" активной
            AppNavigation.switchTab("tarot", screen === "tarot" ? "main" : "subscreen");
        } else if (["rituals", "tip", "horoscope"].includes(screen)) {
            AppNavigation.switchTab("rituals");
        } else if (["more", "help"].includes(screen)) {
            AppNavigation.switchTab("more");
        }

        // 1.1 Внутренние экраны профиля и покупки
        const profileInnerIds = [
            "profile-history",
            "profile-tasks",
            "tasks-categories",
            "tasks-list",
            "profile-ref",
            "profile-help",
            "profile-help-contact",
            "promocodes-section",
        ];

        profileInnerIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });

        const subsSection = document.getElementById("subs-section");
        const subsConfirmSection = document.getElementById("subs-confirm-section");
        const statusSection = document.getElementById("status-section");

        if (subsSection) subsSection.style.display = "none";
        if (subsConfirmSection) subsConfirmSection.style.display = "none";
        if (statusSection) statusSection.style.display = "none";

        if (screen === "buy") {
            if (subsSection) subsSection.style.display = "block";
        } else if (screen === "buy-confirm") {
            if (subsConfirmSection) subsConfirmSection.style.display = "block";
        } else if (screen === "status") {
            if (statusSection) statusSection.style.display = "block";
        } else if (screen === "history") {
            const h = document.getElementById("profile-history");
            if (h) h.style.display = "block";
            // при каждом входе в экран истории подгружаем актуальный список
            if (window.AppProfile && typeof AppProfile.loadHistory === "function") {
                AppProfile.loadHistory();
            }
        } else if (screen === "tasks") {
            const t = document.getElementById("profile-tasks");
            const cats = document.getElementById("tasks-categories");
            const list = document.getElementById("tasks-list");
            if (t) t.style.display = "block";
            if (cats) cats.style.display = "block";
            if (list) list.style.display = "none"; // при входе показываем только список разделов
        } else if (screen === "tasks-list") {
            const t = document.getElementById("profile-tasks");
            const cats = document.getElementById("tasks-categories");
            const list = document.getElementById("tasks-list");
            if (t) t.style.display = "block";
            if (cats) cats.style.display = "none";
            if (list) list.style.display = "block";
        } else if (screen === "referral") {
            const r = document.getElementById("profile-ref");
            if (r) r.style.display = "block";
        } else if (screen === "promocodes") {
            const p = document.getElementById("promocodes-section");
            if (p) p.style.display = "block";
        } else if (screen === "help") {
            const h = document.getElementById("profile-help");
            const c = document.getElementById("profile-help-contact");
            if (h) h.style.display = "block";
            if (c) c.style.display = "block";

            // прячем список "Еще", чтобы не торчал под экраном помощи
            const moreSection = document.getElementById("more-section");
            if (moreSection) moreSection.style.display = "none";
        }

        // 1.2 Показ экранов Таро
        const tarotSection = document.getElementById("tarot-section");
        const tarotSettings = document.getElementById("tarot-settings");
        const tarotVoiceSettings = document.getElementById("tarot-voice-settings");
        const tarotOwnSettings = document.getElementById("tarot-own-settings");

        if (tarotSection) tarotSection.style.display = "none";
        if (tarotSettings) tarotSettings.style.display = "none";
        if (tarotVoiceSettings) tarotVoiceSettings.style.display = "none";
        if (tarotOwnSettings) tarotOwnSettings.style.display = "none";

        if (screen === "tarot") {
            if (tarotSection) tarotSection.style.display = "block";
        } else if (screen === "tarot-inner") {
            // здесь ничего не включаем — нужный экран покажет tarot.js
        }

        // 2) нижнее меню
        const needBottomNav = ["profile", "tarot", "rituals", "more"].includes(screen);
        if (needBottomNav) {
            AppNavigation.showBottomNav();
        } else {
            AppNavigation.hideBottomNav();
        }

        // 3) системные кнопки Telegram
        const tg = AppCore.tg;
        if (!tg) return;

        const backBtn = tg.BackButton;
        const mainBtn = tg.MainButton;

        if (screen === "profile") {
            // На главном профиле не показываем кнопки
            backBtn.hide();
            mainBtn.hide();
        } else {
            // На внутренних экранах только BackButton
            mainBtn.hide();
            backBtn.show();
        }
    },
};

// ==== ПРОФИЛЬ: ИСТОРИЯ ====

window.AppProfile = window.AppProfile || {};

AppProfile._historyLoaded = false;

AppProfile.loadHistory = async function () {
    const container = document.querySelector("#profile-history .history-list");
    if (!container) return;

    container.innerHTML = "Загрузка истории...";

    try {
        const initData = AppAuth.getInitData();
        const resp = await AppApi.fetchHistoryList(initData, 20, 0);
        const items = resp.items || [];

        if (!items.length) {
            container.innerHTML = '<p class="history-empty">История пока пустая</p>';
            return;
        }

        container.innerHTML = "";
        items.forEach(item => {
            const card = document.createElement("div");
            card.className = "history-item-card";
            card.dataset.recordId = item.id;

            card.innerHTML = `
                <div class="history-item-header">
                    <div class="history-item-title">${item.title || "Запрос"}</div>
                    <div class="history-item-date">${item.created_at || ""}</div>
                </div>
                <div class="history-item-preview">
                    ${item.preview || ""}
                </div>
            `;

            container.appendChild(card);
        });

        AppProfile.bindHistoryItemClicks();
    } catch (e) {
        console.error("Ошибка загрузки истории", e);
        container.innerHTML = '<p class="history-error">Не удалось загрузить историю</p>';
    }
};

AppProfile.bindHistoryItemClicks = function () {
    document.querySelectorAll(".history-item-card").forEach(card => {
        card.addEventListener("click", async () => {
            const recordId = card.dataset.recordId;
            if (!recordId) return;

            try {
                const initData = AppAuth.getInitData();
                const detail = await AppApi.fetchHistoryDetail(initData, recordId);

                // Временный простой вывод — потом заменим на нормальное модальное окно/экран
                alert(detail.full_text || JSON.stringify(detail, null, 2));
            } catch (e) {
                console.error("Ошибка загрузки детали истории", e);
            }
        });
    });
};

AppProfile.initHistorySection = function () {
    const historyLink = document.querySelector('[data-nav="history"]');
    if (historyLink) {
        historyLink.addEventListener("click", () => {
            AppRouter.go("history");
        });
    }
};

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ =====
document.addEventListener("DOMContentLoaded", () => {
    AppCore.initTelegram();
    const tg = AppCore.tg;
    if (tg) {
        const backBtn = tg.BackButton;
        const mainBtn = tg.MainButton;
        backBtn.onClick(() => AppRouter.back());
        mainBtn.onClick(() => tg.close());
    }
    // стартуем с профиля
    AppRouter.apply();
    AppTheme.initThemeToggle();
    AppProfile.loadProfile();
    AppNavigation.initTabs();
    AppTarot.initTarotControls();
    AppReferrals.initReferralSection();
    AppSubs.initSubsControls();
    AppSubs.initBuySubButton();
    AppProfile.initHistorySection();
    AppProfile.initTasksSection();
    AppProfile.initRefLinkSection();
    AppProfile.initRefBonusBlock();
    AppProfile.initStatusLink();
    AppProfile.initStatusClick(); // Добавлено для кликабельности статуса
    AppMore.initMore();
    AppRitualTip.initRitualTip();
    AppHoroscope.initHoroscope();
    StatusUI.initStatusScreen();
    AppTasks.initTasksUI();
    PromoUI.initPromoScreen();
});
