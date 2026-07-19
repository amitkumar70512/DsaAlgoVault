"use client";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
type Progress = { lastSolved: string; revision: string; revisionCount: number };
const key = "dsa-vault-progress";
const day = (d: Date) => d.toISOString().slice(0, 10);
const read = (): Record<string, Progress> => {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
};
export function ReviewButton({
  slug,
  confidence,
}: {
  slug: string;
  confidence: number;
}) {
  const [done, setDone] = useState(false);
  useEffect(
    () => setDone(read()[slug]?.lastSolved === day(new Date())),
    [slug],
  );
  const revise = () => {
    const now = new Date(),
      days =
        confidence >= 5
          ? 21
          : confidence === 4
            ? 14
            : confidence === 3
              ? 7
              : confidence === 2
                ? 3
                : 1,
      next = new Date(now);
    next.setDate(now.getDate() + days);
    const all = read();
    all[slug] = {
      lastSolved: day(now),
      revision: day(next),
      revisionCount: (all[slug]?.revisionCount || 0) + 1,
    };
    localStorage.setItem(key, JSON.stringify(all));
    setDone(true);
  };
  return (
    <button
      type="button"
      onClick={revise}
      className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm font-medium ${done ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200" : "bg-white hover:border-emerald-400 dark:bg-slate-900"}`}
    >
      <CheckCircle2 className="size-4" />
      {done ? "Revised today" : "Mark revised today"}
    </button>
  );
}
