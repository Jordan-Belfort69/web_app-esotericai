// ===== МОДУЛЬ: МОИ ПРОМОКОДЫ =====

window.PromoUI = (() => {
  let userPromocodes = [];

  async function loadPromocodes() {
    const list = document.getElementById('promocodes-list');
    if (!list) return;

    list.innerHTML = 'Загрузка промокодов...';

    try {
      const initData = window.Telegram?.WebApp?.initData || null;
      const data = await AppApi.fetchPromocodesList(initData);
      // ожидаемый ответ бэка: { promocodes: [ { code, discount, expires_at }, ... ] }
      userPromocodes = Array.isArray(data.promocodes) ? data.promocodes : [];
      renderPromocodes();
    } catch (e) {
      console.error('Не удалось загрузить промокоды', e);
      list.innerHTML = '<div class="history-answer-preview">Ошибка загрузки промокодов</div>';
    }
  }

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

      const expiresText = promo.expires_at
        ? `<div class="promocode-expire">
             <span class="promocode-expire-full">Действует до ${promo.expires_at}</span>
           </div>`
        : '';

      item.innerHTML = `
        <div class="history-question">
          🎁 Скидка ${promo.discount}% на покупку сообщений
        </div>
        <div class="promocode-row">
          <span class="promocode-code">${promo.code}</span>
          <button class="help-read-btn promocode-copy-btn" data-code="${promo.code}">
            Копировать
          </button>
        </div>
        ${expiresText}
      `;

      list.appendChild(item);
    });

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
    const link = document.getElementById('profile-promocodes-link');
    if (link) {
      link.addEventListener('click', () => {
        AppRouter.go('promocodes');
        loadPromocodes(); // 🔹 загрузка при открытии экрана
      });
    }
  }

  function setPromocodes(list) {
    userPromocodes = list || [];
    renderPromocodes();
  }

  return {
    initPromoScreen,
    setPromocodes,
  };
})();
