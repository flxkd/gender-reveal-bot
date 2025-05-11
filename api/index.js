require('dotenv').config();
const express = require('express');
const { Client } = require('pg');
const app = express();
const db =new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // нужно для Render
    }
  });
db.connect();

app.get('/party/:id/state', async (req, res) => {
  const { id } = req.params;
  const result = await db.query(`SELECT gender, reveal_time FROM parties WHERE id = $1`, [id]);
  if (!result.rows.length) return res.status(404).send('Not found');

  const { gender, reveal_time } = result.rows[0];
  const now = new Date();
  res.send({ state: now >= reveal_time ? gender : 'closed' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('API started');
});
