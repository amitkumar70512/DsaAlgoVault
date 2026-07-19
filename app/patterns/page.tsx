import Link from "next/link";
import { getProblems, groupBy } from "@/lib/content";
export default function Patterns() {
  const p = getProblems(),
    patterns = groupBy(p, "pattern");
  return (
    <div className="shell py-8 pb-24">
      <h1 className="text-3xl font-bold tracking-tight">Patterns</h1>
      <p className="mt-2 text-slate-500">
        Mental models to recognize before you code.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map(([name, count]) => (
          <Link
            href={`/problems?pattern=${encodeURIComponent(name)}`}
            key={name}
            className="panel p-5 hover:border-indigo-300"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
              Pattern
            </p>
            <h2 className="mt-2 font-semibold">{name}</h2>
            <p className="mt-4 text-sm text-slate-500">
              {count} related problems
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
