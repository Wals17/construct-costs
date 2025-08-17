import Dexie, { Table } from 'dexie';

export type Job = {
  id: string;
  name: string;
  client?: string;
  taxRate?: number;
  startDate?: string;
  notes?: string;
};

export type Entry = {
  id: string;
  jobId: string;
  type: 'labor' | 'material' | 'sub' | 'equip' | 'overhead';
  date: string;
  total: number;
  payload: any;
};

class AppDB extends Dexie {
  jobs!: Table<Job, string>;
  entries!: Table<Entry, string>;

  constructor() {
    super('construct_costs_db');
    this.version(1).stores({
      jobs: 'id, name, client',
      entries: 'id, jobId, date, type'
    });
  }
}

export const db = new AppDB();

export async function costToDate(jobId: string): Promise<number> {
  const entries = await db.entries.where('jobId').equals(jobId).toArray();
  return entries.reduce((sum, e) => sum + (e.total || 0), 0);
}