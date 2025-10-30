import { createClient } from '@libsql/client';

const dbUrl = import.meta.env.VITE_TURSO_DATABASE_URL || '';
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN || '';

let client: ReturnType<typeof createClient> | null = null;

export function getClient() {
  if (!client) {
    if (!dbUrl) {
      console.error('VITE_TURSO_DATABASE_URL not set');
      return null;
    }
    client = createClient({
      url: dbUrl,
      authToken,
    });
  }
  return client;
}

export async function executeQuery(sql: string, params?: unknown[]) {
  const cl = getClient();
  if (!cl) throw new Error('Database client not available');
  return cl.execute({ sql, args: params || [] });
}
