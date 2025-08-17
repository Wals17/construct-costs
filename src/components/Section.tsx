import { ReactNode } from 'react'
import { motion } from 'framer-motion'
export default function Section({ title, children, right }:{title:string,children:ReactNode,right?:ReactNode}){
  return(<motion.section className="section fade-in" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.22}}>
    <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-semibold">{title}</h2>{right}</div>
    <div>{children}</div></motion.section>)
}