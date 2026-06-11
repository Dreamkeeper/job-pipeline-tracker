import Dexie, { type Table } from 'dexie';
import type { Application, ExportFile, ProgressStage } from './types';
import { progressRank, STAGES, PROGRESS_STAGES } from './types';

class TrackerDB extends Dexie {
  applications!: Table<Application, number>;

  constructor() {
    super('job-pipeline-tracker');
    this.version(1).stores({
      applications: '++id, company, stage, dateApplied, lastActivity',
    });
  }
}

export const db = new TrackerDB();

function withFurthest(app: Application): Application {
  const rank = progressRank(app.stage);
  const prevRank = progressRank(app.furthestStage ?? 'Applied');
  // rank is -1 for Rejected/Withdrawn, so those never advance furthestStage.
  const furthestStage: ProgressStage =
    rank >= 0 && rank > prevRank ? PROGRESS_STAGES[rank] : (app.furthestStage ?? 'Applied');
  return { ...app, furthestStage };
}

export async function saveApplication(app: Application): Promise<number> {
  return db.applications.put(withFurthest(app));
}

export async function deleteApplication(id: number): Promise<void> {
  return db.applications.delete(id);
}

export async function clearAllData(): Promise<void> {
  return db.applications.clear();
}

export async function exportData(): Promise<ExportFile> {
  const applications = await db.applications.toArray();
  return {
    app: 'job-pipeline-tracker',
    version: 1,
    exportedAt: new Date().toISOString(),
    applications,
  };
}

export async function importData(file: ExportFile): Promise<number> {
  if (file.app !== 'job-pipeline-tracker' || !Array.isArray(file.applications)) {
    throw new Error('Not a valid Job Pipeline Tracker backup file.');
  }
  for (const a of file.applications) {
    if (typeof a.company !== 'string' || typeof a.role !== 'string') {
      throw new Error('Backup file contains an entry without company or role.');
    }
    if (!(STAGES as readonly string[]).includes(a.stage)) {
      throw new Error(`Backup file contains an invalid stage: "${String(a.stage)}".`);
    }
    if (a.furthestStage != null && !(PROGRESS_STAGES as readonly string[]).includes(a.furthestStage)) {
      throw new Error(`Backup file contains an invalid furthest stage: "${String(a.furthestStage)}".`);
    }
  }
  await db.transaction('rw', db.applications, async () => {
    await db.applications.clear();
    // Strip ids so imports never collide with auto-increment state.
    await db.applications.bulkAdd(
      file.applications.map((a) => {
        const { id: _id, ...rest } = a;
        return withFurthest(rest as Application);
      }),
    );
  });
  return file.applications.length;
}

export async function seedApplications(apps: Application[]): Promise<void> {
  await db.transaction('rw', db.applications, async () => {
    await db.applications.clear();
    await db.applications.bulkAdd(apps.map(withFurthest));
  });
}
