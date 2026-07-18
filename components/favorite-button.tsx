'use client'
import { useEffect, useState } from 'react'
import { Heart, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const key='dsa-vault-favorites'
const read=():string[]=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return[]}}
export function FavoriteButton({slug,initial=false,compact=false}:{slug:string;initial?:boolean;compact?:boolean}){
 const [active,setActive]=useState(initial)
 useEffect(()=>setActive(initial||read().includes(slug)),[initial,slug])
 const toggle=(event:React.MouseEvent)=>{event.preventDefault();event.stopPropagation();const next=!active;setActive(next);const saved=read();localStorage.setItem(key,JSON.stringify(next?[...new Set([...saved,slug])]:saved.filter(x=>x!==slug)))}
 return <button onClick={toggle} aria-label={active?'Remove from favorites':'Mark as favorite'} aria-pressed={active} className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition',active?'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200':'bg-white hover:border-indigo-300 hover:text-indigo-600 dark:bg-slate-900',compact&&'min-h-8 border-0 bg-transparent px-1')}><Star className={cn('size-4',active&&'fill-amber-400 text-amber-500')}/>{compact?null:<span>{active?'Important':'Mark important'}</span>}</button>
}