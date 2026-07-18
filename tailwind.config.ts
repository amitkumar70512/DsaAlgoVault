import type { Config } from 'tailwindcss'
const config: Config = { darkMode: 'class', content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { ink: '#101827', brand: '#6366f1' }, boxShadow: { soft: '0 10px 35px -14px rgba(15,23,42,.2)' } } }, plugins: [] }
export default config
