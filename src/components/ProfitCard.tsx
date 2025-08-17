import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { costToDate } from '../db'
import { useUI } from '../store'
type Mode='margin'|'markup'
export default function ProfitCard(){
  const {activeJobId,taxDefault,setTaxDefault}=useUI();const [mode,setMode]=useState<Mode>('margin');const [percent,setPercent]=useState('20');const [tax,setTax]=useState(String(taxDefault));const [cost,setCost]=useState(0)
  useEffect(()=>{if(!activeJobId){setCost(0);return}costToDate(activeJobId).then(setCost)},[activeJobId])
  useEffect(()=>{setTaxDefault(parseFloat(tax)||0)},[tax,setTaxDefault])
  const p=useMemo(()=> (parseFloat(percent)/100)||0,[percent]);const T=useMemo(()=> (parseFloat(tax)/100)||0,[tax])
  const preTax=useMemo(()=> mode==='margin'?(cost/(1-(p||0.00001))):(cost*(1+p)),[mode,p,cost])
  const invoice=useMemo(()=> preTax*(1+T),[preTax,T]);const profit=useMemo(()=> preTax-cost,[preTax,cost])
  if(!activeJobId)return <div className="section text-sm opacity-70">Selecciona un trabajo para calcular precios.</div>
  return(<div className="section">
    <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Calculadora de ganancia</h3></div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <label className="label col-span-2 sm:col-span-1">Modo
        <select className="input mt-1" value={mode} onChange={e=>setMode(e.target.value as Mode)}><option value="margin">Margen (%)</option><option value="markup">Markup (%)</option></select>
      </label>
      <label className="label">%<input className="input mt-1" value={percent} onChange={e=>setPercent(e.target.value)} /></label>
      <label className="label">Impuesto (%)<input className="input mt-1" value={tax} onChange={e=>setTax(e.target.value)} /></label>
      <div className="label flex items-end">Costo a la fecha: <span className="ml-1 font-semibold">${cost.toFixed(2)}</span></div>
    </div>
    <div className="grid sm:grid-cols-2 gap-3 mt-4">
      <motion.div className="card p-4" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}><div className="text-sm opacity-70">Precio (antes de IVU)</div><div className="text-2xl font-bold">${preTax.toFixed(2)}</div></motion.div>
      <motion.div className="card p-4" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}><div className="text-sm opacity-70">Factura total (con IVU)</div><div className="text-2xl font-bold">${invoice.toFixed(2)}</div></motion.div>
      <motion.div className="card p-4" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}><div className="text-sm opacity-70">Ganancia estimada</div><div className="text-2xl font-bold">${profit.toFixed(2)}</div></motion.div>
    </div>
  </div>)
}