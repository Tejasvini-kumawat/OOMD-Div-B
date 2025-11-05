import { NGO, Donation } from '@/types';

export const mockNGOs: NGO[] = [
  {
    id: '1',
    name: 'Hope Foundation',
    description: 'Supporting underprivileged children with education and healthcare',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop',
    location: 'Mumbai, India',
  },
  {
    id: '2',
    name: 'Green Earth Initiative',
    description: 'Environmental conservation and sustainable development programs',
    category: 'Environment',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop',
    location: 'Bangalore, India',
  },
  {
    id: '3',
    name: 'Food for All',
    description: 'Fighting hunger by providing meals to those in need',
    category: 'Food Security',
    image: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=400&h=300&fit=crop',
    location: 'Delhi, India',
  },
  {
    id: '4',
    name: 'Shelter Now',
    description: 'Building homes and providing shelter for homeless families',
    category: 'Housing',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop',
    location: 'Chennai, India',
  },
];

export let mockDonations: Donation[] = [
  {
    id: '1',
    userId: 'user@demo.com',
    userName: 'John Doe',
    userAddress: '123 Main St, Mumbai',
    ngoId: '1',
    ngoName: 'Hope Foundation',
    itemName: 'Books and Stationery',
    description: '50 notebooks, 30 textbooks, pens and pencils',
    status: 'pending',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: '2',
    userId: 'user@demo.com',
    userName: 'John Doe',
    userAddress: '123 Main St, Mumbai',
    ngoId: '2',
    ngoName: 'Green Earth Initiative',
    itemName: 'Gardening Equipment',
    description: 'Shovels, rakes, seeds, and planting materials',
    status: 'approved',
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2025-01-02'),
  },
];

export function addDonation(donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>) {
  const newDonation: Donation = {
    ...donation,
    id: String(mockDonations.length + 1),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockDonations.push(newDonation);
  return newDonation;
}

export function updateDonationStatus(id: string, status: 'approved' | 'rejected') {
  const donation = mockDonations.find(d => d.id === id);
  if (donation) {
    donation.status = status;
    donation.updatedAt = new Date();
  }
}
