import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { entriesByJob$, type Entry } from '../db'
import { useUI } from '../store'
export default function EntryList(){
  const {activeJobId}=useUI();const [entries,setEntries]=useState<Entry[]>([])
  useEffect(()=>{if(!activeJobId){setEntries([]);return}const sub=entriesByJob$(activeJobId).subscribe({next:setEntries});return()=>sub.unsubscribe()},[activeJobId])
  if(!activeJobId)return <div className="section text-sm opacity-70">Selecciona un trabajo para ver sus gastos.</div>
  return(<div className="section"><h3 className="font-semibold mb-3">Gastos</h3>
    {entries.length===0?(<div className="text-sm opacity-70">Sin gastos aún.</div>):(
      <div className="grid gap-2">{entries.map(e=>(
        <motion.div key={e.id} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} className="card p-3">
          <div className="flex items-center justify-between"><div className="text-sm"><div className="font-medium capitalize">{e.type}</div><div className="text-gray-500">{e.date}</div></div><div className="font-semibold">${e.total.toFixed(2)}</div></div>
        </motion.div>
      ))}</div>
    )}
  </div>)
}