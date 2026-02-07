// ===== МОДУЛЬ: РИТУАЛЫ — ГОРОСКОП =====
// Как у Таро: по кнопке «Прочитать гороскоп» открывается ссылка t.me/БОТ?start=horoscope_знак_сфера,
// пользователь попадает в чат бота, бот по /start сразу присылает гороскоп.

// Username бота без @ (например EsotericAI_bot). Задайте в конфиге фронта или здесь.
const BOT_USERNAME = window.AppCore?.botUsername || "EsotericAI_bot";

window.AppHoroscope = (() => {
  let horoscopeState = {
    zodiac: null,
    scope: 'none',
  };

  function initHoroscope() {
    const tg = AppCore?.tg || window.Telegram?.WebApp;

    const link = document.getElementById('ritual-horoscope-link');
    const screen = document.getElementById('ritual-horoscope-settings');
    const readBtn = document.getElementById('horoscope-read-btn');

    const zodiacButtons = document.querySelectorAll('.horoscope-zodiac-btn');
    const scopeButtons = document.querySelectorAll('.horoscope-scope-btn');

    if (!link || !screen || !readBtn || !zodiacButtons.length || !scopeButtons.length) {
      return;
    }

    function openHoroscopeScreen() {
      const ritualsSection = document.getElementById('rituals-section');
      const tipSettings = document.getElementById('ritual-tip-settings');
      const timeScreen = document.getElementById('ritual-tip-time-screen');

      if (ritualsSection) ritualsSection.style.display = 'none';
      if (tipSettings) tipSettings.style.display = 'none';
      if (timeScreen) timeScreen.style.display = 'none';

      zodiacButtons.forEach(btn => {
        const val = btn.getAttribute('data-zodiac');
        btn.classList.toggle('pill-btn-active', val === horoscopeState.zodiac);
      });
      scopeButtons.forEach(btn => {
        const val = btn.getAttribute('data-scope');
        btn.classList.toggle('pill-btn-active', val === horoscopeState.scope);
      });

      screen.style.display = 'block';
    }

    link.addEventListener('click', () => {
      AppRouter.go('horoscope');
      openHoroscopeScreen();
    });

    zodiacButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-zodiac');
        horoscopeState.zodiac = val;

        zodiacButtons.forEach(b => b.classList.remove('pill-btn-active'));
        btn.classList.add('pill-btn-active');
      });
    });

    scopeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-scope') || 'none';
        horoscopeState.scope = val;

        scopeButtons.forEach(b => b.classList.remove('pill-btn-active'));
        btn.classList.add('pill-btn-active');
      });
    });

    readBtn.addEventListener('click', () => {
      if (!horoscopeState.zodiac) {
        alert('Сначала выберите знак зодиака.');
        return;
      }

      const zodiac = String(horoscopeState.zodiac).trim();
      const scope = String(horoscopeState.scope || 'none').trim();

      // Как у Таро: переход по ссылке в бота с параметром start=horoscope_знак_сфера
      const startParam = `horoscope_${zodiac}_${scope}`;
      const botLink = `https://t.me/test_projectesicbot?start=${encodeURIComponent(startParam)}`;

      console.log('READ HOROSCOPE (BOT link):', botLink);

      if (tg && tg.openTelegramLink) {
        readBtn.textContent = 'Открываю чат…';
        readBtn.disabled = true;
        tg.openTelegramLink(botLink);
        tg.close();
      } else {
        // fallback: открыть в новой вкладке
        window.open(botLink, '_blank');
      }
    });
  }

  return {
    initHoroscope,
  };
})();
