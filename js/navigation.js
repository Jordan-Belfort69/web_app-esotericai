// ===== МОДУЛЬ: НАВИГАЦИЯ / ВКЛАДКИ =====
// Отвечает за нижнее меню и переключение между:
// - Профиль (profile-*)
// - Таро (tarot-section)
// - Ритуалы (rituals-section)
// - Подписка (subs-section)

window.AppNavigation = (() => {
  function switchTab(tab) {
    const profileHeader = document.querySelector('.profile-header');
    const tarotSection = document.getElementById('tarot-section');
    const subsSection = document.getElementById('subs-section');
    const ritualsSection = document.getElementById('rituals-section');
    const horoscopeSettings = document.getElementById('ritual-horoscope-settings');

    const profileBlocks = document.querySelectorAll(
      '#profile-subscription, #profile-limits, #profile-buy-sub, ' +
      '#profile-history-link, #profile-tasks-link, #profile-ref-link, ' +
      '#profile-feedback-link, #profile-news-link, #profile-help-link, ' +
      '#profile-support-link, ' +
      '#profile-ref, #profile-history, #profile-tasks, #profile-task1-card, ' +
      '#profile-task2-card, #task1-details, #task2-details, ' +
      '#profile-help, #profile-help-contact'
    );

    const navButtons = document.querySelectorAll('.bottom-nav .nav-btn');

    navButtons.forEach(btn => {
      const t = btn.getAttribute('data-tab');
      if (!t) return;
      btn.classList.toggle('nav-btn-active', t === tab);
    });

    if (tab === 'tarot') {
      if (profileHeader) profileHeader.style.display = 'none';
      profileBlocks.forEach(c => (c.style.display = 'none'));
      if (subsSection) subsSection.style.display = 'none';
      if (ritualsSection) ritualsSection.style.display = 'none';
      if (tarotSection) tarotSection.style.display = 'block';
    } else if (tab === 'subs') {
      if (profileHeader) profileHeader.style.display = 'none';
      profileBlocks.forEach(c => (c.style.display = 'none'));
      if (tarotSection) tarotSection.style.display = 'none';
      if (ritualsSection) ritualsSection.style.display = 'none';
      if (subsSection) subsSection.style.display = 'block';
    } else if (tab === 'rituals') {
      if (profileHeader) profileHeader.style.display = 'none';
      profileBlocks.forEach(c => (c.style.display = 'none'));
      if (tarotSection) tarotSection.style.display = 'none';
      if (subsSection) subsSection.style.display = 'none';
      if (ritualsSection) ritualsSection.style.display = 'block';

      const tipSettings = document.getElementById('ritual-tip-settings');
      const timeScreen = document.getElementById('ritual-tip-time-screen');
      if (tipSettings) tipSettings.style.display = 'none';
      if (timeScreen) timeScreen.style.display = 'none';
      if (horoscopeSettings) horoscopeSettings.style.display = 'none';
    } else {
      // вкладка "Профиль"
      if (profileHeader) profileHeader.style.display = 'flex';
      if (tarotSection) tarotSection.style.display = 'none';
      if (subsSection) subsSection.style.display = 'none';
      if (ritualsSection) ritualsSection.style.display = 'none';

      document.querySelectorAll(
        '#profile-subscription, #profile-limits, #profile-buy-sub, ' +
        '#profile-history-link, #profile-tasks-link, #profile-ref-link, ' +
        '#profile-feedback-link, #profile-news-link, #profile-help-link, ' +
        '#profile-support-link'
      ).forEach(c => (c.style.display = 'block'));

      [
        'profile-ref', 'profile-history', 'profile-tasks',
        'profile-task1-card', 'profile-task2-card',
        'task1-details', 'task2-details',
        'profile-help', 'profile-help-contact',
        'ritual-horoscope-settings',
        'ritual-tip-settings',       // ← добавить
        'ritual-tip-time-screen'     // ← добавить
      ].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
    }
  }

  function initTabs() {
    const navButtons = document.querySelectorAll('.bottom-nav .nav-btn');
    navButtons.forEach(btn => {
      const tab = btn.getAttribute('data-tab');
      if (!tab) return;
      btn.addEventListener('click', () => switchTab(tab));
    });
  }

  return {
    switchTab,
    initTabs,
  };
})();
