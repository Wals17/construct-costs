import { useEffect, useMemo, useState } from 'react'
import { useApp } from './store'
import { registerSW } from './registerSW'

registerSW()

type Mode = 'margin' | 'markup'

function uid(prefix='id'){ return prefix+'_'+Math.random().toString(36).slice(2,9) }

export default function App() {
  const { jobs, entries, activeJobId, load, addJob, addEntry, setActiveJob, getCostToDate } = useApp()
  const [swUpdate, setSwUpdate] = useState(false)

  useEffect(() => {
    load()
    const onUpdate = () => setSwUpdate(true)
    window.addEventListener('sw-update', onUpdate)
    return () => window.removeEventListener('sw-update', onUpdate)
  }, [load])

  const activeJob = useMemo(() => jobs.find(j => j.id === activeJobId), [jobs, activeJobId])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', padding: 16, maxWidth: 900, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Construct Costs</h1>
        <InstallHint />
      </header>

      {swUpdate && (
        <div style={{ background: '#fffae5', border: '1px solid #f59e0b', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          Nueva versión disponible. <button onClick={() => location.reload()}>Actualizar</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <section>
          <JobCreator onCreate={async (name, client) => {
            const id = uid('job')
            await addJob({ id, name, client })
            setActiveJob(id)
          }} />
          <JobList jobs={jobs} activeId={activeJobId} onSelect={setActiveJob} getCostToDate={getCostToDate} />
        </section>

        <section>
          {activeJob ? (
            <>
              <h2 style={{ marginTop: 0 }}>{activeJob.name}{activeJob.client ? ` — ${activeJob.client}` : ''}</h2>
              <EntryCreator jobId={activeJob.id} onAdd={addEntry} />
              <EntryList entries={entries.filter(e => e.jobId === activeJob.id)} />
              <ProfitCalculator jobId={activeJob.id} getCostToDate={getCostToDate} />
            </>
          ) : (
            <div style={{ opacity: 0.7 }}>Selecciona o crea un trabajo para empezar.</div>
          )}
        </section>
      </div>
    </div>
  )
}

function InstallHint(){
  const [iOS, setIOS] = useState(false)
  useEffect(()=>{
    const ua = navigator.userAgent.toLowerCase()
    setIOS(/iphone|ipad|ipod/.test(ua))
  },[])
  if(!iOS) return null
  return <small>En iPhone: abre en Safari → Compartir → <b>Añadir a pantalla de inicio</b>.</small>
}

function JobCreator({ onCreate }:{ onCreate:(name:string, client?:string)=>void }){
  const [name, setName] = useState('')
  const [client, setClient] = useState('')
  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <h3 style={{ marginTop: 0 }}>Nuevo trabajo</h3>
      <div style={{ display:'grid', gap: 8 }}>
        <input placeholder="Nombre del trabajo" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Cliente (opcional)" value={client} onChange={e=>setClient(e.target.value)} />
        <button onClick={()=>{ if(name.trim()) { onCreate(name.trim(), client.trim()||undefined); setName(''); setClient(''); }}}>Crear</button>
      </div>
    </div>
  )
}

function JobList({ jobs, activeId, onSelect, getCostToDate }:{ jobs:any[], activeId?:string, onSelect:(id?:string)=>void, getCostToDate:(id:string)=>Promise<number> }){
  const [costs, setCosts] = useState<Record<string, number>>({})
  useEffect(()=>{
    (async ()=>{
      const map: Record<string, number> = {}
      for(const j of jobs){
        map[j.id] = await getCostToDate(j.id)
      }
      setCosts(map)
    })()
  }, [jobs, getCostToDate])
  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>Trabajos</h3>
      <ul style={{ listStyle:'none', padding:0, margin:0, display:'grid', gap:8 }}>
        {jobs.map(j => (
          <li key={j.id} style={{ border:'1px solid #e5e7eb', padding:8, borderRadius:8, background: j.id===activeId ? '#ecfeff':'#fff' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
              <div>
                <div style={{ fontWeight:600 }}>{j.name}</div>
                <small>{j.client || '—'}</small>
                <div><small>Costo a la fecha: ${ (costs[j.id] || 0).toFixed(2) }</small></div>
              </div>
              <button onClick={()=>onSelect(j.id)}>Abrir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EntryCreator({ jobId, onAdd }:{ jobId:string, onAdd:(e:any)=>Promise<void> }){
  const [type, setType] = useState<'labor'|'material'|'sub'|'equip'|'overhead'>('labor')
  const [total, setTotal] = useState('')
  const [date, setDate] = useState(()=>new Date().toISOString().slice(0,10))
  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <h3 style={{ marginTop: 0 }}>Añadir gasto</h3>
      <div style={{ display:'grid', gap:8 }}>
        <select value={type} onChange={e=>setType(e.target.value as any)}>
          <option value="labor">Mano de obra</option>
          <option value="material">Materiales</option>
          <option value="sub">Subcontratistas</option>
          <option value="equip">Equipo</option>
          <option value="overhead">Indirectos</option>
        </select>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <input placeholder="Total (USD)" value={total} onChange={e=>setTotal(e.target.value)} />
        <button onClick={async ()=>{
          const t = parseFloat(total)
          if(isNaN(t)) return
          await onAdd({ id: uid('e'), jobId, type, date, total: t, payload: {} })
          setTotal('')
        }}>Guardar</button>
      </div>
    </div>
  )
}

function EntryList({ entries }:{ entries:any[] }){
  if(!entries.length) return <div style={{ opacity:0.7, marginBottom:12 }}>Sin gastos aún.</div>
  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <h3 style={{ marginTop: 0 }}>Gastos</h3>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr><th style={{ textAlign:'left' }}>Fecha</th><th style={{ textAlign:'left' }}>Tipo</th><th style={{ textAlign:'right' }}>Total</th></tr>
        </thead>
        <tbody>
          {entries.map(e => (
            <tr key={e.id}>
              <td>{e.date}</td>
              <td>{e.type}</td>
              <td style={{ textAlign:'right' }}>${e.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProfitCalculator({ jobId, getCostToDate }:{ jobId:string, getCostToDate:(id:string)=>Promise<number> }){
  const [mode, setMode] = useState<Mode>('margin')
  const [percent, setPercent] = useState('20')
  const [tax, setTax] = useState('0')
  const [cost, setCost] = useState(0)

  useEffect(()=>{
    (async()=> setCost(await getCostToDate(jobId)))()
  }, [jobId, getCostToDate])

  const p = parseFloat(percent)/100 || 0
  const T = parseFloat(tax)/100 || 0
  const preTax = mode === 'margin' ? (cost / (1 - p || 1)) : (cost * (1 + p))
  const invoice = preTax * (1 + T)
  const profit = preTax - cost

  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>Calculadora de ganancia</h3>
      <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 1fr 1fr 1fr' }}>
        <label>Modo
          <select value={mode} onChange={e=>setMode(e.target.value as Mode)}>
            <option value="margin">Margen (%)</option>
            <option value="markup">Markup (%)</option>
          </select>
        </label>
        <label>%
          <input value={percent} onChange={e=>setPercent(e.target.value)} />
        </label>
        <label>Impuesto (%)
          <input value={tax} onChange={e=>setTax(e.target.value)} />
        </label>
        <div style={{ alignSelf:'end', opacity:0.8 }}>Costo a la fecha: <b>${cost.toFixed(2)}</b></div>
      </div>

      <div style={{ marginTop: 12, display:'grid', gap:6 }}>
        <div>Precio (antes de IVU): <b>${preTax.toFixed(2)}</b></div>
        <div>Factura total (con IVU): <b>${invoice.toFixed(2)}</b></div>
        <div>Ganancia estimada: <b>${profit.toFixed(2)}</b></div>
        <small style={{ opacity:0.7 }}>
          Fórmulas: {mode==='margin' ? 'P = C / (1 - m)' : 'P = C * (1 + k)'}; Factura = P * (1 + T)
        </small>
      </div>
    </div>
  )
}