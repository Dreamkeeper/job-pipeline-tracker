export const STAGES = [
  'Applied',
  'Screen',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
] as const;

export type Stage = (typeof STAGES)[number];

// Stages that represent forward progress through the funnel, in order.
export const PROGRESS_STAGES = ['Applied', 'Screen', 'Interview', 'Offer'] as const;
export type ProgressStage = (typeof PROGRESS_STAGES)[number];

export function progressRank(stage: Stage): number {
  const i = (PROGRESS_STAGES as readonly string[]).indexOf(stage);
  return i; // -1 for Rejected / Withdrawn
}

export interface Application {
  id?: number;
  company: string;
  role: string;
  link?: string;
  source?: string;
  stage: Stage;
  // Furthest progress stage ever reached, maintained automatically on save.
  // Preserves funnel information after an application becomes Rejected or Withdrawn.
  furthestStage: ProgressStage;
  dateApplied: string; // YYYY-MM-DD
  lastActivity: string; // YYYY-MM-DD
  nextAction?: string;
  nextActionDate?: string;
  notes?: string;
}

export interface ExportFile {
  app: 'job-pipeline-tracker';
  version: 1;
  exportedAt: string;
  applications: Application[];
}
