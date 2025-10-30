import { useEffect, useState } from 'react';
import { initializeDatabase } from './database/init';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';

function App() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const initDb = async () => {
      try {
        await initializeDatabase();
        setDbReady(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to initialize database';
        setDbError(errorMsg);
        console.error('Database initialization error:', err);
      }
    };

    initDb();
  }, []);

  if (dbError) {
    return (
      <div className="min-h-screen bg-red-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Database Connection Error</h2>
            <p className="mb-4">{dbError}</p>
            <p className="text-sm text-red-600">
              Make sure your Turso database credentials are properly configured in your environment variables.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!dbReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-700 text-lg font-medium">Initializing database...</p>
          <p className="text-gray-600 text-sm mt-2">Please wait while we set up your tenant management system</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Dashboard />
    </div>
  );
}

export default App;
