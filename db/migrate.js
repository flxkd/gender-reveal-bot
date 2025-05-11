// db/migrate.js
require('dotenv').config();
const { Client } = require('pg');

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    await db.connect();
    await db.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS parties (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        telegram_user_id BIGINT NOT NULL,
        event_name TEXT NOT NULL,
        gender TEXT CHECK (gender IN ('boy', 'girl')),
        reveal_time TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Таблица создана');
    await db.end();
  } catch (err) {
    console.error('❌ Ошибка миграции:', err);
  }
})();
