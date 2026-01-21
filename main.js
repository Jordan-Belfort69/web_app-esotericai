const API_URL = "http://127.0.0.1:8000/api/me"; // без user_id
const tg = window.Telegram ? window.Telegram.WebApp : null;

document.addEventListener("DOMContentLoaded", () => {
  if (tg) tg.ready();
  loadProfile();
  initTabs();
  initTarotControls();
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
    const url = initData
      ? `${API_URL}?initData=${encodeURIComponent(initData)}`
      : `${API_URL}?user_id=1040828537`;

    const res = await fetch(url);
    const data = await res.json();

    // ... заполнение DOM, как было ...
  } catch (e) {
    console.error("loadProfile error:", e);
    // без alert, чтобы не мешать тесту sendData
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
      type: "debug_click",
      ts: Date.now(),
      note: "кнопка Задать вопрос в боте нажата",
    };

    console.log("SEND DATA:", payload);
    tg.sendData(JSON.stringify(payload));
    tg.close();
  });
} // ← этой скобки не хватало

