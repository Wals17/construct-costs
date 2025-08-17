import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { db, jobs$, type Job } from '../db'
import { useUI } from '../store'
function uid(prefix='id'){return prefix+'_'+Math.random().toString(36).slice(2,9)}
export default function JobSelector(){
  const [jobs,setJobs]=useState<Job[]>([]);const {activeJobId,setActiveJob}=useUI()
  useEffect(()=>{const sub=jobs$().subscribe({next:setJobs});return()=>sub.unsubscribe()},[])
  const activeJob=useMemo(()=>jobs.find(j=>j.id===activeJobId),[jobs,activeJobId])
  return(<div className="card p-4 sm:p-5">
    <div className="flex items-center justify-between mb-2"><h3 className="font-semibold">Trabajos</h3>
      <button className="btn btn-primary" onClick={async()=>{const name=prompt('Nombre del trabajo');if(!name)return;const client=prompt('Cliente (opcional)')||undefined;const id=uid('job');await db.jobs.add({id,name,client});setActiveJob(id)}}>Nuevo</button></div>
    {jobs.length===0?(<div className="text-sm opacity-70">Aún no hay trabajos. Crea el primero.</div>):(
      <div className="grid gap-2">{jobs.map(j=>(
        <motion.button key={j.id} whileTap={{scale:.98}} onClick={()=>setActiveJob(j.id)} className={`w-full text-left p-3 rounded-xl border transition ${activeJobId===j.id?'border-brand bg-brand-50':'border-gray-200 hover:bg-gray-50'}`}>
          <div className="font-medium">{j.name}</div><div className="text-xs text-gray-500">{j.client||'—'}</div>
        </motion.button>
      ))}</div>)}
    {activeJob&&(<div className="mt-3 text-sm"><span className="opacity-70">Activo: </span><span className="font-medium">{activeJob.name}</span></div>)}
  </div>)
}