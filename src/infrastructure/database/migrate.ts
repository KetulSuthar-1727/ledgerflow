import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, 'migrations');

async function migrate(): Promise<void> {
  await db.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id SERIAL PRIMARY KEY,
            filename TEXT NOT NULL UNIQUE,
            executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);

  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const result = await db.query(
      `SELECT 1 FROM schema_migrations WHERE filename = $1`,
      [file]
    );

    if (result.rowCount && result.rowCount > 0) {
      continue;
    }

    const filePath = path.join(migrationsDir, file);
    const sql = await readFile(filePath, 'utf8');

    const client = await db.connect();

    try {
      await client.query('BEGIN');

      await client.query(sql);

      await client.query(
        `INSERT INTO schema_migrations (filename) VALUES ($1)`,
        [file]
      );

      await client.query('COMMIT');

      console.log(`Applied migration: ${file}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

try {
  await migrate();
} finally {
  await db.end();
}
