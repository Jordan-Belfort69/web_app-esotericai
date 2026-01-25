// ===== ВРЕМЕННЫЙ MONOLITH main.js (будем разрезать на модули) =====

const tg = AppCore.tg; // берем tg из ядра

document.addEventListener("DOMContentLoaded", () => {
  AppCore.initTelegram();

  AppProfile.loadProfile();
  AppNavigation.initTabs();
  AppTarot.initTarotControls();
  AppReferrals.initReferralSection(); // вместо initReferralSection()
  AppSubs.initSubsControls();         // вместо initSubsControls()
  AppSubs.initBuySubButton();         // вместо initBuySubButton()
  AppProfile.initHistorySection();
  AppProfile.initTasksSection();
  AppProfile.initRefLinkSection();   // ← добавить
  AppProfile.initRefBonusBlock();    // ← добавить
  AppMore.initMore();              // ← новый модуль вкладки "Еще"
  AppRitualTip.initRitualTip();
  AppHoroscope.initHoroscope();
});
