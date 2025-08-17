import { create } from 'zustand'
import { db, Job, Entry, costToDate } from './db'

type AppState = {
  jobs: Job[]
  entries: Entry[]
  activeJobId?: string
  load: () => Promise<void>
  addJob: (job: Job) => Promise<void>
  addEntry: (entry: Entry) => Promise<void>
  setActiveJob: (id?: string) => void
  getCostToDate: (jobId: string) => Promise<number>
}

export const useApp = create<AppState>((set, get) => ({
  jobs: [],
  entries: [],
  activeJobId: undefined,
  load: async () => {
    const [jobs, entries] = await Promise.all([db.jobs.toArray(), db.entries.toArray()])
    set({ jobs, entries })
  },
  addJob: async (job) => {
    await db.jobs.add(job)
    set({ jobs: [...get().jobs, job] })
  },
  addEntry: async (entry) => {
    await db.entries.add(entry)
    set({ entries: [...get().entries, entry] })
  },
  setActiveJob: (id) => set({ activeJobId: id }),
  getCostToDate: (jobId) => costToDate(jobId),
}))