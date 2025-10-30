import { executeQuery } from '../database/client';

export interface EntityConfig {
  name: string;
  entityType?: string;
  orderBy?: string;
  properties: Record<string, any>;
  required?: string[];
}

export async function createEntity<T extends Record<string, any>>(
  config: EntityConfig,
  data: T
): Promise<T & { id: number; created_at: string; updated_at: string }> {
  const entityType = config.entityType || config.name;
  const now = new Date().toISOString();

  const entity = {
    ...data,
    id: undefined,
    created_at: now,
    updated_at: now,
  };

  const result = await executeQuery(
    `INSERT INTO entities (entity_type, data) VALUES (?, ?)`,
    [entityType, JSON.stringify(entity)]
  );

  return {
    ...entity,
    id: Number(result.lastInsertRowid),
    created_at: now,
    updated_at: now,
  } as T & { id: number; created_at: string; updated_at: string };
}

export async function getEntities<T extends Record<string, any>>(
  config: EntityConfig
): Promise<(T & { id: number; created_at: string; updated_at: string })[]> {
  const entityType = config.entityType || config.name;
  const orderBy = config.orderBy || 'id DESC';

  const result = await executeQuery(
    `SELECT id, data, created_at, updated_at FROM entities WHERE entity_type = ? ORDER BY ${orderBy}`,
    [entityType]
  );

  return (result.rows || []).map((row: any) => {
    const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    return {
      ...data,
      id: row.id,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  });
}

export async function getEntityById<T extends Record<string, any>>(
  config: EntityConfig,
  id: number
): Promise<(T & { id: number; created_at: string; updated_at: string }) | null> {
  const entityType = config.entityType || config.name;

  const result = await executeQuery(
    `SELECT id, data, created_at, updated_at FROM entities WHERE entity_type = ? AND id = ?`,
    [entityType, id]
  );

  if (!result.rows || result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0] as any;
  const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;

  return {
    ...data,
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function updateEntity<T extends Record<string, any>>(
  config: EntityConfig,
  id: number,
  updates: Partial<T>
): Promise<T & { id: number; created_at: string; updated_at: string }> {
  const entityType = config.entityType || config.name;
  const now = new Date().toISOString();

  // Get current entity
  const current = await getEntityById(config, id);
  if (!current) {
    throw new Error(`Entity not found: ${id}`);
  }

  // Merge updates
  const updated = {
    ...current,
    ...updates,
    id: current.id,
    created_at: current.created_at,
    updated_at: now,
  };

  await executeQuery(
    `UPDATE entities SET data = ?, updated_at = ? WHERE entity_type = ? AND id = ?`,
    [JSON.stringify(updated), now, entityType, id]
  );

  return updated as T & { id: number; created_at: string; updated_at: string };
}

export async function deleteEntity(config: EntityConfig, id: number): Promise<void> {
  const entityType = config.entityType || config.name;

  await executeQuery(
    `DELETE FROM entities WHERE entity_type = ? AND id = ?`,
    [entityType, id]
  );
}

export function validateRequired(data: any, required: string[]): string[] {
  const errors: string[] = [];
  for (const field of required) {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  }
  return errors;
}
