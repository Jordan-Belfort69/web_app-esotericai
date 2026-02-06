// ===== МОДУЛЬ: ПОКУПКИ СООБЩЕНИЙ =====

window.AppSubs = (() => {
  let lastQuote = null; // запоминаем последний расчёт от бэка

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

    // промокод (теперь только информируем, проверка — на бэке)
    const promoInput = document.getElementById('subs-promo-input');
    const promoMessage = document.getElementById('subs-promo-message');

    if (promoInput && promoMessage) {
      promoInput.addEventListener('input', () => {
        const code = promoInput.value.trim();
        if (!code) {
          promoMessage.textContent = '';
          promoMessage.className = 'subs-promo-message';
          return;
        }
        // Точный текст можно будет обновить, когда решишь, какие сообщения показывать
        promoMessage.textContent = 'Промокод будет проверен при расчёте.';
        promoMessage.className = 'subs-promo-message';
      });
    }

    // обработка кнопки "Купить" → запрос /subs/quote и переход на экран подтверждения
    if (buyBtn) {
      buyBtn.addEventListener('click', async () => {
        const activeOption = document.querySelector('.subs-option-row-active');
        const activePay = document.querySelector('.subs-pay-row-active');

        const messagesStr = activeOption ? activeOption.getAttribute('data-messages') : null;
        const method = activePay ? activePay.getAttribute('data-method') : null;
        const email = emailInput ? emailInput.value.trim() : '';
        const promoCode = promoInput ? promoInput.value.trim() : '';

        const messages = messagesStr ? parseInt(messagesStr, 10) : null;

        if (!messages || !method) {
          alert('Выбери пакет сообщений и способ оплаты');
          return;
        }

        try {
          const initData = window.Telegram?.WebApp?.initData || null;
          // запрос расчёта на бэкенд
          const quote = await AppApi.fetchSubsQuote(
            initData,
            messages,
            method,
            promoCode || null
          );
          console.log('Subs quote:', quote);
          lastQuote = { quote, email, promoCode, method };

          const msgEl   = document.getElementById('subs-confirm-messages');
          const mthEl   = document.getElementById('subs-confirm-method');
          const amtEl   = document.getElementById('subs-confirm-amount');
          const emailEl = document.getElementById('subs-confirm-email');
          const promoEl = document.getElementById('subs-confirm-promo');

          if (msgEl)   msgEl.textContent = `${quote.messages} сообщений`;
          if (mthEl) {
            mthEl.textContent =
              method === 'sbp'   ? 'СБП' :
              method === 'card'  ? 'Банковская карта' :
              method === 'stars' ? 'Telegram Stars' :
              '—';
          }
          if (amtEl)   amtEl.textContent = `${quote.final_amount / 100} ₽`;
          if (emailEl) emailEl.textContent = email || '—';
          if (promoEl) promoEl.textContent =
            quote.promo_code_applied && promoCode ? promoCode : 'Не применён';

          AppRouter.go('buy-confirm');
        } catch (e) {
          console.error('Ошибка расчёта покупки', e);
          alert('Не удалось рассчитать покупку. Попробуй позже.');
        }
      });
    }

    // кнопка "Оплатить" на экране подтверждения → /subs/create-invoice
    const confirmPayBtn = document.getElementById('subs-confirm-pay-btn');
    if (confirmPayBtn) {
      confirmPayBtn.addEventListener('click', async () => {
        console.log('CONFIRM PAY CLICK');
        if (!lastQuote) {
          alert('Сначала выбери пакет и пересчитай стоимость.');
          return;
        }

        const { quote, email, promoCode, method } = lastQuote;
        try {
          const initData = window.Telegram?.WebApp?.initData || null;
          const invoice = await AppApi.createInvoice(
            initData,
            quote.messages,
            method,
            email || null,
            promoCode || null,
            quote.final_amount
          );
          console.log('Invoice created:', invoice);
          // пока просто показываем, что всё ок
          alert('Счёт создан. Оплата пока заглушка (stub).');
          // здесь позже можно будет вызвать реальный tg.sendData / оплату
        } catch (e) {
          console.error('Ошибка создания счёта', e);
          alert('Не удалось создать счёт. Попробуй позже.');
        }
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
      AppRouter.go('buy');
    });
  }

  return {
    initSubsControls,
    initBuySubButton,
  };
})();
