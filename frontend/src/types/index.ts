export interface NGO {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  location: string;
  _id?: string;
  logoUrl?: string;
  acceptedItems?: string[];
  isConfigured?: boolean;
}

export interface Donation {
  id: string;
  userId: string;
  userName: string;
  userAddress: string;
  ngoId: string;
  ngoName: string;
  itemName: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
