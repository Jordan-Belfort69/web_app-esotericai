// ===== МОДУЛЬ: ПОМОЩЬ, ОТЗЫВЫ, НОВОСТИ, ПОДДЕРЖКА =====

window.AppHelpSupport = (() => {
  const tg = AppCore.tg;

  function initFeedbackLink() {
    const feedbackCard = document.getElementById('more-feedback-link');
    if (!feedbackCard) return;

    feedbackCard.addEventListener('click', () => {
      const url = 'https://t.me/reviews_esotericai';
      console.log('Feedback clicked, open:', url);

      if (tg && typeof tg.openTelegramLink === 'function') {
        tg.openTelegramLink(url);
      } else {
        window.open(url, '_blank');
      }
    });
  }

  function initNewsLink() {
    const newsCard = document.getElementById('more-news-link');
    if (!newsCard) return;

    newsCard.addEventListener('click', () => {
      const url = 'https://t.me/news_esotericai';
      console.log('News clicked, open:', url);

      if (tg && typeof tg.openTelegramLink === 'function') {
        tg.openTelegramLink(url);
      } else {
        window.open(url, '_blank');
      }
    });
  }

  function initHelpSection() {
    const helpLinkCard = document.getElementById('more-help-link');
    const helpScreen = document.getElementById('profile-help');
    const helpContactCard = document.getElementById('profile-help-contact');

    if (!helpLinkCard || !helpScreen) return;

    helpLinkCard.addEventListener('click', () => {
      // переход в экран "Помощь"
      AppRouter.go('help');
    });

    const articleButtons = helpScreen.querySelectorAll('.help-link-btn');
    articleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        if (!url) return;

        if (tg && typeof tg.openLink === 'function') {
          tg.openLink(url);
        } else {
          window.open(url, '_blank');
        }
      });
    });

    const contactBtn = document.getElementById('help-contact-btn');
    if (contactBtn) {
      contactBtn.addEventListener('click', () => {
        const url = 'https://t.me/j_belfort69';

        if (tg && typeof tg.openTelegramLink === 'function') {
          tg.openTelegramLink(url);
        } else {
          window.open(url, '_blank');
        }
      });
    }
  }

  function initSupportLink() {
    const supportCard = document.getElementById('more-support-link');
    if (!supportCard) return;

    supportCard.addEventListener('click', () => {
      const url = 'https://t.me/j_belfort69';
      console.log('Support clicked, open:', url);

      if (tg && typeof tg.openTelegramLink === 'function') {
        tg.openTelegramLink(url);
      } else {
        window.open(url, '_blank');
      }
    });
  }

  return {
    initFeedbackLink,
    initNewsLink,
    initHelpSection,
    initSupportLink,
  };
})();
