// ===== МОДУЛЬ: СТАТУС И ПРОГРЕСС =====

window.StatusUI = (() => {
  // Лестница уровней (пока жестко на фронте)
  const STATUS_LEVELS = [
    {
      level: 1,
      code: "spark",
      name: "Искра",
      min_xp: 0,
      max_xp: 99,
      color_from: "#4b5563",
      color_to: "#6b7280",
      icon: "img/status/spark.png",
    },
    {
      level: 2,
      code: "seeker",
      name: "Ищущая",
      min_xp: 100,
      max_xp: 299,
      color_from: "#4f46e5",
      color_to: "#6366f1",
      icon: "img/status/seeker.png",
    },
    {
      level: 3,
      code: "initiated",
      name: "Посвящённая",
      min_xp: 300,
      max_xp: 699,
      color_from: "#7c3aed",
      color_to: "#8b5cf6",
      icon: "img/status/initiated.png",
    },
    {
      level: 4,
      code: "keeper",
      name: "Хранительница карт",
      min_xp: 700,
      max_xp: 1199,
      color_from: "#a855f7",  // более розовый
      color_to: "#ec4899",    // уходит в малиновый
      icon: "img/status/keeper.png",
    },
    {
      level: 5,
      code: "moon_priestess",
      name: "Лунная Жрица",
      min_xp: 1200,
      max_xp: 1999,
      color_from: "#22c1c3",
      color_to: "#0ea5e9",
      icon: "img/status/moon_priestess.png",
    },
    {
      level: 6,
      code: "circle_leader",
      name: "Ведущая кругов",
      min_xp: 2000,
      max_xp: 2999,
      color_from: "#ec4899",
      color_to: "#f97316",
      icon: "img/status/circle_leader.png",
    },
    {
      level: 7,
      code: "high_mystery",
      name: "Верховная Мистерия",
      min_xp: 3000,
      max_xp: null,
      color_from: "#eab308",
      color_to: "#fbbf24",
      icon: "img/status/high_mystery.png",
    },
  ];

  // временные данные профиля (потом заменишь на реальные)
  let profileStatus = {
    xp: 350,
    status_code: "initiated", // Посвящённая
  };

  function findLevelByCode(code) {
    return STATUS_LEVELS.find(l => l.code === code);
  }

  function getNextLevel(curLevel) {
    if (!curLevel) return null;
    return STATUS_LEVELS.find(l => l.level === curLevel.level + 1) || null;
  }

  function updateFromProfile(profile) {
    if (profile) {
      profileStatus = {
        xp: profile.xp,
        status_code: profile.status_code,
      };
    }

    const cur = findLevelByCode(profileStatus.status_code) || STATUS_LEVELS[0];
    const next = getNextLevel(cur);

    const heroIcon = document.getElementById("status-hero-icon");
    const heroTitle = document.getElementById("status-hero-title");
    const currentLine = document.getElementById("status-current-line");
    const progressFill = document.getElementById("status-progress-fill");
    const progressText = document.getElementById("status-progress-text");

    if (heroIcon) {
      heroIcon.src = cur.icon;
    }
    if (heroTitle) {
      heroTitle.textContent = cur.name;
    }

    // прогресс в рамках уровня
    let xpInLevel = profileStatus.xp - cur.min_xp;
    if (xpInLevel < 0) xpInLevel = 0;

    // без +1, чистый диапазон
    let xpRange = (cur.max_xp !== null ? cur.max_xp : profileStatus.xp) - cur.min_xp;
    if (xpRange <= 0) xpRange = 1;

    const percent = Math.max(
      0,
      Math.min(100, Math.round((xpInLevel / xpRange) * 100))
    );

    if (currentLine) {
      currentLine.textContent = `Сейчас: ${cur.name} · ${profileStatus.xp} очков`;
    }
    if (progressFill) {
      progressFill.style.width = `${percent}%`;
      progressFill.style.background = `linear-gradient(135deg, ${cur.color_from}, ${cur.color_to})`;
    }
    if (progressText) {
      if (next) {
        const xpToNext = Math.max(0, next.min_xp - profileStatus.xp);
        progressText.textContent = `Осталось ${xpToNext} очков до уровня «${next.name}».`;
      } else {
        progressText.textContent = `Ты достигла максимального уровня.`;
      }
    }

    renderLevelsList(cur, next);
  }

  function renderLevelsList(cur, next) {
    const list = document.getElementById("status-levels-list");
    if (!list) return;

    list.innerHTML = "";

    STATUS_LEVELS.forEach(level => {
      const div = document.createElement("div");
      div.className = "status-badge";

      // подсветка текущего / следующего
      if (level.code === cur.code) {
        div.classList.add("status-badge-current");
      } else if (next && level.code === next.code) {
        div.classList.add("status-badge-next");
      } else if (level.level > cur.level) {
        div.classList.add("status-badge-locked");
      }

      div.style.background = `linear-gradient(135deg, ${level.color_from}, ${level.color_to})`;

      const icon = document.createElement("img");
      icon.className = "status-badge-icon";
      icon.src = level.icon;
      icon.alt = level.name;

      const textWrap = document.createElement("div");
      textWrap.className = "status-badge-text";
      textWrap.textContent = level.name;

      const meta = document.createElement("div");
      meta.className = "status-badge-meta";
      const rangeText = level.max_xp
        ? `${level.min_xp}–${level.max_xp} очков`
        : `${level.min_xp}+ очков`;
      meta.textContent = rangeText;

      const right = document.createElement("div");
      right.style.fontSize = "11px";
      right.style.marginLeft = "8px";

      if (level.code === cur.code) {
        right.textContent = "Текущий уровень";
      } else if (next && level.code === next.code) {
        right.textContent = "Следующий";
      }

      div.appendChild(icon);
      div.appendChild(textWrap);
      div.appendChild(meta);
      div.appendChild(right);

      list.appendChild(div);
    });
  }

  function initStatusScreen() {
    // кнопка на главном экране
    const link = document.getElementById("profile-status-link");
    if (link) {
      link.addEventListener("click", () => {
        AppRouter.go("status");
      });
    }

    // начальный рендер с мок-данными
    updateFromProfile(null);
  }

  return {
    initStatusScreen,
    updateFromProfile,
  };
})();
