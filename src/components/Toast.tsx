import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
export default function Toast({ text }:{text:string}){
  const [show,setShow]=useState(true);useEffect(()=>{const t=setTimeout(()=>setShow(false),1900);return()=>clearTimeout(t)},[])
  return(<AnimatePresence>{show&&(<motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:10,opacity:0}} className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-xl shadow-card">{text}</motion.div>)}</AnimatePresence>)
}