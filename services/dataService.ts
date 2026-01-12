import { supabase } from './supabaseClient';
import { Constituency, Candidate, Issue, VerificationRequest, User } from '../types';
import { MOCK_CONSTITUENCIES } from '../constants';

// --- Storage ---
export const uploadIdDocument = async (file: File, userId: string): Promise<string> => {
  // 1. Construct path: userId/timestamp_filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // 2. Upload to 'id-verifications' bucket
  const { error: uploadError } = await supabase.storage
    .from('id-verifications')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Upload Error:', uploadError);
    throw new Error(`Failed to upload ID document: ${uploadError.message}`);
  }

  // 3. Generate Signed URL (Valid for 1 year to ensure Admin can see it easily without complex logic)
  const { data, error: urlError } = await supabase.storage
    .from('id-verifications')
    .createSignedUrl(filePath, 31536000); // 1 year expiry

  if (urlError || !data?.signedUrl) {
    throw new Error('Failed to generate document URL.');
  }

  return data.signedUrl;
};

// --- Constituencies ---
export const getConstituencies = async (): Promise<Constituency[]> => {
  const { data, error } = await supabase
    .from('constituencies')
    .select('*');
  
  if (error || !data || data.length === 0) {
    // If DB is empty or fails, return the restricted list from constants
    return MOCK_CONSTITUENCIES; 
  }
  return data;
};

export const getConstituencyById = async (id: string): Promise<Constituency | undefined> => {
  // Try DB first
  const { data, error } = await supabase
    .from('constituencies')
    .select('*')
    .eq('id', id)
    .single();
    
  if (data) return data;

  // Fallback to restricted list
  return MOCK_CONSTITUENCIES.find(c => c.id === id);
};

export const detectConstituency = async (province: string, district: string, municipality: string, ward: string): Promise<string> => {
  // Logic for the Limited Version (Bhaktapur 1, Bara 3, Kathmandu 7)
  
  if (district === 'Bhaktapur') {
      return 'bhaktapur-1';
  }

  if (district === 'Bara') {
      return 'bara-3';
  }

  if (district === 'Kathmandu') {
      return 'kathmandu-7';
  }
  
  // Final fallback (Safe default for this version)
  return 'bhaktapur-1';
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
  const updatePayload: any = { 
    verification_status: newStatus, 
    is_verified: approved 
  };

  if (approved) {
     const constituencyId = await detectConstituency(request.province, request.district, request.municipality, request.ward);
     updatePayload.constituency_id = constituencyId;
  }

  await supabase
    .from('users')
    .update(updatePayload)
    .eq('id', request.user_id);
};