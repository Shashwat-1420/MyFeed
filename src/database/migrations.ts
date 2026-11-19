import type { SQLiteDatabase } from 'expo-sqlite';
import { INITIAL_SCHEMA } from './schema';

interface Migration {
    version: number;
    sql: string;
}

const MIGRATIONS: Migration[] = [
    {
        version: 1,
        sql: INITIAL_SCHEMA,
    },
];

export async function runMigrations(
    db: SQLiteDatabase
): Promise<void> {
    const result = await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
    );

    let currentVersion = result?.user_version ?? 0;

    for (const migration of MIGRATIONS) {
        if (migration.version <= currentVersion) {
            continue;
        }

        await db.withTransactionAsync(async () => {
            await db.execAsync(migration.sql);
            await db.execAsync(
                `PRAGMA user_version = ${migration.version}`
            );
        });

        currentVersion = migration.version;
    }
}