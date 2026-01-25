// ===== ВРЕМЕННЫЙ MONOLITH main.js (будем разрезать на модули) =====

// делаем роутер ГЛОБАЛЬНО, чтобы им пользоваться из других модулей
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

    // спец‑логика для вложенных экранов
    if (cur === "task_details") {
      this.stack.pop();          // вернуться к "tasks"
      this.apply();
      return;
    }

    // всё остальное: назад на главный экран секции
    if (this.stack.length > 1) this.stack = [this.stack[0]]; // profile / rituals / more
    this.apply();
  },

  apply() {
    const screen = this.current();

    // 1) переключаем основной таб
    if (["profile","buy_messages","history","tasks","referral"].includes(screen)) {
      AppNavigation.switchTab("profile");
    } else if (["ritual_tip","horoscope"].includes(screen)) {
      AppNavigation.switchTab("rituals");
    } else if (screen === "help") {
      AppNavigation.switchTab("more");
    }

    // 3) нижнее меню
    const needBottomNav = ["profile","rituals","more"].includes(screen);
    if (needBottomNav) {
      AppNavigation.showBottomNav();
    } else {
      AppNavigation.hideBottomNav();
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  AppCore.initTelegram();

  const tg = AppCore.tg;
  const backBtn = tg.BackButton;
  const mainBtn = tg.MainButton;

  // на стартовом экране: нет "Назад", есть "Закрыть"
  backBtn.hide();
  mainBtn.setText("Закрыть");
  mainBtn.show();
  mainBtn.onClick(() => tg.close());

  // обработчик BackButton оставляем для внутренних экранов
  backBtn.onClick(() => {
    AppRouter.back();
  });

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
