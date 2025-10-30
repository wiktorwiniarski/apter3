import { useState, useEffect, useCallback } from 'react';
import {
  createEntity,
  getEntities,
  getEntityById,
  updateEntity,
  deleteEntity,
  EntityConfig,
  validateRequired,
} from '../repositories/flexibleEntityRepository';

export interface UseEntityResult<T> {
  items: T[];
  loading: boolean;
  error: unknown;
  reload: () => Promise<void>;
  create: (data: T) => Promise<void>;
  update: (id: number, data: Partial<T>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  config: EntityConfig;
}

export function useEntity<T extends Record<string, any>>(
  config: EntityConfig
): UseEntityResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEntities<T>(config);
      setItems(data as T[]);
    } catch (err) {
      setError(err);
      console.error('Error loading entities:', err);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = useCallback(
    async (data: T) => {
      try {
        // Validate required fields
        if (config.required) {
          const errors = validateRequired(data, config.required);
          if (errors.length > 0) {
            throw new Error(errors.join(', '));
          }
        }

        await createEntity(config, data);
        await reload();
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [config, reload]
  );

  const update = useCallback(
    async (id: number, updates: Partial<T>) => {
      try {
        await updateEntity(config, id, updates);
        await reload();
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [config, reload]
  );

  const remove = useCallback(
    async (id: number) => {
      try {
        await deleteEntity(config, id);
        await reload();
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [config, reload]
  );

  return { items, loading, error, reload, create, update, remove, config };
}
