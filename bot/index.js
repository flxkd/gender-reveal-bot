require('dotenv').config();
const { Telegraf } = require('telegraf');
const { Client } = require('pg');

const bot = new Telegraf(process.env.BOT_TOKEN);
const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // нужно для Render
    }
  });
db.connect();

bot.start(async (ctx) => {
  await ctx.reply('👶 Привет! Хочешь устроить gender reveal? Нажми: /create');
});

bot.command('create', async (ctx) => {
  const telegramId = ctx.from.id;
  const eventName = 'Baby Reveal'; // Заменим на ввод позже
  const revealTime = new Date(Date.now() + 60 * 60 * 1000); // +1 час
  const gender = 'girl'; // Тоже заменим на ввод

  const result = await db.query(
    `INSERT INTO parties (telegram_user_id, event_name, gender, reveal_time)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [telegramId, eventName, gender, revealTime]
  );

  const partyId = result.rows[0].id;
  const link = `https://your-ar-frontend.com/ar/${partyId}`;

  await ctx.reply(`🎉 Событие создано!\nСсылка: ${link}`);
});

bot.launch();
