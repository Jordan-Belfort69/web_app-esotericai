// ===== МОДУЛЬ: ПРОФИЛЬ, ИСТОРИЯ, ЗАДАНИЯ =====

window.AppProfile = (() => {
  const FALLBACK_USER_ID = 1040828537;

  async function loadProfile() {
    try {
      const initData = AppCore.getInitData();
      const data = await AppApi.fetchMe(initData, FALLBACK_USER_ID);

      document.getElementById("user-name").textContent = data.name || "—";
      document.getElementById("user-username").textContent = data.username || "@username";
      document.getElementById("user-tier").textContent = AppCore.tierLabel(data.tier);

      document.getElementById("sub-status").textContent = AppCore.subStatus(data.tier);
      document.getElementById("sub-end").textContent = AppCore.formatDate(data.sub_end);
      document.getElementById("sub-days-left").textContent =
        data.sub_days_left ?? "—";

      document.getElementById("limit-ritual").textContent = data.limits?.ritual ?? "—";
      document.getElementById("limit-tarot").textContent = data.limits?.tarot ?? "—";
      document.getElementById("limit-horoscope").textContent = data.limits?.horoscope ?? "—";
      document.getElementById("limit-week").textContent = data.limits?.week ?? "—";
    } catch (e) {
      console.error("loadProfile error:", e);
    }
  }

  function initHistorySection() {
    const historyLink = document.getElementById('profile-history-link');
    const historyScreen = document.getElementById('profile-history');
    const tarotSection = document.getElementById('tarot-section');
    const subsSection = document.getElementById('subs-section');
    const profileHeader = document.querySelector('.profile-header');

    if (!historyLink || !historyScreen) return;

    historyLink.addEventListener('click', () => {
      if (profileHeader) profileHeader.style.display = 'none';

      document.querySelectorAll(
        '#profile-subscription, #profile-limits, #profile-buy-sub, ' +
        '#profile-history-link, #profile-tasks-link, #profile-ref-link, ' +
        '#profile-ref, #profile-tasks, #profile-task1-card, #profile-task2-card, ' +
        '#task1-details, #task2-details, #profile-help, #profile-help-contact'
      ).forEach(c => (c.style.display = 'none'));

      if (tarotSection) tarotSection.style.display = 'none';
      if (subsSection) subsSection.style.display = 'none';

      historyScreen.style.display = 'block';
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
    const task1CardSection = document.getElementById('profile-task1-card');
    const task2CardSection = document.getElementById('profile-task2-card');
    const task1Details = document.getElementById('task1-details');
    const task2Details = document.getElementById('task2-details');

    const tarotSection = document.getElementById('tarot-section');
    const subsSection = document.getElementById('subs-section');
    const profileHeader = document.querySelector('.profile-header');

    if (!tasksLink || !tasksHeader) return;

    tasksLink.addEventListener('click', () => {
      console.log('Tasks clicked');

      if (profileHeader) profileHeader.style.display = 'none';

      document.querySelectorAll(
        '#profile-subscription, #profile-limits, #profile-buy-sub, ' +
        '#profile-history-link, #profile-tasks-link, #profile-ref-link, ' +
        '#profile-ref, #profile-history, ' +
        '#task1-details, #task2-details, #profile-help, #profile-help-contact'
      ).forEach(c => (c.style.display = 'none'));

      if (tarotSection) tarotSection.style.display = 'none';
      if (subsSection) subsSection.style.display = 'none';

      tasksHeader.style.display = 'block';
      if (task1CardSection) task1CardSection.style.display = 'block';
      if (task2CardSection) task2CardSection.style.display = 'block';
    });

    const taskButtons = document.querySelectorAll('.tasks-open-btn');
    taskButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-task');

        if (tasksHeader) tasksHeader.style.display = 'none';
        if (task1CardSection) task1CardSection.style.display = 'none';
        if (task2CardSection) task2CardSection.style.display = 'none';

        if (taskId === '1' && task1Details) task1Details.style.display = 'block';
        if (taskId === '2' && task2Details) task2Details.style.display = 'block';
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

  return {
    loadProfile,
    initHistorySection,
    initTasksSection,
  };
})();
