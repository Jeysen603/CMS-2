export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateAdded: string;
  status: 'active' | 'inactive';
}