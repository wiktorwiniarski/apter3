import type { EntityConfig } from '../hooks/useEntity';

export const tenantEntityConfig: EntityConfig = {
  name: 'Tenant',
  orderBy: 'created_at DESC',
  properties: {
    firstName: { type: 'string', description: 'Tenant first name' },
    lastName: { type: 'string', description: 'Tenant last name' },
    email: { type: 'string', description: 'Tenant email address' },
    phone: { type: 'string', description: 'Tenant phone number' },
    propertyUnit: { type: 'string', description: 'Property/Unit number' },
    moveInDate: { type: 'string', description: 'Move-in date' },
    moveOutDate: { type: 'string', description: 'Move-out date (if vacant)' },
    rentAmount: { type: 'number', description: 'Monthly rent amount' },
    status: {
      type: 'string',
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
      description: 'Tenant status',
    },
    notes: { type: 'string', description: 'Additional notes' },
  },
  required: ['firstName', 'lastName', 'email', 'propertyUnit', 'rentAmount'],
};

export type Tenant = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyUnit: string;
  moveInDate: string;
  moveOutDate: string;
  rentAmount: number;
  status: 'active' | 'inactive' | 'pending';
  notes: string;
  created_at: string;
  updated_at: string;
};
