import { Suspense } from "react";
import { getProblems } from "@/lib/content";
import { SearchableProblems } from "@/components/searchable-problems";
export const metadata = { title: "Problems" };
export default function ProblemsPage() {
  const problems = getProblems();
  return (
    <div className="shell py-8 pb-24">
      <p className="text-sm font-medium text-indigo-600">Knowledge base</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Problem vault</h1>
      <p className="mt-2 text-slate-500">
        Search across concepts, explanations and interview signals.
      </p>
      <div className="mt-8">
        <Suspense
          fallback={
            <div className="panel p-10 text-center text-slate-500">
              Loading problem vault…
            </div>
          }
        >
          <SearchableProblems problems={problems} />
        </Suspense>
      </div>
    </div>
  );
}
