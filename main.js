const API_URL = "http://127.0.0.1:8000/api/me"; // без user_id
const tg = window.Telegram ? window.Telegram.WebApp : null;

document.addEventListener("DOMContentLoaded", () => {
  if (tg) tg.ready();
  loadProfile();
  initTabs();
  initTarotControls();
  initReferralSection();
  initSubsControls();
  initBuySubButton();
  initHistorySection();
  initTasksSection();
  initFeedbackLink();
  initNewsLink();
  initHelpSection();
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
  const profileHeader = document.querySelector('.profile-header');
  const tarotSection = document.getElementById('tarot-section');
  const subsSection = document.getElementById('subs-section');

  const profileBlocks = document.querySelectorAll(
    '#profile-subscription, #profile-limits, #profile-buy-sub, ' +
    '#profile-history-link, #profile-tasks-link, #profile-ref-link, ' +
    '#profile-feedback-link, #profile-news-link, #profile-help-link, ' +
    '#profile-ref, #profile-history, #profile-tasks, #profile-task1-card, ' +
    '#profile-task2-card, #task1-details, #task2-details, ' +
    '#profile-help, #profile-help-contact'
  );

  const navButtons = document.querySelectorAll('.bottom-nav .nav-btn');

  navButtons.forEach(btn => {
    const t = btn.getAttribute('data-tab');
    if (!t) return;
    btn.classList.toggle('nav-btn-active', t === tab);
  });

  if (tab === 'tarot') {
    if (profileHeader) profileHeader.style.display = 'none';
    profileBlocks.forEach(c => (c.style.display = 'none'));

    if (subsSection) subsSection.style.display = 'none';
    if (tarotSection) tarotSection.style.display = 'block';
  } else if (tab === 'subs') {
    if (profileHeader) profileHeader.style.display = 'none';
    profileBlocks.forEach(c => (c.style.display = 'none'));

    if (tarotSection) tarotSection.style.display = 'none';
    if (subsSection) subsSection.style.display = 'block';
  } else {
    // вкладка "Профиль"
    if (profileHeader) profileHeader.style.display = 'flex';
    if (tarotSection) tarotSection.style.display = 'none';
    if (subsSection) subsSection.style.display = 'none';

    document.querySelectorAll(
      '#profile-subscription, #profile-limits, #profile-buy-sub, ' +
      '#profile-history-link, #profile-tasks-link, #profile-ref-link, ' +
      '#profile-feedback-link, #profile-news-link, #profile-help-link'
    ).forEach(c => (c.style.display = 'block'));

    [
      'profile-ref', 'profile-history', 'profile-tasks',
      'profile-task1-card', 'profile-task2-card',
      'task1-details', 'task2-details',
      'profile-help', 'profile-help-contact'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
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
  const tarotSection = document.getElementById('tarot-section');
  const subsSection = document.getElementById('subs-section');
  const helpContactCard = document.getElementById('profile-help-contact');
  const inviteBtn = document.getElementById('ref-invite-btn');
  const profileHeader = document.querySelector('.profile-header'); // ← шапка

  if (!refLinkCard || !refScreen) return;

  refLinkCard.addEventListener('click', () => {
    // прячем шапку
    if (profileHeader) profileHeader.style.display = 'none';

    // прячем ВСЕ карточки профиля и внутренние экраны
    document.querySelectorAll(
      '#profile-subscription, #profile-limits, #profile-buy-sub, ' +
      '#profile-history-link, #profile-tasks-link, #profile-ref-link, ' +
      '#profile-feedback-link, #profile-news-link, #profile-help-link, ' +
      '#profile-history, #profile-tasks, #profile-task1-card, #profile-task2-card, ' +
      '#task1-details, #task2-details, #profile-help, #profile-help-contact'
    ).forEach(c => (c.style.display = 'none'));

    if (tarotSection) tarotSection.style.display = 'none';
    if (subsSection) subsSection.style.display = 'none';

    // показываем только экран рефералок
    refScreen.style.display = 'block';
  });

  if (inviteBtn) {
    inviteBtn.addEventListener('click', () => {
      console.log('Invite friends clicked');
    });
  }
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

function initBuySubButton() {
  const buySubCard = document.getElementById('profile-buy-sub');
  if (!buySubCard) return;

  buySubCard.addEventListener('click', () => {
    // Переключаем нижнее меню на вкладку "Подписка"
    switchTab('subs');
  });
}

function initHistorySection() {
  const historyLink = document.getElementById('profile-history-link');
  const historyScreen = document.getElementById('profile-history');
  const profileCards = document.querySelectorAll(
    '#profile-subscription, #profile-limits, #profile-buy-sub, #profile-ref-link, #profile-ref'
  );
  const tarotSection = document.getElementById('tarot-section');
  const subsSection = document.getElementById('subs-section');

  if (!historyLink || !historyScreen) return;

  historyLink.addEventListener('click', () => {
    // прячем остальные карточки профиля
    profileCards.forEach(c => (c.style.display = 'none'));
    if (tarotSection) tarotSection.style.display = 'none';
    if (subsSection) subsSection.style.display = 'none';

    // показываем историю
    historyScreen.style.display = 'block';
  });

  // Пока «Прочитать полностью» просто показывает alert-заглушку
  const readButtons = historyScreen.querySelectorAll('.history-read-btn');
  readButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Здесь будет полный текст ответа из базы (заглушка).');
    });
  });
}

