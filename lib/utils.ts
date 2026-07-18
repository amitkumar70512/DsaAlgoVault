import { clsx, type ClassValue } from 'clsx'
export const cn = (...inputs: ClassValue[]) => clsx(inputs)
export const revisionDue = (date?: string) => !!date && new Date(date).getTime() <= new Date().setHours(23,59,59,999)
export const dateLabel = (date?: string) => date ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date)) : '—'
