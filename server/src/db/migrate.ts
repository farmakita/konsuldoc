import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './index.js';
import path from 'path';

migrate(db, {
  migrationsFolder: path.join(__dirname, '../../../src/db/migrations'),
});

console.log('Migrations complete.');
process.exit(0);
