// ===== МОДУЛЬ: РИТУАЛЫ — СОВЕТ ДНЯ =====
// Связь с бэкендом: при открытии экрана — загрузка настроек (GET), при сохранении — отправка (POST).

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

    // восстановление из localStorage (fallback при отсутствии сети/initData)
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
      if (tipTimeLabel) {
        if (ritualTipState.enabled && ritualTipState.time) {
          tipTimeLabel.textContent = ritualTipState.time;
        } else {
          tipTimeLabel.textContent = '›';
        }
      }
    }

    function applyStateToUI() {
      if (tipEnabledCheckbox) tipEnabledCheckbox.checked = ritualTipState.enabled;
      if (tipExtra) tipExtra.style.display = ritualTipState.enabled ? 'block' : 'none';
      if (tipTzLabel) tipTzLabel.textContent = ritualTipState.timezone;
      if (tipTimeBtn) tipTimeBtn.textContent = ritualTipState.time || 'Выбрать';
    }

    function openTipSettings() {
      const ritualsSection = document.getElementById('rituals-section');

      if (ritualsSection) ritualsSection.style.display = 'none';
      if (timeScreen) timeScreen.style.display = 'none';

      applyStateToUI();
      if (tipSettings) tipSettings.style.display = 'block';
    }

    updateMainTimeLabel();

    // открыть настройки из «Ритуалов» и подгрузить настройки с бэкенда
    tipLink.addEventListener('click', async () => {
      AppRouter.go('tip');
      const initData = (window.AppCore && window.AppCore.getInitData && window.AppCore.getInitData()) || (window.AppAuth && window.AppAuth.getInitData && window.AppAuth.getInitData()) || null;
      if (initData && window.AppApi && window.AppApi.fetchDailyTipSettings) {
        try {
          const res = await window.AppApi.fetchDailyTipSettings(initData);
          ritualTipState.enabled = !!res.enabled;
          ritualTipState.timezone = res.timezone || 'Europe/Moscow';
          ritualTipState.time = (res.time_from && res.time_to) ? `${res.time_from}–${res.time_to}` : (res.time_from || null);
          try {
            localStorage.setItem('ritualTipState', JSON.stringify(ritualTipState));
          } catch (e) {}
        } catch (err) {
          console.warn('Не удалось загрузить настройки совета дня:', err);
        }
      }
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

    // кнопка «Готово» — сохранить на бэкенд и выйти
    if (tipSaveBtn) {
      tipSaveBtn.addEventListener('click', async () => {
        let timeFrom = null;
        let timeTo = null;
        if (ritualTipState.time) {
          const parts = String(ritualTipState.time).split(/[–\-]/).map(s => s.trim());
          timeFrom = parts[0] || null;
          timeTo = parts[1] || null;
        }

        const initData = (window.AppCore && window.AppCore.getInitData && window.AppCore.getInitData()) || (window.AppAuth && window.AppAuth.getInitData && window.AppAuth.getInitData()) || null;

        if (initData && window.AppApi && window.AppApi.updateDailyTipSettings) {
          try {
            await window.AppApi.updateDailyTipSettings(
              initData,
              ritualTipState.enabled,
              timeFrom,
              timeTo,
              ritualTipState.timezone
            );
          } catch (err) {
            console.error('Ошибка сохранения настроек совета дня:', err);
            alert('Не удалось сохранить настройки. Проверьте интернет и попробуйте снова.');
            return;
          }
        }

        try {
          localStorage.setItem('ritualTipState', JSON.stringify(ritualTipState));
        } catch (e) {
          console.warn('cannot save ritualTipState', e);
        }

        updateMainTimeLabel();

        AppRouter.stack = ['rituals'];
        AppRouter.apply();
      });
    }
  }

  return {
    initRitualTip,
  };
})();
