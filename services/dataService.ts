import { supabase } from './supabaseClient';
import { Constituency, Candidate, Issue, VerificationRequest, User } from '../types';
import { MOCK_CONSTITUENCIES } from '../constants';

// --- Constituencies ---
export const getConstituencies = async (): Promise<Constituency[]> => {
  const { data, error } = await supabase
    .from('constituencies')
    .select('*');
  
  if (error) {
    console.error('Error fetching constituencies:', error);
    return MOCK_CONSTITUENCIES; // Fallback only if DB fails
  }
  return data || [];
};

export const getConstituencyById = async (id: string): Promise<Constituency | undefined> => {
  const { data, error } = await supabase
    .from('constituencies')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) return undefined;
  return data;
};

export const detectConstituency = async (province: string, district: string, municipality: string, ward: string): Promise<string> => {
  // Logic remains client-side deterministic for this demo as we don't have a complex GIS backend
  if (district === 'Kathmandu') return 'ktm-1';
  if (district === 'Lalitpur') return 'lal-1';
  if (district === 'Kaski') return 'kas-1';
  if (district === 'Rupandehi') return 'rup-1';
  return 'ktm-1';
};

// --- Candidates ---
export const getCandidates = async (constituencyId: string): Promise<Candidate[]> => {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('constituency_id', constituencyId)
    .order('vote_count', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const voteForCandidate = async (candidateId: string, voterPhone: string): Promise<boolean> => {
  // Check if already voted
  const { data: existingVote } = await supabase
    .from('votes')
    .select('*')
    .eq('user_phone', voterPhone)
    .single();

  if (existingVote) return Promise.reject('Already voted');

  // Insert vote
  const { error: voteError } = await supabase
    .from('votes')
    .insert([{ user_phone: voterPhone, candidate_id: candidateId }]);

  if (voteError) throw voteError;

  // Increment candidate count (RPC or manual update)
  // For simplicity doing manual fetch-update, but RPC `increment` is better for concurrency
  const { data: candidate } = await supabase.from('candidates').select('vote_count').eq('id', candidateId).single();
  
  if (candidate) {
    await supabase
      .from('candidates')
      .update({ vote_count: candidate.vote_count + 1 })
      .eq('id', candidateId);
  }

  return true;
};

export const hasVoted = async (voterPhone: string): Promise<boolean> => {
  const { data } = await supabase
    .from('votes')
    .select('*')
    .eq('user_phone', voterPhone)
    .single();
  return !!data;
};

export const registerCandidate = async (candidateData: Omit<Candidate, 'id' | 'vote_count'>): Promise<Candidate> => {
  const { data, error } = await supabase
    .from('candidates')
    .insert([{ ...candidateData, vote_count: 0 }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// --- Issues ---
export const getIssues = async (constituencyId: string): Promise<Issue[]> => {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('constituency_id', constituencyId)
    .order('upvotes', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const reportIssue = async (issueData: Omit<Issue, 'id' | 'upvotes' | 'created_at'>): Promise<Issue> => {
  const { data, error } = await supabase
    .from('issues')
    .insert([{ ...issueData, upvotes: 0 }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const upvoteIssue = async (issueId: string, voterPhone: string): Promise<boolean> => {
  // Check if already upvoted
  const { data: existing } = await supabase
    .from('issue_upvotes')
    .select('*')
    .eq('issue_id', issueId)
    .eq('user_phone', voterPhone)
    .single();

  if (existing) return Promise.reject("Already upvoted");

  // Record upvote
  const { error } = await supabase
    .from('issue_upvotes')
    .insert([{ issue_id: issueId, user_phone: voterPhone }]);

  if (error) throw error;

  // Increment count
  const { data: issue } = await supabase.from('issues').select('upvotes').eq('id', issueId).single();
  if (issue) {
    await supabase.from('issues').update({ upvotes: issue.upvotes + 1 }).eq('id', issueId);
  }

  return true;
};

// --- Admin / Verification ---
export const submitVerification = async (req: Omit<VerificationRequest, 'id' | 'submitted_at' | 'status'>): Promise<boolean> => {
  // 1. Create verification request
  const { error } = await supabase
    .from('verification_requests')
    .insert([req]);
  
  if (error) throw error;

  // 2. Update user status to pending
  await supabase
    .from('users')
    .update({ 
        verification_status: 'pending',
        province: req.province,
        district: req.district,
        municipality: req.municipality,
        ward: req.ward,
        id_image_url: req.id_image_url
    })
    .eq('id', req.user_id);

  return true;
};

export const getPendingVerifications = async (): Promise<VerificationRequest[]> => {
  const { data, error } = await supabase
    .from('verification_requests')
    .select('*')
    .eq('status', 'pending');
  
  if (error) return [];
  return data || [];
};

export const processVerification = async (requestId: string, approved: boolean): Promise<void> => {
  const { data: request } = await supabase
    .from('verification_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (!request) throw new Error("Request not found");

  const newStatus = approved ? 'approved' : 'rejected';

  // Update request status
  await supabase
    .from('verification_requests')
    .update({ status: newStatus })
    .eq('id', requestId);

  // Update user status
  await supabase
    .from('users')
    .update({ 
        verification_status: newStatus, 
        is_verified: approved,
        // If approved, we confirm the constituency. In a real app, this comes from the detected ID.
        // For now, we will just re-detect or trust the data service to have set it when requesting.
        // The VerificationPage logic updates local state, but here we persist.
        // We'll set a default constituency if approved for the demo based on mapping
    })
    .eq('id', request.user_id);
    
  if (approved) {
     const constituencyId = await detectConstituency(request.province, request.district, request.municipality, request.ward);
     await supabase.from('users').update({ constituency_id: constituencyId }).eq('id', request.user_id);
  }
};