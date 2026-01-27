// Конфигурация заданий по категориям
window.AppTasksConfig = {
  daily: [
    {
      code: 'D_DAILY',
      title: 'Ежедневный вход',
      desc: 'Зайди в бота хотя бы один раз за день.',
      xp: 2,
      sms: 0,
      promo: null,
      check_type: 'auto',
      status: 'pending',      // пока заглушка
    },
    {
      code: 'D_REQ_DAILY',
      title: 'Ежедневный запрос',
      desc: 'Сделай минимум один запрос боту в течение дня.',
      xp: 3,
      sms: 0,
      promo: null,
      check_type: 'auto',
      status: 'pending',
    },
  ],

  activity: [
    {
      code: 'D_1',
      title: 'Подписка на канал',
      desc: 'Подпишись на новостной канал проекта, чтобы получать обновления и акции.',
      xp: 10,
      sms: 1,
      promo: null,
      check_type: 'auto',
      status: 'pending',
    },
    {
      code: 'D_2',
      title: 'Подписка и отзыв',
      desc: 'Подпишись на наш новостной канал и оставь честный отзыв о проекте.',
      xp: 30,
      sms: 10,
      promo: null,
      check_type: 'manual',
      status: 'pending',
    },
    {
      code: 'D_3',
      title: 'Активность 7 дней',
      desc: 'Будь активна 7 дней подряд: минимум один запрос боту каждый день.',
      xp: 30,
      sms: 5,
      promo: '5%',
      check_type: 'auto',
      status: 'pending',
    },
    {
      code: 'D_4',
      title: 'Активность 14 дней',
      desc: 'Сохраняй активность 14 дней подряд — бот всегда под рукой.',
      xp: 80,
      sms: 15,
      promo: '10%',
      check_type: 'auto',
      status: 'pending',
    },
    {
      code: 'D_5',
      title: 'Активность 30 дней',
      desc: '30 дней с практикой и подсказками от бота — мягкое, но устойчивое движение вперёд.',
      xp: 150,
      sms: 30,
      promo: '15%',
      check_type: 'auto',
      status: 'pending',
    },
  ],

  referral: [],
  usage: [],
  purchases: [],
  levels: [],
};

