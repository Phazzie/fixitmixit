import { PhaseType } from './PhaseType';

export interface Session {
  id: string;
  userA: string; // User ID
  userB: string; // User ID
  currentPhase: PhaseType;
  issueStatement: string | null;
  issueProposedBy: string | null; // User ID
  issueAgreedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  isActive: boolean;
}
