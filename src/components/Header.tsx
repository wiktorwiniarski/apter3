export function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white text-blue-600 rounded-lg p-2 font-bold text-xl w-10 h-10 flex items-center justify-center">
              LF
            </div>
            <h1 className="text-3xl font-bold">Leaseflow</h1>
          </div>
          <p className="text-blue-100">Tenant Management System</p>
        </div>
      </div>
    </header>
  );
}
