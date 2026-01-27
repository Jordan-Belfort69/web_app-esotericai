// ===== МОДУЛЬ: МОИ ПРОМОКОДЫ =====

window.PromoUI = (() => {
  // Пока делаем мок-список. Потом будешь подставлять реальные данные из бота.
  let userPromocodes = [
    {
      code: 'WELCOME5',
      desc: 'Скидка 5% на покупку сообщений',
      discount: 5,
      expires_at: null,
    },
    {
      code: 'TAROT10',
      desc: 'Скидка 10% на покупку сообщений',
      discount: 10,
      expires_at: 'до 31.03.2026',
    },
  ];

  function renderPromocodes() {
    const list = document.getElementById('promocodes-list');
    if (!list) return;

    list.innerHTML = '';

    if (!userPromocodes.length) {
      const empty = document.createElement('div');
      empty.className = 'history-answer-preview';
      empty.textContent = 'Сейчас у вас нет активных промокодов.';
      list.appendChild(empty);
      return;
    }

    userPromocodes.forEach((promo) => {
      const item = document.createElement('div');
      item.className = 'history-item';

      item.innerHTML = `
        <div class="history-question">
          🎁 ${promo.desc}
          ${
            promo.discount
              ? `<span class="promocode-badge">-${promo.discount}%</span>`
              : ''
          }
        </div>
        <div class="promocode-row">
          <span class="promocode-code">${promo.code}</span>
          <button class="help-read-btn promocode-copy-btn" data-code="${promo.code}">
            Копировать
          </button>
        </div>
        ${
          promo.expires_at
            ? `<div class="history-answer-preview promocode-expire">
                 Действует ${promo.expires_at}
               </div>`
            : ''
        }
      `;

      list.appendChild(item);
    });

    // навешиваем обработчики копирования
    const buttons = list.querySelectorAll('.promocode-copy-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const code = btn.getAttribute('data-code');
        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = 'Скопировано';
          setTimeout(() => {
            btn.textContent = 'Копировать';
          }, 1500);
        } catch (e) {
          console.error('Clipboard error', e);
        }
      });
    });
  }

  function initPromoScreen() {
    // клик по кнопке "Мои промокоды" в профиле
    const link = document.getElementById('profile-promocodes-link');
    if (link) {
      link.addEventListener('click', () => {
        AppRouter.go('promocodes');
      });
    }

    // рендер при открытии
    renderPromocodes();
  }

  // даём наружу инициализацию + возможность обновить список из main.js
  function setPromocodes(list) {
    userPromocodes = list || [];
    renderPromocodes();
  }

  return {
    initPromoScreen,
    setPromocodes,
  };
})();
