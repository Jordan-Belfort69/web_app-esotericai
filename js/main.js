// ===== РОУТЕР ЭКРАНОВ =====
// profile / buy / history / tasks / task1 / task2 / referral /
// tarot / rituals / tip / horoscope / more / help
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

    // Задание 1 / 2 → назад в список заданий
    if (cur === "task1" || cur === "task2") {
      this.stack.pop();          // убрать task*
      this.stack.push("tasks");  // гарантируем tasks сверху
      this.apply();
      return;
    }

    // Остальные внутренние → на корневой экран
    if (["buy","history","tasks","referral"].includes(cur)) {
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
    if (["profile","buy","history","tasks","task1","task2","referral"].includes(screen)) {
      AppNavigation.switchTab("profile", screen === "profile" ? "main" : "subscreen");
    } else if (screen === "tarot") {
      AppNavigation.switchTab("tarot");
    } else if (["rituals","tip","horoscope"].includes(screen)) {
      AppNavigation.switchTab("rituals");
    } else if (["more","help"].includes(screen)) {
      AppNavigation.switchTab("more");
    }

    // 1.1 Внутренние экраны профиля и покупки
    const profileInnerIds = [
      "profile-history",
      "profile-tasks",
      "profile-task1-card",
      "profile-task2-card",
      "task1-details",
      "task2-details",
      "profile-ref",
      "profile-help",
      "profile-help-contact",
    ];
    profileInnerIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });

    const subsSection = document.getElementById("subs-section");
    if (subsSection) subsSection.style.display = "none";

    if (screen === "buy") {
      if (subsSection) subsSection.style.display = "block";
    } else if (screen === "history") {
      const h = document.getElementById("profile-history");
      if (h) h.style.display = "block";
      document.querySelectorAll(".history-item-card").forEach(card => {
        card.style.display = "block";
      });
    } else if (screen === "tasks") {
      const t = document.getElementById("profile-tasks");
      const c1 = document.getElementById("profile-task1-card");
      const c2 = document.getElementById("profile-task2-card");
      if (t) t.style.display = "block";
      if (c1) c1.style.display = "block";
      if (c2) c2.style.display = "block";
    } else if (screen === "task1") {
      const d = document.getElementById("task1-details");
      if (d) d.style.display = "block";
    } else if (screen === "task2") {
      const d = document.getElementById("task2-details");
      if (d) d.style.display = "block";
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
});
