import { Constituency, Candidate, Issue, VerificationRequest, User } from '../types';
import { MOCK_CONSTITUENCIES } from '../constants';

// Simulated database
let candidates: Candidate[] = [
  {
    id: 'c1',
    user_id: 'u2',
    constituency_id: 'ktm-1',
    name: 'Sanjeev Sharma',
    qualification: 'Masters in Public Policy',
    background: 'Social worker for 10 years focusing on education.',
    proposals: [
      'Improve local government school infrastructure',
      'Digitalize ward services',
      'Create 500 local jobs annually',
      'Clean Bagmati campaign',
      'Free health checkups for elderly'
    ],
    vote_count: 1450
  },
  {
    id: 'c2',
    user_id: 'u3',
    constituency_id: 'ktm-1',
    name: 'Anjali Thapa',
    qualification: 'Environmental Engineer',
    background: 'Activist for urban green spaces.',
    proposals: [
      'Plant 10,000 trees',
      'Waste management reform',
      'Youth entrepreneurship fund',
      'Women safety programs',
      'Public transport overhaul'
    ],
    vote_count: 1320
  },
  {
    id: 'c3',
    user_id: 'u4',
    constituency_id: 'ktm-1',
    name: 'Ramesh Adhikari',
    qualification: 'PhD in Economics',
    background: 'Retired professor.',
    proposals: [
      'Local budget transparency',
      'Small business tax relief',
      'Community libraries',
      'Skill development centers',
      'Heritage preservation'
    ],
    vote_count: 980
  }
];

let issues: Issue[] = [
  {
    id: 'i1',
    constituency_id: 'ktm-1',
    title: 'Broken Road in Baneshwor',
    description: 'The main road near the complex has been broken for 6 months causing traffic jams.',
    status: 'pending',
    upvotes: 45,
    created_by: '9841******',
    created_at: '2023-10-15'
  },
  {
    id: 'i2',
    constituency_id: 'ktm-1',
    title: 'No Water Supply in Ward 10',
    description: 'We have not received Melamchi water for 2 weeks.',
    status: 'in_progress',
    upvotes: 120,
    created_by: '9860******',
    created_at: '2023-10-18'
  },
  {
    id: 'i3',
    constituency_id: 'ktm-2',
    title: 'Street Lights Malfunction',
    description: 'Pepsicola area street lights are not working.',
    status: 'resolved',
    upvotes: 15,
    created_by: '9801******',
    created_at: '2023-09-20'
  }
];

let votes: Record<string, string> = {}; // voter_phone -> candidate_id
let issueUpvotes: Record<string, Set<string>> = {}; // issue_id -> Set(voter_phones)
let verificationRequests: VerificationRequest[] = [];

export const getConstituencies = (): Promise<Constituency[]> => {
  return Promise.resolve(MOCK_CONSTITUENCIES);
};

export const getConstituencyById = (id: string): Promise<Constituency | undefined> => {
  return Promise.resolve(MOCK_CONSTITUENCIES.find(c => c.id === id));
};

export const detectConstituency = (province: string, district: string, municipality: string, ward: string): Promise<string> => {
  // Deterministic mock logic
  // In real app, this queries the GIS/Address database
  if (district === 'Kathmandu') return Promise.resolve('ktm-1'); // Defaulting for demo
  if (district === 'Lalitpur') return Promise.resolve('lal-1');
  if (district === 'Kaski') return Promise.resolve('kas-1');
  if (district === 'Rupandehi') return Promise.resolve('rup-1');
  
  // Fallback
  return Promise.resolve('ktm-1');
};

// Candidate Operations
export const getCandidates = (constituencyId: string): Promise<Candidate[]> => {
  return Promise.resolve(candidates.filter(c => c.constituency_id === constituencyId).sort((a,b) => b.vote_count - a.vote_count));
};

export const voteForCandidate = (candidateId: string, voterPhone: string): Promise<boolean> => {
  if (votes[voterPhone]) return Promise.reject('Already voted');
  
  const candidate = candidates.find(c => c.id === candidateId);
  if (candidate) {
    candidate.vote_count++;
    votes[voterPhone] = candidateId;
    return Promise.resolve(true);
  }
  return Promise.reject('Candidate not found');
};

export const hasVoted = (voterPhone: string): Promise<boolean> => {
  return Promise.resolve(!!votes[voterPhone]);
};

export const registerCandidate = (candidateData: Omit<Candidate, 'id' | 'vote_count'>): Promise<Candidate> => {
  const newCandidate: Candidate = {
    ...candidateData,
    id: `c${Date.now()}`,
    vote_count: 0
  };
  candidates.push(newCandidate);
  return Promise.resolve(newCandidate);
};

// Issue Operations
export const getIssues = (constituencyId: string): Promise<Issue[]> => {
  return Promise.resolve(issues.filter(i => i.constituency_id === constituencyId).sort((a,b) => b.upvotes - a.upvotes));
};

export const reportIssue = (issueData: Omit<Issue, 'id' | 'upvotes' | 'created_at'>): Promise<Issue> => {
  const newIssue: Issue = {
    ...issueData,
    id: `i${Date.now()}`,
    upvotes: 0,
    created_at: new Date().toISOString().split('T')[0]
  };
  issues.push(newIssue);
  return Promise.resolve(newIssue);
};

export const upvoteIssue = (issueId: string, voterPhone: string): Promise<boolean> => {
  if (!issueUpvotes[issueId]) issueUpvotes[issueId] = new Set();
  
  if (issueUpvotes[issueId].has(voterPhone)) return Promise.reject("Already upvoted");
  
  const issue = issues.find(i => i.id === issueId);
  if (issue) {
    issue.upvotes++;
    issueUpvotes[issueId].add(voterPhone);
    return Promise.resolve(true);
  }
  return Promise.reject("Issue not found");
};

// Admin / Verification
export const submitVerification = (req: Omit<VerificationRequest, 'id' | 'submitted_at'>): Promise<boolean> => {
  verificationRequests.push({
    ...req,
    id: `vr${Date.now()}`,
    submitted_at: new Date().toISOString()
  });
  return Promise.resolve(true);
};

export const getPendingVerifications = (): Promise<VerificationRequest[]> => {
  return Promise.resolve(verificationRequests);
};

export const processVerification = (requestId: string, approved: boolean, adminUser?: User): Promise<void> => {
  const index = verificationRequests.findIndex(r => r.id === requestId);
  if (index === -1) return Promise.reject('Request not found');
  
  // In a real app, if approved, we move data to Users table and update status
  // Here we just remove from queue for demo
  verificationRequests.splice(index, 1);
  return Promise.resolve();
};