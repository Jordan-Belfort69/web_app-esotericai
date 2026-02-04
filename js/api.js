// ===== ИСПРАВЛЕННЫЙ КОД =====
window.AppApi = (() => {
// ✅ Правильный публичный URL Railway
const BASE_URL = "https://web-production-4d81b.up.railway.app/api";

async function request(path, params = {}, options = {}) {
    const url = new URL(BASE_URL + path);
    
    // ✅ ПРОВЕРЯЕМ: если это initData - НЕ КОДИРОВАТЬ!
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
            if (k === 'initData') {
                // initData уже закодирован от Telegram - просто добавляем
                url.searchParams.append(k, v);
            } else {
                url.searchParams.set(k, v);
            }
        }
    });

    console.log("📡 API Request: ", path, params);
    
    const res = await fetch(url, {
        method: options.method || "GET",  // ✅ Без пробела
        headers: {
            "Content-Type": "application/json",  // ✅ Без пробела
            "X-Requested-With": "XMLHttpRequest",  // ✅ Без пробела
            ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ status: res.status }));
        console.error("❌ API Error: ", path, res.status, error);
        throw new Error(`API ${path} ${res.status}: ${JSON.stringify(error)}`);
    }

    const data = await res.json();
    console.log("✅ API Response: ", path, data);
    return data;
}

// ============ ПРОФИЛЬ ============
function fetchMe(initData, fallbackUserId) {
    const params = initData ? { initData } : { user_id: fallbackUserId };  // ✅ Без пробела
    return request("/me", params);  // ✅ Без пробела
}

// ============ ИСТОРИЯ ============
function fetchHistoryList(initData, limit = 20, offset = 0) {
    return request("/history/list", { initData, limit, offset });  // ✅ Без пробела
}

function fetchHistoryDetail(initData, recordId) {
    return request(`/history/detail/${recordId}`, { initData });  // ✅ Без пробела
}

// ============ ЗАДАЧИ ============
function fetchTasksList(initData, category) {
    return request("/tasks/list", { initData, category });  // ✅ Без пробела
}

function claimTaskReward(initData, taskCode) {
    // ✅ ПРАВИЛЬНО: initData в query params, НЕ в теле!
    return request("/tasks/claim", { 
        initData, 
        task_code: taskCode 
    });
}

// ============ РЕФЕРАЛКА ============
function fetchReferralsInfo(initData) {
    return request("/referrals/info", { initData });  // ✅ Без пробела
}

// ============ ПРОМОКОДЫ ============
function fetchPromocodesList(initData) {
    return request("/promocodes/list", { initData });  // ✅ Без пробела
}

// ============ ПОКУПКИ ============
function fetchSubsQuote(initData, messages, method = "sbp", promoCode = null) {
    return request("/subs/quote", {  // ✅ Без пробела
        initData,
        messages,
        method,
        promo_code: promoCode
    });
}

function createInvoice(initData, messages, method = "sbp", email = null, promoCode = null, clientConfirmedAmount) {
    return request("/subs/create-invoice", {  // ✅ Без пробела
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
    return request("/rituals/daily-tip-settings", { initData });  // ✅ Без пробела
}

function updateDailyTipSettings(initData, enabled, timeFrom, timeTo, timezone) {
    return request("/rituals/daily-tip-settings", {  // ✅ Без пробела
        initData,
        enabled,
        time_from: timeFrom,
        time_to: timeTo,
        timezone
    });
}

// ============ ГОРОСКОП ============
function fetchHoroscope(initData, zodiac, scope = "none") {
    return request("/horoscope", {  // ✅ Без пробела
        initData,
        zodiac,
        scope
    });
}

// ============ ТАРО ============
function fetchTarot(initData, spreadType = "one_card", question = "") {
    return request("/tarot", {  // ✅ Без пробела
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