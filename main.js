// ===== ВРЕМЕННЫЙ MONOLITH main.js (теперь только точка входа) =====

document.addEventListener("DOMContentLoaded", () => {
  AppCore.initTelegram();

  AppProfile.loadProfile();
  AppNavigation.initTabs();
  AppTarot.initTarotControls();
  AppReferrals.initReferralSection();
  AppSubs.initSubsControls();
  AppSubs.initBuySubButton();
  AppProfile.initHistorySection();
  AppProfile.initTasksSection();
  AppHelpSupport.initFeedbackLink();
  AppHelpSupport.initNewsLink();
  AppHelpSupport.initHelpSection();
  AppHelpSupport.initSupportLink();
  AppRitualTip.initRitualTip();
  AppHoroscope.initHoroscope();
});