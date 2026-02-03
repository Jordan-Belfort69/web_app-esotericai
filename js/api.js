// ===== API-КЛИЕНТ BACKEND =====
window.AppApi = (() => {
    // ✅ Правильный публичный URL Railway
    const BASE_URL = "https://web-production-4d81b.up.railway.app/api";
    
    async function request(path, params = {}, options = {}) {
        const url = new URL(BASE_URL + path);
        Object.entries(params).forEach(([k, v]) => {  // ← ИСПРАВЛЕНО: => вместо = >
            if (v !== undefined && v !== null) {  // ← ИСПРАВЛЕНО: && вместо & &
                url.searchParams.set(k, v);
            }
        });

        console.log("📡 API Request:", path, params);
        
        const res = await fetch(url, {
            method: options.method || "GET",  // ← УБРАН ПРОБЕЛ
            headers: {
                "Content-Type": "application/json",  // ← УБРАНЫ ПРОБЕЛЫ
                ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
            ...options,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({ status: res.status }));  // ← ИСПРАВЛЕНО: error вместо e rror
            console.error("❌ API Error:", path, res.status, error);
            throw new Error(`API ${path} ${res.status}: ${JSON.stringify(error)}`);
        }

        const data = await res.json();
        console.log("✅ API Response:", path, data);
        return data;
    }

    // ============ ПРОФИЛЬ ============
    function fetchMe(initData, fallbackUserId) {
        const params = initData ? { initData } : { user_id: fallbackUserId };  // ← ИСПРАВЛЕНО: fallbackUserId
        return request("/me", params);  // ← УБРАН ПРОБЕЛ
    }

    // ============ ИСТОРИЯ ============
    function fetchHistoryList(initData, limit = 20, offset = 0) {
        return request("/history/list", { initData, limit, offset });  // ← УБРАН ПРОБЕЛ
    }

    function fetchHistoryDetail(initData, recordId) {
        return request(`/history/detail/${recordId}`, { initData });
    }

    // ============ ЗАДАЧИ ============
    function fetchTasksList(initData, category) {
        return request("/tasks/list", { initData, category });  // ← УБРАН ПРОБЕЛ
    }

    function claimTaskReward(initData, taskCode) {
        return request("/tasks/claim", {}, {  // ← УБРАН ПРОБЕЛ
            method: "POST",  // ← УБРАН ПРОБЕЛ
            body: { task_code: taskCode, initData },
        });
    }

    // ============ РЕФЕРАЛКА ============
    function fetchReferralsInfo(initData) {
        return request("/referrals/info", { initData });  // ← УБРАН ПРОБЕЛ
    }

    // ============ ПРОМОКОДЫ ============
    function fetchPromocodesList(initData) {
        return request("/promocodes/list", { initData });  // ← УБРАН ПРОБЕЛ
    }

    // ============ ПОКУПКИ ============
    function fetchSubsQuote(initData, messages, method = "sbp", promoCode = null) {  // ← УБРАН ПРОБЕЛ
        return request("/subs/quote", {}, {  // ← УБРАН ПРОБЕЛ
            method: "POST",  // ← УБРАН ПРОБЕЛ
            body: { messages, method, promo_code: promoCode, initData },
        });
    }

    function createInvoice(initData, messages, method = "sbp", email = null, promoCode = null, clientConfirmedAmount) {  // ← УБРАН ПРОБЕЛ
        return request("/subs/create-invoice", {}, {  // ← УБРАН ПРОБЕЛ
            method: "POST",  // ← УБРАН ПРОБЕЛ
            body: {
                messages,
                method,
                email,
                promo_code: promoCode,
                client_confirmed_amount: clientConfirmedAmount,
                initData,
            },
        });
    }

    // ============ РИТУАЛЫ ============
    function fetchDailyTipSettings(initData) {
        return request("/rituals/daily-tip-settings", { initData });  // ← УБРАН ПРОБЕЛ
    }

    function updateDailyTipSettings(initData, enabled, timeFrom, timeTo, timezone) {
        return request("/rituals/daily-tip-settings", {}, {  // ← УБРАН ПРОБЕЛ
            method: "POST",  // ← УБРАН ПРОБЕЛ
            body: { enabled, time_from: timeFrom, time_to: timeTo, timezone, initData },
        });
    }

    // ============ ГОРОСКОП ============
    function fetchHoroscope(initData, zodiac, scope = "none") {  // ← УБРАН ПРОБЕЛ
        return request("/horoscope", {}, {  // ← УБРАН ПРОБЕЛ
            method: "POST",  // ← УБРАН ПРОБЕЛ
            body: { zodiac, scope, initData },
        });
    }

    // ============ ТАРО ============
    function fetchTarot(initData, spreadType = "one_card", question = "") {  // ← УБРАН ПРОБЕЛ
        return request("/tarot", {}, {  // ← УБРАН ПРОБЕЛ
            method: "POST",  // ← УБРАН ПРОБЕЛ
            body: { spread_type: spreadType, question, initData },
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