// ===== МОДУЛЬ: ПОДПИСКИ =====

window.AppSubs = (() => {
  function initSubsControls() {
    const proBtn = document.getElementById('subs-btn-pro');
    const mysticBtn = document.getElementById('subs-btn-mystic');

    if (proBtn) {
      proBtn.addEventListener('click', () => {
        console.log('PRO clicked');
        // TODO: сюда потом добавишь вызов оплаты/бекенда
      });
    }

    if (mysticBtn) {
      mysticBtn.addEventListener('click', () => {
        console.log('Mystic clicked');
      });
    }
  }

  function initBuySubButton() {
    const buySubCard = document.getElementById('profile-buy-sub');
    if (!buySubCard) return;

    buySubCard.addEventListener('click', () => {
      const profileHeader = document.querySelector('.profile-header');
      if (profileHeader) profileHeader.style.display = 'none';

      [
        'profile-subscription', 'profile-limits', 'profile-buy-sub',
        'profile-history-link', 'profile-tasks-link', 'profile-ref-link',
        'profile-ref', 'profile-history', 'profile-tasks',
        'profile-task1-card', 'profile-task2-card',
        'task1-details', 'task2-details',
        'profile-help', 'profile-help-contact'
      ].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });

      const tarotSection = document.getElementById('tarot-section');
      const ritualsSection = document.getElementById('rituals-section');
      const moreSection = document.getElementById('more-section');
      if (tarotSection) tarotSection.style.display = 'none';
      if (ritualsSection) ritualsSection.style.display = 'none';
      if (moreSection) moreSection.style.display = 'none';

      const subsSection = document.getElementById('subs-section');
      if (subsSection) subsSection.style.display = 'block';
    });
  }

  return {
    initSubsControls,
    initBuySubButton,
  };
})();
