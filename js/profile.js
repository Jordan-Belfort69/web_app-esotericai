// ===== ПРОФИЛЬ =====
window.AppProfile = (() => {
    // Загрузка профиля
    async function loadProfile() {
        const initData = AppCore.getInitData();
        
        console.log("👤 loadProfile called");
        console.log("📋 initData:", initData);
        
        if (!initData) {
            console.error("❌ initData is null!");
            alert("Не удалось загрузить данные пользователя. Попробуйте перезапустить приложение.");
            return;
        }

        try {
            const profile = await AppApi.fetchMe(initData);
            console.log("✅ Profile loaded:", profile);
            
            // Обновляем имя
            if (profile.name) {
                const nameEl = document.querySelector('.profile-name');
                if (nameEl) {
                    nameEl.textContent = profile.name;
                }
            }
            
            // Обновляем username
            if (profile.username) {
                const usernameEl = document.querySelector('.profile-username');
                if (usernameEl) {
                    usernameEl.textContent = `@${profile.username}`;
                }
            }
            
            // Обновляем баланс сообщений
            if (profile.credits_balance !== undefined) {
                const creditsEl = document.querySelector('.profile-credits');
                if (creditsEl) {
                    creditsEl.textContent = `${profile.credits_balance} сообщений`;
                }
            }
            
            // Обновляем дату регистрации
            if (profile.registered_at) {
                const registeredEl = document.querySelector('.profile-registered');
                if (registeredEl) {
                    registeredEl.textContent = `Дата регистрации: ${AppCore.formatDate(profile.registered_at)}`;
                }
            }
            
            // Обновляем статус
            if (profile.status_title) {
                const statusEl = document.querySelector('.profile-status');
                if (statusEl) {
                    statusEl.textContent = profile.status_title;
                }
            }
            
            // Обновляем активность
            if (profile.friends_invited !== undefined) {
                const friendsEl = document.querySelector('.profile-friends');
                if (friendsEl) {
                    friendsEl.textContent = `Приглашено друзей: ${profile.friends_invited}`;
                }
            }
            
            if (profile.tasks_completed !== undefined) {
                const tasksEl = document.querySelector('.profile-tasks-completed');
                if (tasksEl) {
                    tasksEl.textContent = `Выполнено заданий: ${profile.tasks_completed}`;
                }
            }
            
            if (profile.requests_total !== undefined) {
                const requestsEl = document.querySelector('.profile-requests');
                if (requestsEl) {
                    requestsEl.textContent = `Сделано запросов: ${profile.requests_total}`;
                }
            }
            
            if (profile.xp !== undefined) {
                const xpEl = document.querySelector('.profile-xp');
                if (xpEl) {
                    xpEl.textContent = `Опыт: ${profile.xp} XP`;
                }
            }
            
        } catch (err) {
            console.error("❌ Error loading profile:", err);
            alert("Ошибка загрузки профиля: " + err.message);
        }
    }

    // Инициализация секции истории
    function initHistorySection() {
        const historyBtn = document.querySelector('[data-screen="history"]');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => {
                AppRouter.go("history");
            });
        }
    }

    // Инициализация секции заданий
    function initTasksSection() {
        const tasksBtn = document.querySelector('[data-screen="tasks"]');
        if (tasksBtn) {
            tasksBtn.addEventListener('click', () => {
                AppRouter.go("tasks");
            });
        }
    }

    // Инициализация секции реферальной ссылки
    function initRefLinkSection() {
        const refBtn = document.querySelector('[data-screen="referral"]');
        if (refBtn) {
            refBtn.addEventListener('click', () => {
                AppRouter.go("referral");
            });
        }
    }

    // Инициализация блока реферального бонуса
    function initRefBonusBlock() {
        const refBonusBtn = document.querySelector('.ref-bonus-btn');
        if (refBonusBtn) {
            refBonusBtn.addEventListener('click', () => {
                AppRouter.go("referral");
            });
        }
    }

    // Инициализация ссылки на статус
    function initStatusLink() {
        const statusBtn = document.querySelector('[data-screen="status"]');
        if (statusBtn) {
            statusBtn.addEventListener('click', () => {
                AppRouter.go("status");
            });
        }
    }

    return {
        loadProfile,
        initHistorySection,
        initTasksSection,
        initRefLinkSection,
        initRefBonusBlock,
        initStatusLink,
    };
})();