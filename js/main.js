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

    // НОВОЕ: из списка задач категории → назад в экран разделов заданий
    if (cur === "tasks-list") {
      this.stack = ["tasks"];
      this.apply();
      return;
    }

    // Остальные внутренние → на корневой экран
    if (["buy","buy-confirm","history","tasks","referral","status"].includes(cur)) {
      this.stack = ["profile"];
    } else if (["tip","horoscope"].includes(cur)) {
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
    const profileHeader = document.querySelector('.profile-header');
    if (profileHeader) {
      if (screen === "profile") {
        profileHeader.style.display = 'flex';
      } else {
        profileHeader.style.display = 'none';
      }
    }

    // 1) переключаем основной таб
    if (["profile","buy","buy-confirm","history","tasks","tasks-list","referral","status"].includes(screen)) {
      AppNavigation.switchTab("profile", screen === "profile" ? "main" : "subscreen");
    } else if (screen === "tarot" || screen === "tarot-inner") {
      // для внутренних экранов Таро всё равно держим вкладку "Таро" активной
      AppNavigation.switchTab("tarot", screen === "tarot" ? "main" : "subscreen");
    } else if (["rituals","tip","horoscope"].includes(screen)) {
      AppNavigation.switchTab("rituals");
    } else if (["more","help"].includes(screen)) {
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
      document.querySelectorAll(".history-item-card").forEach(card => {
        card.style.display = "block";
      });
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
    const needBottomNav = ["profile","tarot","rituals","more"].includes(screen);
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
      // На главном профиле не показываем MainButton
      backBtn.hide();
      mainBtn.hide();
    } else {
      // На внутренних экранах только BackButton
      mainBtn.hide();
      backBtn.show();
    }
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
  AppMore.initMore();
  AppRitualTip.initRitualTip();
  AppHoroscope.initHoroscope();
  StatusUI.initStatusScreen();
  AppTasks.initTasksUI();
});
