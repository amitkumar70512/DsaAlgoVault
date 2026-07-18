import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Problem, ProblemMeta } from './types'

const contentDir = path.join(process.cwd(), 'content', 'problems')
const estimate = (body: string) => Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 220))
export function getProblems(): Problem[] {
  if (!fs.existsSync(contentDir)) return []
  return fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx')).map(file => {
    const { data, content } = matter(fs.readFileSync(path.join(contentDir, file), 'utf8'))
    return { ...(data as Omit<ProblemMeta, 'slug'>), slug: file.replace(/\.mdx$/, ''), body: content, readingTime: estimate(content) }
  }).sort((a,b) => a.title.localeCompare(b.title))
}
export const getProblem = (slug: string) => getProblems().find(p => p.slug === slug)
export const groupBy = (items: Problem[], key: keyof ProblemMeta) => Object.entries(items.reduce<Record<string, number>>((acc, item) => { const value = item[key]; (Array.isArray(value) ? value : [value]).filter(Boolean).forEach(v => acc[String(v)] = (acc[String(v)] || 0) + 1); return acc }, {})).sort((a,b) => b[1]-a[1])
