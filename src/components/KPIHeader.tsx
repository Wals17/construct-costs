import { useEffect, useState, useMemo } from 'react'
import KPI from './KPI'
import { costToDate } from '../db'
import { useUI } from '../store'
export default function KPIHeader(){
  const {activeJobId,taxDefault}=useUI();const [cost,setCost]=useState(0);const [percent]=useState(20)
  useEffect(()=>{if(!activeJobId){setCost(0);return}let live=true;const tick=async()=>{const c=await costToDate(activeJobId);if(live)setCost(c)};tick();const int=setInterval(tick,400);return()=>{live=false;clearInterval(int)}},[activeJobId])
  const m=percent/100;const pre=activeJobId?(cost/(1-(m||0.00001))):0;const inv=pre*(1+taxDefault/100);const profit=pre-cost
  return(<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <KPI label="Costo total" value={`$${cost.toFixed(2)}`} icon="💰" accent />
    <KPI label="Precio (antes de IVU)" value={`$${pre.toFixed(2)}`} icon="🧮" />
    <KPI label="Factura total (con IVU)" value={`$${inv.toFixed(2)}`} icon="🧾" />
    <KPI label="Ganancia estimada" value={`$${profit.toFixed(2)}`} icon="📊" />
  </div>)
}