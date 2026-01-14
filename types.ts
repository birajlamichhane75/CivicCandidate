
export type UserRole = 'citizen' | 'candidate' | 'mp' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'unverified';
export type CandidateStatus = 'pending' | 'approved' | 'rejected';

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
  force_logout?: boolean;
  email?: string;
}

export interface Constituency {
  id: string;
  name: string;
  province: string;
  district: string;
  mp_image?: string;
  mp_name?: string;
}

export interface Proposal {
  title: string;
  description: string;
}

export interface Candidate {
  id: string;
  user_id: string;
  name: string;
  constituency_id: string;
  proposals: Proposal[];
  qualification: string;
  background: string;
  vote_count: number;
  status: CandidateStatus;
  election_commission_filed: boolean;
  party_affiliation: string;
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
