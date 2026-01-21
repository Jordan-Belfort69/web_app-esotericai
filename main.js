const API_URL = "http://127.0.0.1:8000/api/me"; // без user_id
const tg = window.Telegram ? window.Telegram.WebApp : null;

document.addEventListener("DOMContentLoaded", () => {
  if (tg) tg.ready();
  loadProfile();
  initTabs();
  initTarotControls();
  initReferralSection();
  initSubsControls();
  createSubsFloatingButtons();
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
  const tarotSection = document.getElementById('tarot-section');
  const subsSection = document.getElementById('subs-section');
  const profileBlocks = document.querySelectorAll(
    '#profile-subscription, #profile-limits, #profile-ref-link, #profile-ref'
  );
  const navButtons = document.querySelectorAll('.bottom-nav .nav-btn');
  const bottomNav = document.querySelector('.bottom-nav');
  const subsButtons = document.getElementById('subs-floating-buttons');

  navButtons.forEach(btn => {
    const t = btn.getAttribute('data-tab');
    if (!t) return;
    btn.classList.toggle('nav-btn-active', t === tab);
  });

  if (tab === 'tarot') {
    if (tarotSection) tarotSection.style.display = 'block';
    if (subsSection) subsSection.style.display = 'none';
    profileBlocks.forEach(c => (c.style.display = 'none'));
    if (bottomNav) bottomNav.style.display = 'flex';
    if (subsButtons) subsButtons.style.display = 'none';
  } else if (tab === 'subs') {
    if (subsSection) subsSection.style.display = 'block';
    if (tarotSection) tarotSection.style.display = 'none';
    profileBlocks.forEach(c => (c.style.display = 'none'));
    if (bottomNav) bottomNav.style.display = 'none';
    if (subsButtons) subsButtons.style.display = 'flex';
  } else {
    // профиль
    if (tarotSection) tarotSection.style.display = 'none';
    if (subsSection) subsSection.style.display = 'none';
    profileBlocks.forEach(c => (c.style.display = 'block'));
    if (bottomNav) bottomNav.style.display = 'flex';
    if (subsButtons) subsButtons.style.display = 'none';
    // реф-экран можно дополнительно скрыть, если нужно
    const refScreen = document.getElementById('profile-ref');
    if (refScreen) refScreen.style.display = 'none';
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

function initReferralSection() {
  const refLinkCard = document.getElementById('profile-ref-link');
  const refScreen = document.getElementById('profile-ref');
  const profileCards = document.querySelectorAll(
    '#profile-subscription, #profile-limits, #profile-ref-link'
  );
  const tarotSection = document.getElementById('tarot-section');
  const bottomNav = document.querySelector('.bottom-nav');

  if (!refLinkCard || !refScreen || !bottomNav) return;

  // создаём кнопку "Пригласить друзей"
  const inviteBtn = document.createElement('button');
  inviteBtn.className = 'primary-btn';
  inviteBtn.id = 'ref-invite-btn';
  inviteBtn.textContent = 'Пригласить друзей';
  inviteBtn.style.position = 'fixed';
  inviteBtn.style.left = '50%';
  inviteBtn.style.transform = 'translateX(-50%)';
  inviteBtn.style.bottom = '16px';
  inviteBtn.style.width = 'calc(100% - 32px)';
  inviteBtn.style.maxWidth = '480px';


  inviteBtn.addEventListener('click', () => {
    // TODO: сюда подвяжешь бекенд, который откроет sendMessage / deeplink
    console.log('Invite friends clicked');
  });

  refLinkCard.addEventListener('click', () => {
    // скрываем профильные карточки и Таро
    profileCards.forEach(c => (c.style.display = 'none'));
    if (tarotSection) tarotSection.style.display = 'none';

    // показываем реферальный экран
    refScreen.style.display = 'block';

    // прячем нижнее меню, показываем кнопку
    bottomNav.style.display = 'none';
    document.body.appendChild(inviteBtn);
  });
}

function initSubsControls() {
  const proBtn = document.getElementById('subs-btn-pro');
  const mysticBtn = document.getElementById('subs-btn-mystic');

  if (proBtn) {
    proBtn.addEventListener('click', () => {
      console.log('PRO clicked');
      // TODO: здесь потом вызовешь бекенд/оплату
    });
  }

  if (mysticBtn) {
    mysticBtn.addEventListener('click', () => {
      console.log('Mystic clicked');
    });
  }
}

function createSubsFloatingButtons() {
  const container = document.createElement('div');
  container.className = 'subs-floating-buttons';
  container.id = 'subs-floating-buttons';

  const proBtn = document.createElement('button');
  proBtn.className = 'subs-btn subs-btn-pro';
  proBtn.textContent = '🌙 PRO';

  const mysticBtn = document.createElement('button');
  mysticBtn.className = 'subs-btn subs-btn-mystic';
  mysticBtn.textContent = '🔮 Mystic';

  proBtn.addEventListener('click', () => {
    console.log('PRO clicked');
  });

  mysticBtn.addEventListener('click', () => {
    console.log('Mystic clicked');
  });

  container.appendChild(proBtn);
  container.appendChild(mysticBtn);

  document.body.appendChild(container);
}

