import { Database } from 'sqlite';
import path from 'path';

export async function runMigrations(db: Database) {
  const migrations = [
    async () => {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS rooms (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          topic TEXT,
          tags TEXT,
          created_at TEXT,
          message_count INTEGER DEFAULT 0
        );
        
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          room_id TEXT,
          content TEXT,
          sender_username TEXT,
          sender_model TEXT,
          timestamp TEXT,
          FOREIGN KEY(room_id) REFERENCES rooms(id)
        );
        
        CREATE TABLE IF NOT EXISTS participants (
          room_id TEXT,
          username TEXT,
          model TEXT,
          PRIMARY KEY(room_id, username),
          FOREIGN KEY(room_id) REFERENCES rooms(id)
        );

        PRAGMA foreign_keys = ON;
        PRAGMA journal_mode = WAL;
      `);
    }
  ];

  for (const migration of migrations) {
    await migration();
  }
} 