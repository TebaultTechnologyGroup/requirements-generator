// Shared TypeScript types for the application

export interface FormData {
  idea: string;
  targetMarket: string;
  constraints: string;
  additionalContext: string;
}

export interface ProductRequirements {
  overview: string;
  goals: string[];
  successMetrics: string[];
}

export interface UserStory {
  role: string;
  action: string;
  benefit: string;
  acceptanceCriteria: string[];
}

export interface Risk {
  category: 'Technical' | 'Market' | 'Operational' | 'Financial';
  description: string;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
}

export interface MVPScope {
  inScope: string[];
  outOfScope: string[];
  timeline: string;
  assumptions: string[];
}

export interface PRDResult {
  productRequirements: ProductRequirements;
  userStories: UserStory[];
  risks: Risk[];
  mvpScope: MVPScope;
}

export type Plan = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  plan: Plan;
  generationsThisMonth: number;
  monthResetDate: string;
}

export interface Generation {
  id: string;
  userId: string;
  idea: string;
  targetMarket: string;
  constraints?: string;
  additionalContext?: string;
  productRequirements: ProductRequirements;
  userStories: UserStory[];
  risks: Risk[];
  mvpScope: MVPScope;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface Quota {
  used: number;
  limit: number;
}

export const PLAN_LIMITS: Record<Plan, number> = {
  FREE: 5,
  PRO: 50,
  ENTERPRISE: 999999,
};

export const PLAN_DESCRIPTIONS: Record<Plan, string> = {
  FREE: 'Free tier: 5 generations per month',
  PRO: 'Pro tier: 50 generations per month',
  ENTERPRISE: 'Enterprise tier: Unlimited generations',
};