const API_URL = "http://127.0.0.1:8000/api/me"; // без user_id
const tg = window.Telegram ? window.Telegram.WebApp : null;

document.addEventListener("DOMContentLoaded", () => {
  if (tg) tg.ready();
  const btn = document.getElementById("tarot-ask-btn");
  btn.addEventListener("click", () => {
    if (!tg) {
      alert("NO TG");
      return;
    }
    const payload = { type: "tarot_test", ts: Date.now() };
    console.log("SEND DATA:", payload);
    tg.sendData(JSON.stringify(payload));
  });
});

let tarotState = {
  cards: 1,
  deck: "rider",
};

function getInitData() {
  if (!tg || !tg.initData) return null;
  return tg.initData;
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU");
  } catch {
    return iso.slice(0, 10);
  }
}

function tierLabel(tier) {
  if (tier === "pro") return "🌙 PRO";
  if (tier === "mystic") return "🔮 Mystic";
  return "🆓 Free";
}

function subStatus(tier) {
  if (tier === "pro") return "Активна 🌙 PRO";
  if (tier === "mystic") return "Активна 🔮 Mystic";
  return "Бесплатный доступ";
}

async function loadProfile() {
  try {
    const initData = getInitData();

    // Если запущено внутри Telegram Mini App — шлём initData
    // Если просто в браузере — используем тестовый user_id
    const url = initData
      ? `${API_URL}?initData=${encodeURIComponent(initData)}`
      : `${API_URL}?user_id=1040828537`; // твой тестовый ID

    const res = await fetch(url);
    const data = await res.json();

    document.getElementById("user-name").textContent =
      data.first_name || "Гость";
    document.getElementById("user-username").textContent =
      data.username ? "@" + data.username : "—";
    document.querySelector(".avatar-circle").textContent =
      (data.first_name || "G").charAt(0);

    document.getElementById("user-tier").textContent = tierLabel(data.tier);
    document.getElementById("sub-status").textContent = subStatus(data.tier);
    document.getElementById("sub-end").textContent = formatDate(data.sub_end);
    document.getElementById("sub-days-left").textContent =
      data.sub_days_left ?? "—";

    const limits = data.limits_today || {};
    document.getElementById("limit-ritual").textContent =
      `${limits.ritual.used}/${limits.ritual.limit}`;
    document.getElementById("limit-tarot").textContent =
      `${limits.tarot.used}/${limits.tarot.limit}`;
    document.getElementById("limit-horoscope").textContent =
      `${limits.horoscope.used}/${limits.horoscope.limit}`;
    document.getElementById("limit-week").textContent =
      `${limits.mystic_week.used}/${limits.mystic_week.limit}`;

    document.getElementById("ref-code").textContent = data.ref_code;
    document.getElementById("ref-count").textContent = data.referrals_count;
  } catch (e) {
    console.error(e);
    alert("Не удалось загрузить данные профиля");
  }
}

function switchTab(tab) {
  const tarotSection = document.getElementById("tarot-section");
  const profileCards = document.querySelectorAll(
    "#profile-subscription, #profile-limits, #profile-ref"
  );

  const navButtons = document.querySelectorAll(".bottom-nav .nav-btn");
  navButtons.forEach(btn => {
    const t = btn.getAttribute("data-tab");
    if (!t) return;
    btn.classList.toggle("nav-btn-active", t === tab);
  });

  if (tab === "tarot") {
    tarotSection.style.display = "block";
    profileCards.forEach(c => (c.style.display = "none"));
  } else {
    tarotSection.style.display = "none";
    profileCards.forEach(c => (c.style.display = "block"));
  }
}

function initTabs() {
  const navButtons = document.querySelectorAll(".bottom-nav .nav-btn");
  navButtons.forEach(btn => {
    const tab = btn.getAttribute("data-tab");
    if (!tab) return;
    btn.addEventListener("click", () => switchTab(tab));
  });
}

function initTarotControls() {
  const cardsButtons = document.querySelectorAll("[data-cards]");
  cardsButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tarotState.cards = parseInt(btn.getAttribute("data-cards"), 10);
      cardsButtons.forEach(b => b.classList.remove("pill-btn-active"));
      btn.classList.add("pill-btn-active");
    });
  });

  const deckButtons = document.querySelectorAll("[data-deck]");
  deckButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tarotState.deck = btn.getAttribute("data-deck");
      deckButtons.forEach(b => b.classList.remove("pill-btn-active"));
      btn.classList.add("pill-btn-active");
    });
  });

  const askBtn = document.getElementById("tarot-ask-btn");
  askBtn.addEventListener("click", () => {
    if (!tg) {
      alert("Эта кнопка работает только внутри Telegram Mini App");
      return;
    }

    const payload = {
      type: "tarot_setup",
      cards: tarotState.cards,
      deck: tarotState.deck,
    };

    console.log("SEND DATA:", payload); // один лог
    tg.sendData(JSON.stringify(payload)); // один sendData
    tg.close();
  });
}


