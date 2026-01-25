// ===== МОДУЛЬ: РИТУАЛЫ — СОВЕТ ДНЯ =====

window.AppRitualTip = (() => {
  let ritualTipState = {
    enabled: false,
    time: null,
    timezone: 'Europe/Moscow',
  };

  function initRitualTip() {
    const tipLink = document.getElementById('ritual-tip-link');
    const tipTimeLabel = document.getElementById('ritual-tip-time-label');
    const tipSettings = document.getElementById('ritual-tip-settings');
    const tipEnabledCheckbox = document.getElementById('ritual-tip-enabled');
    const tipExtra = document.getElementById('ritual-tip-extra');
    const tipTimeBtn = document.getElementById('ritual-tip-time-btn');
    const tipTzLabel = document.getElementById('ritual-tip-tz-label');
    const tipSaveBtn = document.getElementById('ritual-tip-save-btn');

    const timeScreen = document.getElementById('ritual-tip-time-screen');
    const timeOptions = document.querySelectorAll('.ritual-time-option');

    // восстановление из localStorage
    try {
      const saved = localStorage.getItem('ritualTipState');
      if (saved) {
        const parsed = JSON.parse(saved);
        ritualTipState.enabled = !!parsed.enabled;
        ritualTipState.time = parsed.time || null;
        ritualTipState.timezone = parsed.timezone || 'Europe/Moscow';
      }
    } catch (e) {
      console.warn('cannot load ritualTipState', e);
    }

    if (!tipLink || !tipSettings) return;

    function updateMainTimeLabel() {
      if (ritualTipState.enabled && ritualTipState.time) {
        tipTimeLabel.textContent = ritualTipState.time;
      } else {
        tipTimeLabel.textContent = '›';
      }
    }

    function openTipSettings() {
      // никаких манипуляций с profile / tarot / subs / rituals здесь
      // только управление собственными экранами «Совета дня»
      if (timeScreen) timeScreen.style.display = 'none';

      tipEnabledCheckbox.checked = ritualTipState.enabled;
      tipExtra.style.display = ritualTipState.enabled ? 'block' : 'none';
      tipTzLabel.textContent = ritualTipState.timezone;
      tipTimeBtn.textContent = ritualTipState.time || 'Выбрать';

      tipSettings.style.display = 'block';
    }

    updateMainTimeLabel();

    // открыть настройки из «Ритуалов»
    tipLink.addEventListener('click', () => {
      AppRouter.go('tip'); // экран "Совет дня"
      openTipSettings();
    });

    // переключатель
    tipEnabledCheckbox.addEventListener('change', () => {
      ritualTipState.enabled = tipEnabledCheckbox.checked;
      tipExtra.style.display = ritualTipState.enabled ? 'block' : 'none';
      updateMainTimeLabel();

      // сохраняем новое состояние (вкл/выкл)
      try {
        localStorage.setItem('ritualTipState', JSON.stringify(ritualTipState));
      } catch (e) {
        console.warn('cannot save ritualTipState', e);
      }
    });

    // открыть экран выбора времени
    tipTimeBtn.addEventListener('click', () => {
      tipSettings.style.display = 'none';
      if (timeScreen) timeScreen.style.display = 'block';

      timeOptions.forEach(opt => {
        const val = opt.getAttribute('data-time');
        opt.classList.toggle(
          'ritual-time-option-selected',
          ritualTipState.time === val
        );
      });
    });

    // выбор слота времени
    timeOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const val = opt.getAttribute('data-time');
        ritualTipState.time = val;

        timeOptions.forEach(o => o.classList.remove('ritual-time-option-selected'));
        opt.classList.add('ritual-time-option-selected');

        // сохраняем новое время
        try {
          localStorage.setItem('ritualTipState', JSON.stringify(ritualTipState));
        } catch (e) {
          console.warn('cannot save ritualTipState', e);
        }

        if (timeScreen) timeScreen.style.display = 'none';
        openTipSettings();
        updateMainTimeLabel();
      });
    });

    // кнопка «Готово»
    if (tipSaveBtn) {
      tipSaveBtn.addEventListener('click', () => {
        const payload = {
          type: 'daily_tip_settings',
          enabled: ritualTipState.enabled,
          time: ritualTipState.time,
          timezone: ritualTipState.timezone,
        };

        console.log('SAVE DAILY TIP:', payload);

        // локальное сохранение
        try {
          localStorage.setItem('ritualTipState', JSON.stringify(ritualTipState));
        } catch (e) {
          console.warn('cannot save ritualTipState', e);
        }

        updateMainTimeLabel();

        // назад в экран "Ритуалы" (нижняя вкладка)
        AppRouter.stack = ['rituals'];
        AppRouter.apply();
      });
    }
  }

  return {
    initRitualTip,
  };
})();
