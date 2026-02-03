// ===== МОДУЛЬ: ПРОФИЛЬ, ИСТОРИЯ, ЗАДАНИЯ =====
window.AppProfile = (() => {
  const FALLBACK_USER_ID = 1040828537;

  async function loadProfile() {
    try {
      const initData = AppCore.getInitData();
      const data = await AppApi.fetchMe(initData, FALLBACK_USER_ID);

      document.getElementById("user-name").textContent = data.name || "—";
      document.getElementById("user-username").textContent = data.username || "@username";

      // ===== Сводка =====
      const summaryStatusName = document.querySelector('#summary-status .summary-status-name');
      if (summaryStatusName) {
        summaryStatusName.textContent = data.status_title || 'Новичок';
      }

      document.getElementById("summary-balance").textContent = (data.credits_balance ?? "—");
      document.getElementById("summary-registered").textContent = 
        (AppCore.formatDate && data.registered_at) 
          ? AppCore.formatDate(data.registered_at) 
          : "—";

      // ===== Активность =====
      document.getElementById("activity-friends").textContent = data.friends_invited ?? "0";
      document.getElementById("activity-tasks").textContent = data.tasks_completed ?? "0";
      document.getElementById("activity-requests").textContent = data.requests_total ?? "0";
    } catch (e) {
      console.error("loadProfile error:", e);
    }
  }

  function initHistorySection() {
    const historyLink = document.getElementById('profile-history-link');
    const historyScreen = document.getElementById('profile-history');

    if (!historyLink || !historyScreen) return;

    // переход в экран "История запросов"
    historyLink.addEventListener('click', () => {
      AppRouter.go('history');
    });

    const readButtons = historyScreen.querySelectorAll('.history-read-btn');
    readButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        alert('Здесь будет полный текст ответа из базы (заглушка).');
      });
    });
  }

  function initTasksSection() {
    const tasksLink = document.getElementById('profile-tasks-link');
    if (!tasksLink) return;

    // Переход в экран "Задания" (шапка + список разделов)
    tasksLink.addEventListener('click', () => {
      AppRouter.go('tasks');
    });
  }

  function initStatusLink() {
    const statusLinkCard = document.getElementById('profile-status-link');
    const summaryStatusBtn = document.getElementById('summary-status');

    function openStatusProgress() {
      AppRouter.go('status'); // тот же роут, что и для карточки «Прогресс статуса»
    }

    if (statusLinkCard) {
      statusLinkCard.addEventListener('click', openStatusProgress);
    }
    if (summaryStatusBtn) {
      summaryStatusBtn.addEventListener('click', openStatusProgress);
    }
  }

  function initRefLinkSection() {
    const refLink = document.getElementById('profile-ref-link');
    const refScreen = document.getElementById('profile-ref');

    if (!refLink || !refScreen) return;

    // переход в экран "Реферальная программа"
    refLink.addEventListener('click', () => {
      AppRouter.go('referral');
    });
  }

  function initRefBonusBlock() {
    const bonusCard = document.getElementById('profile-ref-bonus');
    const refLinkCard = document.getElementById('profile-ref-link');
    if (!bonusCard || !refLinkCard) return;

    bonusCard.addEventListener('click', () => {
      refLinkCard.click();
    });
  }

  return {
    loadProfile,
    initHistorySection,
    initTasksSection,
    initRefBonusBlock,
    initRefLinkSection,
    initStatusLink,
  };
})();
