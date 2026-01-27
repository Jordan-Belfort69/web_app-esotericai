// Модуль UI для раздела "Задания"
window.AppTasks = (() => {

  function initTasksUI() {
    const categoriesSection = document.getElementById('tasks-categories');
    if (!categoriesSection) return;

    const categoryButtons = categoriesSection.querySelectorAll('.tasks-category-btn');
    categoryButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        renderTasksList(category);
        AppRouter.go('tasks-list'); // вместо ручного display
      });
    });
  }

  function renderTasksList(category) {
    const listTitle = document.getElementById('tasks-list-title');
    const container = document.getElementById('tasks-list-container');
    if (!listTitle || !container) return;

    const titlesMap = {
      daily: 'Ежедневные задания',
      activity: 'Сообщество и активность',
      referral: 'Реферальные задания',
      usage: 'Использование функционала',
      purchases: 'Задания за покупки',
      levels: 'Достижения (повышение уровня)',
    };

    listTitle.textContent = titlesMap[category] || 'Задания';
    const tasks = (window.AppTasksConfig && window.AppTasksConfig[category]) || [];
    container.innerHTML = '';

    tasks.forEach((task) => {
      const item = document.createElement('div');
      item.className = 'history-item tasks-item';

      item.innerHTML = `
        <div class="tasks-header-row">
          <div class="history-question">${task.title}</div>
          <div class="tasks-reward">+${task.xp} XP${task.sms ? ' · ' + task.sms + ' SMS' : ''}${task.promo ? ' · ' + task.promo : ''}</div>
        </div>
        <div class="tasks-details" style="display:none;">
          <div class="history-answer-preview">
            ${task.desc}
          </div>
          <div class="tasks-note">
            Награда будет начислена автоматически после выполнения условий.
          </div>
        </div>
      `;

      const headerRow = item.querySelector('.tasks-header-row');
      const details = item.querySelector('.tasks-details');
      headerRow.addEventListener('click', () => {
        const isHidden = details.style.display === 'none';
        details.style.display = isHidden ? 'block' : 'none';
      });

      container.appendChild(item);
    });
  }

  return {
    initTasksUI,
  };
})();
