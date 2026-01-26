// ===== МОДУЛЬ: ПОКУПКИ СООБЩЕНИЙ =====

window.AppSubs = (() => {
  // тестовые промокоды (потом заменишь на реальные с бэкенда)
  const PROMO_CODES = {
    'MAGIC10': {
      discount: '10%',
      text: 'Промокод MAGIC10 даёт скидку 10% на выбранный пакет.',
    },
    'FRIEND20': {
      discount: '20%',
      text: 'Промокод FRIEND20 — подарок за приглашение подруги: скидка 20%.',
    },
  };

  function initSubsControls() {
    // выбор количества сообщений
    const optionRows = document.querySelectorAll('.subs-option-row');
    optionRows.forEach(row => {
      row.addEventListener('click', () => {
        optionRows.forEach(r => r.classList.remove('subs-option-row-active'));
        row.classList.add('subs-option-row-active');

        const value = row.getAttribute('data-messages');
        console.log('Selected messages:', value);
      });
    });

    // выбор метода оплаты
    const payRows = document.querySelectorAll('.subs-pay-row');
    payRows.forEach(row => {
      row.addEventListener('click', () => {
        payRows.forEach(r => r.classList.remove('subs-pay-row-active'));
        row.classList.add('subs-pay-row-active');

        const method = row.getAttribute('data-method');
        console.log('Selected pay method:', method);
      });
    });

    const buyBtn = document.getElementById('subs-buy-btn');
    const emailInput = document.getElementById('subs-email-input');

    // промокод
    const promoInput = document.getElementById('subs-promo-input');
    const promoMessage = document.getElementById('subs-promo-message');

    if (promoInput && promoMessage) {
      promoInput.addEventListener('input', () => {
        const code = promoInput.value.trim().toUpperCase();

        if (!code) {
          promoMessage.textContent = '';
          promoMessage.className = 'subs-promo-message';
          return;
        }

        const promo = PROMO_CODES[code];
        if (promo) {
          promoMessage.textContent = promo.text;
          promoMessage.className = 'subs-promo-message subs-promo-success';
        } else {
          promoMessage.textContent = 'Такого промокода нет или он больше не действует.';
          promoMessage.className = 'subs-promo-message subs-promo-error';
        }
      });
    }

    // обработка кнопки "Купить" → переход на экран подтверждения
    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        const activeOption = document.querySelector('.subs-option-row-active');
        const activePay = document.querySelector('.subs-pay-row-active');

        const messages = activeOption ? activeOption.getAttribute('data-messages') : null;
        const method = activePay ? activePay.getAttribute('data-method') : null;
        const email = emailInput ? emailInput.value.trim() : '';
        const promoCode = promoInput ? promoInput.value.trim().toUpperCase() : '';

        // цены пакетов (как в интерфейсе)
        const PRICE_MAP = {
          '100': 290,
          '200': 570,
          '300': 810,
          '500': 1275,
          '1000': 2400,
        };

        let amount = messages && PRICE_MAP[messages] ? PRICE_MAP[messages] : 0;

        // простое применение скидки по тестовым промокодам
        const promo = promoCode ? PROMO_CODES[promoCode] : null;
        if (promo && promo.discount === '10%') {
          amount = Math.round(amount * 0.9);
        } else if (promo && promo.discount === '20%') {
          amount = Math.round(amount * 0.8);
        }

        // заполняем экран подтверждения
        const msgEl   = document.getElementById('subs-confirm-messages');
        const mthEl   = document.getElementById('subs-confirm-method');
        const amtEl   = document.getElementById('subs-confirm-amount');
        const emailEl = document.getElementById('subs-confirm-email');
        const promoEl = document.getElementById('subs-confirm-promo');

        if (msgEl)   msgEl.textContent = messages ? `${messages} сообщений` : '—';
        if (mthEl) {
          mthEl.textContent =
            method === 'sbp'   ? 'СБП' :
            method === 'card'  ? 'Банковская карта' :
            method === 'stars' ? 'Telegram Stars' :
            '—';
        }
        if (amtEl)   amtEl.textContent = amount ? `${amount} ₽` : '—';
        if (emailEl) emailEl.textContent = email || '—';
        if (promoEl) promoEl.textContent = promoCode || 'Не применён';

        // переход на экран подтверждения
        AppRouter.go('buy-confirm');
      });
    }

    // кнопка "Оплатить" на экране подтверждения
    const confirmPayBtn = document.getElementById('subs-confirm-pay-btn');
    if (confirmPayBtn) {
      confirmPayBtn.addEventListener('click', () => {
        console.log('CONFIRM PAY CLICK');
        // здесь позже добавишь реальный вызов оплаты / tg.sendData(...)
      });
    }

    // опционально: обработка клика по "Условиям"
    const termsLink = document.getElementById('subs-terms-link');
    if (termsLink) {
      termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(
          'https://telegra.ph/Polzovatelskoe-soglashenie-EsotericAI-Ritual-01-06',
          '_blank'
        );
      });
    }
  }

  function initBuySubButton() {
    const buySubCard = document.getElementById('profile-buy-sub');
    if (!buySubCard) return;

    buySubCard.addEventListener('click', () => {
      // переход в экран "Купить сообщения"
      AppRouter.go('buy');
    });
  }

  return {
    initSubsControls,
    initBuySubButton,
  };
})();
