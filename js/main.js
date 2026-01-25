// ===== ВРЕМЕННЫЙ MONOLITH main.js (будем разрезать на модули) =====


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
      // Профиль: только MainButton "Закрыть"
      backBtn.hide();
      mainBtn.setText("Закрыть");
      mainBtn.show();
    } else {
      // Внутренние экраны: только BackButton
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

    // Единственный обработчик "Назад" — дергает роутер
    backBtn.onClick(() => AppRouter.back());

    // Единственный обработчик "Закрыть"
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
