import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
} from "lucide-react";
import { getProblem, getProblems } from "@/lib/content";
import { Markdown } from "@/components/markdown";
import { FavoriteButton } from "@/components/favorite-button";
import { ReviewButton } from "@/components/review-button";
export function generateStaticParams() {
  return getProblems().map((p) => ({ slug: p.slug }));
}
export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    p = getProblem(slug),
    all = getProblems();
  if (!p) notFound();
  const i = all.findIndex((x) => x.slug === slug),
    prev = all[i - 1],
    next = all[i + 1];
  const headings = [...p.body.matchAll(/^##\s+(.+)$/gm)].map((x) => x[1]);
  return (
    <div className="shell py-6 pb-24">
      <Link
        href="/problems"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="size-4" />
        All problems
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
        <article>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>Problems</span>
            <span>/</span>
            <span>{p.pattern}</span>
            <span>/</span>
            <span>#{p.leetcode}</span>
          </div>
          <div className="mt-3 flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {p.title}
            </h1>
            <FavoriteButton slug={p.slug} initial={p.favorite} compact />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="chip">{p.difficulty}</span>
            <span className="chip">{p.pattern}</span>
            <span className="chip">{p.algorithm}</span>
            <span className="chip">
              <Clock className="mr-1 size-3" />
              {p.readingTime} min read
            </span>
            <ReviewButton slug={p.slug} confidence={p.confidence} />
          </div>
          <div className="mt-8 border-t pt-2">
            <Markdown>{p.body}</Markdown>
          </div>
          {p.resources?.length ? (
            <section className="mt-10">
              <h2 className="text-xl font-bold">Resources</h2>
              {p.resources.map((r) => (
                <a
                  className="mt-3 flex items-center gap-2 text-indigo-600"
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="size-4" />
                  {r.label}
                </a>
              ))}
            </section>
          ) : null}
          <nav className="mt-14 grid gap-3 border-t pt-6 sm:grid-cols-2">
            {prev ? (
              <Link
                className="panel p-4 text-sm"
                href={`/problems/${prev.slug}`}
              >
                <ChevronLeft className="inline size-4" /> Previous
                <br />
                <b>{prev.title}</b>
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link
                className="panel p-4 text-right text-sm"
                href={`/problems/${next.slug}`}
              >
                Next <ChevronRight className="inline size-4" />
                <br />
                <b>{next.title}</b>
              </Link>
            )}
          </nav>
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24 border-l pl-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              On this page
            </p>
            <div className="mt-3 space-y-2">
              {headings.map((h) => (
                <a
                  key={h}
                  href={`#${h.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="block text-sm text-slate-500 hover:text-indigo-600"
                >
                  {h}
                </a>
              ))}
            </div>
            <div className="mt-8 text-sm">
              <b>Complexity</b>
              <p className="mt-2 text-slate-500">{p.timeComplexity} time</p>
              <p className="text-slate-500">{p.spaceComplexity} space</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
