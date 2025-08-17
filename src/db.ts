import Dexie, { Table, liveQuery } from 'dexie';
export type Job={id:string,name:string,client?:string,taxRate?:number,startDate?:string,notes?:string};
export type EntryType='labor'|'material'|'sub'|'equip'|'overhead';
export type Entry={id:string,jobId:string,type:EntryType,date:string,total:number,payload?:any};
class AppDB extends Dexie{jobs!:Table<Job,string>;entries!:Table<Entry,string>;constructor(){super('construct_costs_db_v2');this.version(1).stores({jobs:'id, name, client',entries:'id, jobId, date, type'})}}
export const db=new AppDB();
export const jobs$=()=>liveQuery(()=>db.jobs.toArray());
export const entriesByJob$=(jobId:string)=>liveQuery(()=>db.entries.where('jobId').equals(jobId).reverse().sortBy('date'));
export async function costToDate(jobId:string){const arr=await db.entries.where('jobId').equals(jobId).toArray();return arr.reduce((s,e)=>s+(e.total||0),0)}