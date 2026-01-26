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
      // визуальный диапазон шкалы (по умолчанию = min_xp/max_xp)
      bar_min: 0,
      bar_max: 100,
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
      bar_min: 100,
      bar_max: 300,
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
      // здесь как ты хотел: прогресс считаем от 300 до 700
      bar_min: 300,
      bar_max: 700,
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
      bar_min: 700,
      bar_max: 1200,
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
      bar_min: 1200,
      bar_max: 2000,
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
      bar_min: 2000,
      bar_max: 3000,
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
      // для последнего можно считать от 3000 до фактического xp
      bar_min: 3000,
      bar_max: 4000, // просто заглушка, можно потом подправить
    },
  ];

  // временные данные профиля (потом заменишь на реальные)
  let profileStatus = {
    xp: 500,
    status_code: "initiated", // Посвящённая
  };

  function findLevelByCode(code) {
    return STATUS_LEVELS.find(l => l.code === code);
  }

  function getNextLevel(curLevel) {
    if (!curLevel) return null;
    return STATUS_LEVELS.find(l => l.level === curLevel.level + 1) || null;
  }

  // НОРМАЛИЗАЦИЯ ДЛЯ ШКАЛЫ
  function computeBarPercent(xp, level) {
    const min = level.bar_min ?? level.min_xp;
    // если bar_max не задан и max_xp нет (последний уровень) — берём текущий xp + 1, чтобы не делить на 0
    const max = level.bar_max ?? level.max_xp ?? (xp + 1);

    let inside = xp - min;
    if (inside < 0) inside = 0;

    let span = max - min;
    if (span <= 0) span = 1;

    const percent = Math.round((inside / span) * 100);
    return Math.max(0, Math.min(100, percent));
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

    // процент для шкалы по визуальному диапазону bar_min/bar_max
    const percent = computeBarPercent(profileStatus.xp, cur);

    if (currentLine) {
      currentLine.textContent = `Сейчас: ${cur.name} · ${profileStatus.xp} очков`;
    }

    const summaryStatus = document.getElementById('summary-status');
    if (summaryStatus) {
      const iconEl = summaryStatus.querySelector('.summary-status-icon');
      const nameEl = summaryStatus.querySelector('.summary-status-name');

      if (iconEl) {
        iconEl.src = cur.icon;
      }
      if (nameEl) {
        nameEl.textContent = cur.name;
        nameEl.style.background = `linear-gradient(135deg, ${cur.color_from}, ${cur.color_to})`;
        nameEl.style.webkitBackgroundClip = 'text';
        nameEl.style.backgroundClip = 'text';
        nameEl.style.color = 'transparent';
      }
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
