import { useState, useEffect } from 'react';
import { useEntity } from '../hooks/useEntity';
import { tenantEntityConfig, type Tenant } from '../entities';
import { TenantForm } from './TenantForm';
import { TenantList } from './TenantList';

export function Dashboard() {
  const { items: tenants, loading, error, create, update, remove } = useEntity<Tenant>(tenantEntityConfig);
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddClick = () => {
    setEditingTenant(null);
    setShowForm(true);
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsSubmitting(true);
      if (editingTenant) {
        await update(editingTenant.id, data);
      } else {
        await create(data as Tenant);
      }
      setShowForm(false);
      setEditingTenant(null);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await remove(id);
    } catch (err) {
      console.error('Error deleting tenant:', err);
      alert(`Error deleting tenant: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTenant(null);
  };

  // Calculate stats
  const activeTenants = tenants.filter(t => t.status === 'active').length;
  const totalRent = tenants
    .filter(t => t.status === 'active')
    .reduce((sum, t) => sum + t.rentAmount, 0);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700 font-medium">Error loading data:</p>
          <p className="text-red-600 text-sm mt-2">{String(error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Tenants</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{tenants.length}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M11 10h.01M7 10h.01M6 20h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Tenants</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{activeTenants}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Monthly Rent</p>
                <p className="text-3xl font-bold text-green-600 mt-2">${totalRent.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {showForm ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
            </h2>
            <TenantForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              initialData={editingTenant || undefined}
              isLoading={isSubmitting}
            />
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Tenants</h2>
              <button
                onClick={handleAddClick}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Tenant
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-gray-500 text-lg mt-4">Loading tenants...</p>
              </div>
            ) : (
              <TenantList
                tenants={tenants}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isSubmitting}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
