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
            
            // Обновляем имя и username
            updateProfileHeader(profile);
            
            // Обновляем все элементы профиля
            updateProfileFields(profile);
            
        } catch (err) {
            console.error("❌ loading profile:", err);
            alert("Ошибка загрузки профиля: " + err.message);
        }
    }
    
    // Обновление заголовка профиля (имя и username)
    function updateProfileHeader(profile) {
        // Обновление имени
        const nameEl = document.querySelector('.profile-name');
        if (nameEl && profile.name) {
            nameEl.textContent = profile.name;
        }
        
        // Обновление username
        const usernameEl = document.querySelector('.profile-username');
        if (usernameEl && profile.username) {
            usernameEl.textContent = `@${profile.username}`;
        }
    }
    
    // Обновление всех полей профиля
    function updateProfileFields(profile) {
        // Найти все элементы профиля
        const profileItems = document.querySelectorAll('.profile-item');
        
        profileItems.forEach(item => {
            const label = item.querySelector('.profile-label');
            const value = item.querySelector('.profile-value');
            
            if (!label || !value) return;
            
            const labelText = label.textContent.trim();
            
            // Обновление статуса
            if (labelText === 'Ваш статус' && profile.status_title) {
                value.textContent = profile.status_title;
            }
            
            // Обновление баланса сообщений
            if (labelText === 'Баланс сообщений' && profile.credits_balance !== undefined) {
                value.textContent = `${profile.credits_balance} сообщений`;
            }
            
            // Обновление даты регистрации
            if (labelText === 'Дата регистрации' && profile.registered_at) {
                value.textContent = formatDate(profile.registered_at);
            }
            
            // Обновление приглашенных друзей
            if (labelText === 'Приглашено друзей' && profile.friends_invited !== undefined) {
                value.textContent = profile.friends_invited;
            }
            
            // Обновление выполненных заданий
            if (labelText === 'Выполнено заданий' && profile.tasks_completed !== undefined) {
                value.textContent = profile.tasks_completed;
            }
            
            // Обновление сделанных запросов
            if (labelText === 'Сделано запросов' && profile.requests_total !== undefined) {
                value.textContent = profile.requests_total;
            }
        });
    }
    
    // Форматирование даты
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            console.error("Ошибка форматирования даты:", e);
            return dateString;
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