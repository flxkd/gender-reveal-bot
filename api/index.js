const express = require('express');
require('dotenv').config();
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

db.connect().then(() => console.log('✅ Подключение к БД успешно'));

app.get('/party/:id/state', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT gender, reveal_time FROM parties WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Party not found' });
    }

    const { gender, reveal_time } = result.rows[0];
    const now = new Date();
    res.json({
      state: now >= new Date(reveal_time) ? gender : 'closed'
    });
  } catch (err) {
    console.error('Ошибка при получении состояния вечеринки:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`🌐 API запущено на http://localhost:${port}`);
});