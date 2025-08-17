import { motion } from 'framer-motion'
export default function KPI({label,value,icon,accent}:{label:string,value:string,icon:string,accent?:boolean}){
  return(<motion.div whileHover={{y:-2}} className={`card p-4 sm:p-5 ${accent?'bg-brand text-white':''}`}>
    <div className="flex items-center gap-3 mb-2"><div className={`text-2xl ${accent?'':'text-brand'}`}>{icon}</div><div className="text-sm opacity-80">{label}</div></div>
    <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${accent?'':'text-gray-900'}`}>{value}</div>
  </motion.div>)
}