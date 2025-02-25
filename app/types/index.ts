export interface Candidate {
  id: string;
  name: string;
  email: string;
  linkedinUrl: string;
  skills: string[];
  experience: string;
  education: string;
  resumeText: string;
  relevanceScore?: number;
  aiSummary?: string;
  missingSkills?: string[];
  status?: 'new' | 'shortlisted' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface JobDescription {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  experience: string;
  education: string;
  createdAt?: string;
}

export interface CandidateStatus {
  candidateId: string;
  status: 'new' | 'shortlisted' | 'rejected';
}