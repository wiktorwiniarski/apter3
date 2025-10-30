import type { Tenant } from '../entities';

interface TenantListProps {
  tenants: Tenant[];
  onEdit: (tenant: Tenant) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-800' },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-800' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
};

export function TenantList({ tenants, onEdit, onDelete, isLoading = false }: TenantListProps) {
  if (tenants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M11 10h.01M7 10h.01M6 20h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-500 text-lg">No tenants found</p>
        <p className="text-gray-400 text-sm mt-2">Add your first tenant to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Unit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Move-in</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tenants.map(tenant => (
              <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {tenant.firstName} {tenant.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{tenant.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{tenant.propertyUnit}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${tenant.rentAmount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    statusColors[tenant.status]?.bg || 'bg-gray-100'
                  } ${statusColors[tenant.status]?.text || 'text-gray-800'}`}>
                    {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {tenant.moveInDate ? new Date(tenant.moveInDate).toLocaleDateString() : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onEdit(tenant)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4 transition-colors"
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${tenant.firstName} ${tenant.lastName}?`)) {
                        onDelete(tenant.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
