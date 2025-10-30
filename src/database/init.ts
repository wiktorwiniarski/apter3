import { executeQuery } from './client';

export async function initializeDatabase() {
  try {
    // Create entities table for flexible entity storage
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS entities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_type TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index for better query performance
    await executeQuery(`
      CREATE INDEX IF NOT EXISTS idx_entity_type ON entities(entity_type)
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}
