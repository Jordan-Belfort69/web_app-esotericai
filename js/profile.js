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
            
            // Обновляем имя, username и аватарку
            updateProfileHeader(profile);
            
            // Обновляем все поля профиля
            updateProfileFields(profile);
            
        } catch (err) {
            console.error("❌ loading profile:", err);
            alert("Ошибка загрузки профиля: " + err.message);
        }
    }

    // Обновление заголовка профиля (имя, username, аватарка)
    function updateProfileHeader(profile) {
        // Обновление имени
        const nameEl = document.querySelector('#user-name');
        if (nameEl && profile.name) {
            nameEl.textContent = profile.name;
        }
        
        // Обновление username
        const usernameEl = document.querySelector('#user-username');
        if (usernameEl && profile.username) {
            usernameEl.textContent = `@${profile.username}`;
        }
        
        // Обновление аватарки
        const avatarEl = document.querySelector('.avatar-circle');
        const avatarImg = document.querySelector('.avatar-img');
        if (avatarImg) {
            if (profile.photo_url) {
                // Удаляем лишние пробелы из URL
                const cleanPhotoUrl = profile.photo_url.trim();
                
                // Используем URL напрямую, но добавляем параметр для обхода кеширования
                const url = cleanPhotoUrl.includes('t.me') 
                    ? `${cleanPhotoUrl}?${Date.now()}` 
                    : cleanPhotoUrl;
                
                avatarImg.src = url;
                avatarImg.style.display = 'block';
            } else if (profile.name) {
                avatarImg.style.display = 'none';
                avatarEl.textContent = profile.name.charAt(0).toUpperCase();
                avatarEl.style.backgroundColor = '#8B4513';
                avatarEl.style.color = 'white';
                avatarEl.style.fontWeight = 'bold';
            }
        }
    }

    // Обновление всех полей профиля
    function updateProfileFields(profile) {
        // Обновление баланса сообщений (только число)
        const balanceEl = document.querySelector('#summary-balance');
        if (balanceEl && profile.credits_balance !== undefined) {
            balanceEl.textContent = profile.credits_balance;
        }
        
        // Обновление даты регистрации
        const registeredEl = document.querySelector('#summary-registered');
        if (registeredEl && profile.registered_at) {
            registeredEl.textContent = formatDate(profile.registered_at);
        }
        
        // Обновление приглашенных друзей
        const friendsEl = document.querySelector('#activity-friends');
        if (friendsEl && profile.friends_invited !== undefined) {
            friendsEl.textContent = profile.friends_invited;
        }
        
        // Обновление выполненных заданий
        const tasksEl = document.querySelector('#activity-tasks');
        if (tasksEl && profile.tasks_completed !== undefined) {
            tasksEl.textContent = profile.tasks_completed;
        }
        
        // Обновление сделанных запросов
        const requestsEl = document.querySelector('#activity-requests');
        if (requestsEl && profile.requests_total !== undefined) {
            requestsEl.textContent = profile.requests_total;
        }
        
        // Обновление статуса
        const statusNameEl = document.querySelector('.summary-status-name');
        if (statusNameEl && profile.status_title) {
            statusNameEl.textContent = profile.status_title;
        }
        
        // Обновление иконки статуса (опционально)
        const statusIconEl = document.querySelector('.summary-status-icon');
        if (statusIconEl && profile.status_code) {
            const iconMap = {
                'spark': 'img/status/spark.png',
                'seeker': 'img/status/seeker.png',
                'adept': 'img/status/adept.png',
                'master': 'img/status/master.png'
            };
            statusIconEl.src = iconMap[profile.status_code] || iconMap['spark'];
        }
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
        const historyBtn = document.querySelector('#profile-history-link');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => {
                AppRouter.go("history");
            });
        }
    }

    // Инициализация секции заданий
    function initTasksSection() {
        const tasksBtn = document.querySelector('#profile-tasks-link');
        if (tasksBtn) {
            tasksBtn.addEventListener('click', () => {
                AppRouter.go("tasks");
            });
        }
    }

    // Инициализация секции реферальной ссылки
    function initRefLinkSection() {
        const refBtn = document.querySelector('#profile-ref-link');
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
        const statusBtn = document.querySelector('#profile-status-link');
        if (statusBtn) {
            statusBtn.addEventListener('click', () => {
                AppRouter.go("status");
            });
        }
    }

    // Инициализация клика на самом статусе
    function initStatusClick() {
        const statusElement = document.querySelector('.summary-status-name');
        if (statusElement) {
            statusElement.addEventListener('click', () => {
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
        initStatusClick
    };
})();