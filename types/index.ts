export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  message: string;
  images: string[];
  equipment?: Array<{
    category: 'hooks' | 'lures' | 'lines' | 'weights' | 'floats' | 'other';
    quantity: 'few' | 'many' | 'lots' | 'huge_haul' | '1-5m' | '5-10m' | '10-20m' | '20m+';
    description?: string;
    adminAdjustedCount?: number;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  approvedAt?: Date;
}

export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
} 