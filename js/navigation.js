// ===== МОДУЛЬ: НАВИГАЦИЯ / ВКЛАДКИ =====
// Отвечает за нижнее меню и переключение между:
// - Профиль (profile-*)
// - Таро (tarot-section)
// - Ритуалы (rituals-section)
// - Подписка (subs-section)

window.AppNavigation = (() => {
  // добавили второй параметр profileMode
  function switchTab(tab, profileMode = 'main') {
    const profileHeader = document.querySelector('.profile-header');
    const tarotSection = document.getElementById('tarot-section');
    const subsSection = document.getElementById('subs-section');
    const ritualsSection = document.getElementById('rituals-section');
    const horoscopeSettings = document.getElementById('ritual-horoscope-settings');
    const moreSection = document.getElementById('more-section');

    const profileBlocks = document.querySelectorAll(
      '#profile-summary, #profile-activity, #profile-ref-bonus, ' +
      '#profile-buy-sub, #profile-status-link, #profile-history-link, #profile-tasks-link, ' +
      '#profile-ref-link, #profile-promocodes-link, ' +
      '#profile-ref, #profile-history, #profile-tasks, ' +
      '#profile-help, #profile-help-contact'
    );

    // элементы истории
    const historyHeader = document.getElementById('profile-history');
    const historyCards = document.querySelectorAll('.history-item-card');

    const navButtons = document.querySelectorAll('.bottom-nav .nav-btn');

    navButtons.forEach(btn => {
      const t = btn.getAttribute('data-tab');
      if (!t) return;
      btn.classList.toggle('nav-btn-active', t === tab);
    });

    // при любой смене вкладки прячем историю и её карточки
    if (historyHeader) historyHeader.style.display = 'none';
    historyCards.forEach(card => (card.style.display = 'none'));

    if (tab === 'tarot') {
      if (profileHeader) profileHeader.style.display = 'none';
      profileBlocks.forEach(c => (c.style.display = 'none'));
      if (subsSection) subsSection.style.display = 'none';
      if (ritualsSection) ritualsSection.style.display = 'none';
      if (moreSection) moreSection.style.display = 'none';

      const tipSettings = document.getElementById('ritual-tip-settings');
      const timeScreen = document.getElementById('ritual-tip-time-screen');
      if (tipSettings) tipSettings.style.display = 'none';
      if (timeScreen) timeScreen.style.display = 'none';
      if (horoscopeSettings) horoscopeSettings.style.display = 'none';

      if (tarotSection) tarotSection.style.display = 'block';
    } else if (tab === 'rituals') {
      if (profileHeader) profileHeader.style.display = 'none';
      profileBlocks.forEach(c => (c.style.display = 'none'));
      if (tarotSection) tarotSection.style.display = 'none';
      if (subsSection) subsSection.style.display = 'none';
      if (moreSection) moreSection.style.display = 'none';
      if (ritualsSection) ritualsSection.style.display = 'block';

      const tipSettings = document.getElementById('ritual-tip-settings');
      const timeScreen = document.getElementById('ritual-tip-time-screen');
      if (tipSettings) tipSettings.style.display = 'none';
      if (timeScreen) timeScreen.style.display = 'none';
      if (horoscopeSettings) horoscopeSettings.style.display = 'none';
    } else if (tab === 'more') {
      if (profileHeader) profileHeader.style.display = 'none';
      profileBlocks.forEach(c => (c.style.display = 'none'));

      if (tarotSection) tarotSection.style.display = 'none';
      if (subsSection) subsSection.style.display = 'none';
      if (ritualsSection) ritualsSection.style.display = 'none';

      const tipSettings = document.getElementById('ritual-tip-settings');
      const timeScreen = document.getElementById('ritual-tip-time-screen');
      if (tipSettings) tipSettings.style.display = 'none';
      if (timeScreen) timeScreen.style.display = 'none';
      if (horoscopeSettings) horoscopeSettings.style.display = 'none';

      if (moreSection) moreSection.style.display = 'block';
    } else {
      // вкладка "Профиль"
      // шапкой профиля управляет AppRouter.apply()
      if (tarotSection) tarotSection.style.display = 'none';
      if (subsSection) subsSection.style.display = 'none';
      if (ritualsSection) ritualsSection.style.display = 'none';
      if (moreSection) moreSection.style.display = 'none';

      if (profileMode === 'main') {
        // главный экран профиля
        document.querySelectorAll(
          '#profile-summary, #profile-activity, #profile-ref-bonus, ' +
          '#profile-buy-sub, #profile-status-link, #profile-history-link, #profile-tasks-link, #profile-ref-link, #profile-promocodes-link'
        ).forEach(c => (c.style.display = 'block'));

        [
          'profile-ref', 'profile-history', 'profile-tasks',
          'profile-help', 'profile-help-contact',
          'ritual-horoscope-settings',
          'ritual-tip-settings',
          'ritual-tip-time-screen'
        ].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });
      } else if (profileMode === 'subscreen') {
        // при подэкранах профиля верхние блоки скрыты
        document.querySelectorAll(
          '#profile-summary, #profile-activity, #profile-ref-bonus, ' +
          '#profile-buy-sub, #profile-status-link, #profile-history-link, #profile-tasks-link, #profile-ref-link, #profile-promocodes-link'
        ).forEach(c => (c.style.display = 'none'));
      }
    }
  }

  function showBottomNav() {
    const nav = document.querySelector('.bottom-nav');
    if (nav) nav.style.display = 'flex';
  }

  function hideBottomNav() {
    const nav = document.querySelector('.bottom-nav');
    if (nav) nav.style.display = 'none';
  }

  function initTabs() {
    const navButtons = document.querySelectorAll('.bottom-nav .nav-btn');
    navButtons.forEach(btn => {
      const tab = btn.getAttribute('data-tab');
      if (!tab) return;

      btn.addEventListener('click', () => {
        if (tab === 'profile') {
          AppRouter.stack = ['profile'];
        } else if (tab === 'tarot') {
          AppRouter.stack = ['tarot'];
        } else if (tab === 'rituals') {
          AppRouter.stack = ['rituals'];
        } else if (tab === 'more') {
          AppRouter.stack = ['more'];
        }
        AppRouter.apply();
      });
    });
  }
  
  return {
    switchTab,
    initTabs,
    showBottomNav,
    hideBottomNav,
  };
})();
