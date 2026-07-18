'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
export function Markdown({children}:{children:string}) { return <ReactMarkdown className="prose-note" remarkPlugins={[remarkGfm]} components={{a: ({href,children})=><a href={href} target="_blank" rel="noreferrer" className="text-indigo-600 underline">{children}</a>}}>{children}</ReactMarkdown> }
