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
        AppRouter.go('tasks-list'); // переход в экран списка задач
      });
    });
  }

  async function renderTasksList(category) {
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
    container.innerHTML = 'Загрузка заданий...';

    try {
      const initData = AppAuth.getInitData();
      const resp = await AppApi.fetchTasksList(initData, category); // запрос к бэку
      const tasks = Array.isArray(resp.tasks) ? resp.tasks : [];

      if (!tasks.length) {
        container.innerHTML = '<p class="history-empty">Заданий в этой категории пока нет</p>';
        return;
      }

      container.innerHTML = '';

      tasks.forEach((task) => {
        const item = document.createElement('div');
        item.className = 'history-item tasks-item';

        const xp = task.xp || 0;
        const sms = task.sms || 0;
        const promo = task.promo || null;

        const progressCurrent = task.progress_current || 0;
        const progressTarget = task.progress_target || 0;
        const hasProgress = typeof progressTarget === 'number' && progressTarget > 1;
        const progressPercent = hasProgress
          ? Math.min(100, Math.round((progressCurrent / progressTarget) * 100))
          : 0;

        const status = task.status || 'pending';          // pending / in_progress / ready_to_claim / completed
        const rewardClaimed = !!task.reward_claimed;      // флаг с бэка

        item.innerHTML = `
          <div class="tasks-header-row">
            <div class="history-question">${task.title || task.code}</div>
            <div class="tasks-reward">
              +${xp} XP${sms ? ' · ' + sms + ' SMS' : ''}${promo ? ' · ' + promo : ''}
            </div>
          </div>
          <div class="tasks-details" style="display:none;">
            <div class="history-answer-preview">
              ${task.desc || ''}
            </div>
            ${
              hasProgress
                ? `
                  <div class="tasks-progress">
                    <div class="tasks-progress-header">
                      <span class="tasks-progress-label">Прогресс</span>
                      <span class="tasks-progress-value">
                        ${progressCurrent} / ${progressTarget}
                      </span>
                    </div>
                    <div class="tasks-progress-bar">
                      <div class="tasks-progress-bar-fill"
                           style="width: ${progressPercent}%;">
                      </div>
                    </div>
                  </div>
                `
                : ''
            }
            <div class="tasks-note">
              Награда будет начислена автоматически после выполнения условий.
            </div>
            <div class="tasks-status-row">
              <button class="tasks-status-btn tasks-status-done">
                ✅ Награда получена
              </button>
              <button class="tasks-status-btn tasks-status-pending">
                ⏳ Не выполнено
              </button>
            </div>
          </div>
        `;

        const headerRow = item.querySelector('.tasks-header-row');
        const details = item.querySelector('.tasks-details');
        const doneBtn = item.querySelector('.tasks-status-done');
        const pendingBtn = item.querySelector('.tasks-status-pending');

        // подсветка статуса
        if (rewardClaimed || status === 'completed') {
          doneBtn.classList.add('tasks-status-active');
          doneBtn.disabled = true;
          pendingBtn.classList.remove('tasks-status-active');
        } else if (status === 'ready_to_claim') {
          doneBtn.classList.add('tasks-status-active');
          pendingBtn.classList.remove('tasks-status-active');
        } else {
          pendingBtn.classList.add('tasks-status-active');
          doneBtn.classList.remove('tasks-status-active');
        }

        headerRow.addEventListener('click', () => {
          const isHidden = details.style.display === 'none';
          details.style.display = isHidden ? 'block' : 'none';
        });

        // клик по "Награда получена"
        doneBtn.addEventListener('click', async (ev) => {
          ev.stopPropagation();
          if (rewardClaimed || status === 'completed') return;

          try {
            const initData2 = AppAuth.getInitData();
            await AppApi.claimTaskReward(initData2, task.code);
            await renderTasksList(category); // обновляем список
          } catch (e) {
            console.error('Ошибка при получении награды', e);
            alert('Не удалось получить награду. Попробуйте позже.');
          }
        });

        container.appendChild(item);
      });
    } catch (e) {
      console.error('Ошибка загрузки задач', e);
      container.innerHTML = '<p class="history-error">Не удалось загрузить задания</p>';
    }
  }

  return {
    initTasksUI,
  };
})();
