export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  message: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  approvedAt?: Date;
}

export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
} 