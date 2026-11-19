import * as SQLite from 'expo-sqlite';
import type { SQLiteDatabase } from 'expo-sqlite';
import { runMigrations } from './migrations';

const DATABASE_NAME = 'myfeed.db';

let database: SQLiteDatabase | null = null;
let initializationPromise: Promise<SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLiteDatabase> {
    if (database) {
        return database;
    }

    if (!initializationPromise) {
        initializationPromise = (async () => {
            const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

            await db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;
      `);

            await runMigrations(db);

            database = db;
            return db;
        })().catch((error: unknown) => {
            initializationPromise = null;
            throw error;
        });
    }

    return initializationPromise;
}