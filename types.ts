export type UserRole = 'citizen' | 'candidate' | 'mp' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'unverified';

export interface User {
  id: string;
  phone_number: string;
  role: UserRole;
  constituency_id?: string;
  is_verified: boolean;
  verification_status: VerificationStatus;
  full_name?: string;
  province?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  id_image_url?: string;
}

export interface Constituency {
  id: string;
  name: string;
  province: string;
  district: string;
  mp_image?: string;
  mp_name?: string;
}

export interface Candidate {
  id: string;
  user_id: string;
  name: string;
  constituency_id: string;
  proposals: string[];
  qualification: string;
  background: string;
  vote_count: number;
}

export interface Issue {
  id: string;
  constituency_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  upvotes: number;
  created_by: string; // phone number or user id masked
  created_at: string;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  phone_number: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  id_image_url: string;
  submitted_at: string;
}

export interface AddressOption {
  value: string;
  label: string;
}