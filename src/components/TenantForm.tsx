import { useState } from 'react';
import type { Tenant } from '../entities';

interface TenantFormProps {
  onSubmit: (data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Tenant;
  isLoading?: boolean;
}

export function TenantForm({ onSubmit, onCancel, initialData, isLoading = false }: TenantFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    propertyUnit: initialData?.propertyUnit || '',
    moveInDate: initialData?.moveInDate || '',
    moveOutDate: initialData?.moveOutDate || '',
    rentAmount: initialData?.rentAmount || '',
    status: initialData?.status || 'active' as const,
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.propertyUnit.trim()) newErrors.propertyUnit = 'Property/Unit is required';
    if (!formData.rentAmount) newErrors.rentAmount = 'Rent amount is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await onSubmit({
        ...formData,
        rentAmount: Number(formData.rentAmount),
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        propertyUnit: '',
        moveInDate: '',
        moveOutDate: '',
        rentAmount: '',
        status: 'active',
        notes: '',
      });
      setErrors({});
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property/Unit *</label>
          <input
            type="text"
            name="propertyUnit"
            value={formData.propertyUnit}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.propertyUnit ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
            placeholder="e.g., 101, 2B, Unit A"
          />
          {errors.propertyUnit && <p className="text-red-500 text-sm mt-1">{errors.propertyUnit}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rent Amount (Monthly) *</label>
          <input
            type="number"
            name="rentAmount"
            value={formData.rentAmount}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.rentAmount ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
            step="0.01"
            min="0"
          />
          {errors.rentAmount && <p className="text-red-500 text-sm mt-1">{errors.rentAmount}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Move-in Date</label>
          <input
            type="date"
            name="moveInDate"
            value={formData.moveInDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Move-out Date</label>
          <input
            type="date"
            name="moveOutDate"
            value={formData.moveOutDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          disabled={isLoading}
          placeholder="Add any additional notes or special instructions..."
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Tenant' : 'Add Tenant'}
        </button>
      </div>
    </form>
  );
}
