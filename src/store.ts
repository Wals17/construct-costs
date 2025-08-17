import { create } from 'zustand'
type UI={activeJobId?:string,setActiveJob:(id?:string)=>void,taxDefault:number,setTaxDefault:(t:number)=>void}
const TAX_KEY='settings.taxDefault';const ACTIVE_JOB_KEY='ui.activeJobId'
const storedTax=Number(localStorage.getItem(TAX_KEY)??'0')||0
const storedJob=localStorage.getItem(ACTIVE_JOB_KEY)||undefined
export const useUI=create<UI>((set)=>({
  activeJobId: storedJob,
  setActiveJob:(id)=>{if(id)localStorage.setItem(ACTIVE_JOB_KEY,id);else localStorage.removeItem(ACTIVE_JOB_KEY);set({activeJobId:id})},
  taxDefault: storedTax,
  setTaxDefault:(t)=>{localStorage.setItem(TAX_KEY,String(t));set({taxDefault:t})}
}))