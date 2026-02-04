// ===== API-КЛИЕНТ BACKEND =====
window.AppApi = (() => {
    // ✅ Правильный публичный URL Railway
    const BASE_URL = "https://web-production-4d81b.up.railway.app/api";
    
    async function request(path, params = {}, options = {}) {
        const url = new URL(BASE_URL + path);
        
        // ✅ ТОЧНО ПО УСЛОВИЮ: УБРАЛИ encodeURIComponent, просто используем searchParams.set()
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
                url.searchParams.set(k, v);  // ← Просто как есть, без доп. кодирования
            }
        });

        console.log("📡 API Request URL:", url.toString());

        const res = await fetch(url, {
            method: options.method || "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
            ...options,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({ status: res.status }));
            console.error("❌ API Error:", path, res.status, error);
            throw new Error(`API ${path} ${res.status}: ${JSON.stringify(error)}`);
        }

        const data = await res.json();
        console.log("✅ API Response:", path, data);
        return data;
    }
    
    // ============ ПРОФИЛЬ ============
    function fetchMe(initData, fallbackUserId) {
        console.log("🔍 [FRONTEND] Получен initData:", initData);
        console.log("🔍 [FRONTEND] Длина:", initData.length);
        console.log("🔍 [FRONTEND] Содержит 'hash':", initData.includes('hash='));
        const params = initData ? { initData } : { user_id: fallbackUserId };
        return request("/me", params);
    }
    
    // ============ ИСТОРИЯ ============
    function fetchHistoryList(initData, limit = 20, offset = 0) {
        return request("/history/list", { initData, limit, offset });
    }
    
    function fetchHistoryDetail(initData, recordId) {
        return request(`/history/detail/${recordId}`, { initData });
    }
    
    // ============ ЗАДАЧИ ============
    function fetchTasksList(initData, category) {
        return request("/tasks/list", { initData, category });
    }
    
    function claimTaskReward(initData, taskCode) {
        return request("/tasks/claim", {
            initData,
            task_code: taskCode
        });
    }
    
    // ============ РЕФЕРАЛКА ============
    function fetchReferralsInfo(initData) {
        return request("/referrals/info", { initData });
    }
    
    // ============ ПРОМОКОДЫ ============
    function fetchPromocodesList(initData) {
        return request("/promocodes/list", { initData });
    }
    
    // ============ ПОКУПКИ ============
    function fetchSubsQuote(initData, messages, method = "sbp", promoCode = null) {
        return request("/subs/quote", {
            initData,
            messages,
            method,
            promo_code: promoCode
        });
    }
    
    function createInvoice(initData, messages, method = "sbp", email = null, promoCode = null, clientConfirmedAmount) {
        return request("/subs/create-invoice", {
            initData,
            messages,
            method,
            email,
            promo_code: promoCode,
            client_confirmed_amount: clientConfirmedAmount
        });
    }
    
    // ============ РИТУАЛЫ ============
    function fetchDailyTipSettings(initData) {
        return request("/rituals/daily-tip-settings", { initData });
    }
    
    function updateDailyTipSettings(initData, enabled, timeFrom, timeTo, timezone) {
        return request("/rituals/daily-tip-settings", {
            initData,
            enabled,
            time_from: timeFrom,
            time_to: timeTo,
            timezone
        });
    }
    
    // ============ ГОРОСКОП ============
    function fetchHoroscope(initData, zodiac, scope = "none") {
        return request("/horoscope", {
            initData,
            zodiac,
            scope
        });
    }
    
    // ============ ТАРО ============
    function fetchTarot(initData, spreadType = "one_card", question = "") {
        return request("/tarot", {
            initData,
            spread_type: spreadType,
            question
        });
    }
    
    return {
        // Профиль
        fetchMe,
        // История
        fetchHistoryList,
        fetchHistoryDetail,
        // Задачи
        fetchTasksList,
        claimTaskReward,
        // Рефералка
        fetchReferralsInfo,
        // Промокоды
        fetchPromocodesList,
        // Покупки
        fetchSubsQuote,
        createInvoice,
        // Ритуалы
        fetchDailyTipSettings,
        updateDailyTipSettings,
        // Гороскоп
        fetchHoroscope,
        // Таро
        fetchTarot,
    };
})();