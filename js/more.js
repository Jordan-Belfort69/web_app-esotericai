// ===== МОДУЛЬ: ВКЛАДКА "ЕЩЕ" =====

window.AppMore = (() => {
  function initMore() {
    // Отзывы
    AppHelpSupport.initFeedbackLink();
    // Новости проекта
    AppHelpSupport.initNewsLink();
    // Помощь (открывает экран profile-help)
    AppHelpSupport.initHelpSection();
    // Поддержка
    AppHelpSupport.initSupportLink();
  }

  return {
    initMore,
  };
})();
