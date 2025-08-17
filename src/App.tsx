import { useEffect, useState } from 'react'
import './style.css'
import { registerSW } from './registerSW'
import Section from './components/Section'
import JobSelector from './components/JobSelector'
import EntryForm from './components/EntryForm'
import EntryList from './components/EntryList'
import ProfitCard from './components/ProfitCard'
import KPIHeader from './components/KPIHeader'
registerSW()
export default function App(){
  const [swUpdate,setSwUpdate]=useState(false)
  useEffect(()=>{const onUpdate=()=>setSwUpdate(true);window.addEventListener('sw-update',onUpdate);return()=>window.removeEventListener('sw-update',onUpdate)},[])
  return(<div className="min-h-screen pb-20">
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-brand"></div><h1 className="text-lg font-semibold">Construct Costs</h1></div>
        <InstallHint />
      </div>
      {swUpdate&&(<div className="bg-amber-50 border-t border-amber-200 text-amber-800 text-sm px-4 py-2 text-center">Nueva versión disponible. <button className="underline" onClick={()=>location.reload()}>Actualizar</button></div>)}
    </header>
    <main className="mx-auto max-w-5xl px-4 py-4 space-y-4">
      <Section title="KPI's principales"><KPIHeader /></Section>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-4"><JobSelector /></div>
        <div className="md:col-span-2 space-y-4"><EntryForm /><EntryList /><ProfitCard /></div>
      </div>
    </main>
  </div>)
}
function InstallHint(){const [iOS,setIOS]=useState(false);useEffect(()=>{setIOS(/iphone|ipad|ipod/i.test(navigator.userAgent))},[]);if(!iOS)return null;return <div className="text-xs text-gray-500">En iPhone: Safari → Compartir → <b>Añadir a pantalla de inicio</b></div>}