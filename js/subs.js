// ===== МОДУЛЬ: ПОКУПКИ СООБЩЕНИЙ =====

window.AppSubs = (() => {
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

    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        const activeOption = document.querySelector('.subs-option-row-active');
        const activePay = document.querySelector('.subs-pay-row-active');

        const messages = activeOption ? activeOption.getAttribute('data-messages') : null;
        const method = activePay ? activePay.getAttribute('data-method') : null;
        const email = emailInput ? emailInput.value.trim() : '';

        console.log('BUY CLICK', { messages, method, email });
        // сюда позже добавишь вызов бекенда / оплаты
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