function initTasksSection() {
  const tasksLink = document.getElementById('profile-tasks-link');
  const tasksHeader = document.getElementById('profile-tasks');
  const task1CardSection = document.getElementById('profile-task1-card');
  const task2CardSection = document.getElementById('profile-task2-card');
  const task1Details = document.getElementById('task1-details');
  const task2Details = document.getElementById('task2-details');

  if (!tasksLink || !tasksHeader) return;

  // Переход в раздел заданий (3 блока)
  tasksLink.addEventListener('click', () => {
    console.log('Tasks clicked');

    document.querySelectorAll(
      '#profile-subscription, #profile-limits, #profile-buy-sub, #profile-history-link, #profile-tasks-link, #profile-ref-link, #profile-ref, #profile-history, #task1-details, #task2-details'
    ).forEach(c => (c.style.display = 'none'));

    tasksHeader.style.display = 'block';
    if (task1CardSection) task1CardSection.style.display = 'block';
    if (task2CardSection) task2CardSection.style.display = 'block';
  });

  // Кнопки "Открыть задание 1/2"
  const taskButtons = document.querySelectorAll('.tasks-open-btn');
  taskButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const taskId = btn.getAttribute('data-task');

      if (tasksHeader) tasksHeader.style.display = 'none';
      if (task1CardSection) task1CardSection.style.display = 'none';
      if (task2CardSection) task2CardSection.style.display = 'none';

      if (taskId === '1' && task1Details) task1Details.style.display = 'block';
      if (taskId === '2' && task2Details) task2Details.style.display = 'block';
    });
  });

  // Заглушки "Забрать награду"
  const claimButtons = document.querySelectorAll('.tasks-claim-btn');
  claimButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const taskId = btn.getAttribute('data-task');
      alert('❌ Условие: Оставить отзыв о работе с проектом не выполнено! (task ' + taskId + ')');
    });
  });
}

function initFeedbackLink() {
  const feedbackCard = document.getElementById('profile-feedback-link');
  if (!feedbackCard) return;

  feedbackCard.addEventListener('click', () => {
    const url = 'https://t.me/reviews_esotericai'; // @reviews_esotericai

    console.log('Feedback clicked, open:', url);

    if (tg && typeof tg.openTelegramLink === 'function') {
      tg.openTelegramLink(url);          // для Telegram-клиента
    } else {
      window.open(url, '_blank');        // для веб-браузера
    }
  });
}

function initNewsLink() {
  const newsCard = document.getElementById('profile-news-link');
  if (!newsCard) return;

  newsCard.addEventListener('click', () => {
    const url = 'https://t.me/news_esotericai'; // замени на ссылку канала

    console.log('News clicked, open:', url);

    if (tg && typeof tg.openTelegramLink === 'function') {
      tg.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  });
}

function initHelpSection() {
  const helpLinkCard = document.getElementById('profile-help-link');
  const helpScreen = document.getElementById('profile-help');
  const helpContactCard = document.getElementById('profile-help-contact');
  const tarotSection = document.getElementById('tarot-section');
  const subsSection = document.getElementById('subs-section');

  if (!helpLinkCard || !helpScreen) return;

  helpLinkCard.addEventListener('click', () => {
    // прячем основные карточки профиля и внутренние экраны
    document.querySelectorAll(
      '#profile-subscription, #profile-limits, #profile-buy-sub, ' +
      '#profile-history-link, #profile-tasks-link, #profile-ref-link, ' +
      '#profile-feedback-link, #profile-news-link, ' +
      '#profile-ref, #profile-history, #profile-tasks, ' +
      '#profile-task1-card, #profile-task2-card, #task1-details, #task2-details, ' +
      '#profile-help-contact'
    ).forEach(c => (c.style.display = 'none'));

    if (tarotSection) tarotSection.style.display = 'none';
    if (subsSection) subsSection.style.display = 'none';

    helpScreen.style.display = 'block';
    if (helpContactCard) helpContactCard.style.display = 'block';
  });

  // открытие статей Telegraph
  const articleButtons = helpScreen.querySelectorAll('.help-link-btn');
  articleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      if (!url) return;

      if (tg && typeof tg.openLink === 'function') {
        tg.openLink(url);
      } else {
        window.open(url, '_blank');
      }
    });
  });

  // кнопка "Написать разработчику"
  const contactBtn = document.getElementById('help-contact-btn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      const url = 'https://t.me/j_belfort69'; // сюда подставь свой @username

      if (tg && typeof tg.openTelegramLink === 'function') {
        tg.openTelegramLink(url);
      } else {
        window.open(url, '_blank');
      }
    });
  }
}

