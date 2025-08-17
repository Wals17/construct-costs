import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { db, type Entry, type EntryType } from '../db'
import { useUI } from '../store'
import Toast from './Toast'
function uid(prefix='id'){return prefix+'_'+Math.random().toString(36).slice(2,9)}
export default function EntryForm(){
  const {activeJobId}=useUI();const [type,setType]=useState<EntryType>('labor');const [total,setTotal]=useState('');const [date,setDate]=useState(()=>new Date().toISOString().slice(0,10));const [toast,setToast]=useState('')
  async function save(){if(!activeJobId)return;const t=parseFloat(total);if(isNaN(t))return;const entry:Entry={id:uid('e'),jobId:activeJobId,type,date,total:t};await db.entries.add(entry);setToast('Gasto guardado');setTotal('')}
  useEffect(()=>{if(!activeJobId){setTotal('')}},[activeJobId])
  const disabled=!activeJobId
  return(<div className="section"><h3 className="font-semibold mb-3">Añadir gasto</h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <label className="label col-span-2 sm:col-span-1">Tipo
        <select className="input mt-1" value={type} onChange={e=>setType(e.target.value as any)}>
          <option value="labor">Mano de obra</option><option value="material">Materiales</option><option value="sub">Subcontratistas</option><option value="equip">Equipo</option><option value="overhead">Indirectos</option>
        </select>
      </label>
      <label className="label">Fecha<input className="input mt-1" type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
      <label className="label col-span-2 sm:col-span-1">Total (USD)<input className="input mt-1" placeholder="0.00" value={total} onChange={e=>setTotal(e.target.value)} /></label>
      <div className="col-span-2 sm:col-span-1 flex items-end"><motion.button className="btn btn-primary w-full" whileTap={{scale:.98}} onClick={save} disabled={disabled}>Guardar</motion.button></div>
    </div>
    {toast&&<Toast text={toast} />}
  </div>)
}