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
      document.getElementById("summary-status").textContent =
        data.status_title || "Новичок";

      document.getElementById("summary-balance").textContent =
        (data.credits_balance ?? "—") + "";

      document.getElementById("summary-registered").textContent =
        (AppCore.formatDate && data.registered_at)
          ? AppCore.formatDate(data.registered_at)
          : "—";

      // ===== Активность =====
      document.getElementById("activity-friends").textContent =
        data.friends_invited ?? "0";

      document.getElementById("activity-tasks").textContent =
        data.tasks_completed ?? "0";

      document.getElementById("activity-requests").textContent =
        data.requests_total ?? "0";

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
    const tasksHeader = document.getElementById('profile-tasks');
    const task1Details = document.getElementById('task1-details');
    const task2Details = document.getElementById('task2-details');

    if (!tasksLink || !tasksHeader) return;

    // переход в экран "Задания"
    tasksLink.addEventListener('click', () => {
      AppRouter.go('tasks');
    });

    // открытие конкретного задания
    const taskButtons = document.querySelectorAll('.tasks-open-btn');
    taskButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-task');

        if (taskId === '1') {
          AppRouter.go('task1');
        } else if (taskId === '2') {
          AppRouter.go('task2');
        }
      });
    });

    const claimButtons = document.querySelectorAll('.tasks-claim-btn');
    claimButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-task');
        alert('❌ Условие: Оставить отзыв о работе с проектом не выполнено! (task ' + taskId + ')');
      });
    });
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
  };
})();
