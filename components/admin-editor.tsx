"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Download, FilePlus2, Trash2 } from "lucide-react";
import { Markdown } from "./markdown";
import type { Draft } from "@/lib/types";
import { DriveSaveButton } from "./drive-save-button";
import { TagInput } from "./tag-input";
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-72 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
  ),
});
const sections = [
  "Recognition",
  "Interview Trigger Words",
  "Brute Force",
  "Better Solution",
  "Optimal Solution",
  "Core Intuition",
  "Visualization",
  "Algorithm",
  "Dry Run",
  "Complexity",
  "Common Mistakes",
  "Variants",
  "Related Problems",
  "Interview Mantra",
  "Notes",
];
const today = () => new Date().toISOString().slice(0, 10);
const afterDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};
const fresh = (): Draft => ({
  slug: "new-problem",
  title: "Untitled Problem",
  leetcode: undefined,
  difficulty: "Medium",
  pattern: "",
  algorithm: "",
  datastructure: "",
  companies: [],
  tags: [],
  status: "Todo",
  favorite: false,
  confidence: 3,
  lastSolved: today(),
  revision: afterDays(7),
  sections: Object.fromEntries(sections.map((s) => [s, ""])),
  code: { Java: "", Kotlin: "", Python: "", "C++": "", JavaScript: "" },
});
const yaml = (d: Draft) =>
  `---\ntitle: ${d.title}\nleetcode: ${d.leetcode || ""}\ndifficulty: ${d.difficulty}\npattern: ${d.pattern}\nalgorithm: ${d.algorithm}\ndatastructure: ${d.datastructure}\ncompanies: [${d.companies.join(", ")}]\ntags: [${d.tags.join(", ")}]\nstatus: ${d.status}\nfavorite: ${d.favorite}\nconfidence: ${d.confidence}\nrevision: ${d.revision}\nlastSolved: ${d.lastSolved}\n---\n\n`;
export function AdminEditor() {
  const [draft, setDraft] = useState<Draft>(fresh),
    [tab, setTab] = useState("General"),
    [language, setLanguage] = useState("Java");
  useEffect(() => {
    const saved = localStorage.getItem("dsa-vault-draft");
    if (saved) setDraft(JSON.parse(saved));
  }, []);
  useEffect(
    () => localStorage.setItem("dsa-vault-draft", JSON.stringify(draft)),
    [draft],
  );
  const mdx = useMemo(
    () =>
      yaml(draft) +
      sections
        .filter((s) => draft.sections[s]?.trim())
        .map((s) => `## ${s}\n\n${draft.sections[s]}`)
        .join("\n\n") +
      (draft.code[language]?.trim()
        ? `\n\n## Code (${language})\n\n\`\`\`${language.toLowerCase()}\n${draft.code[language]}\n\`\`\``
        : ""),
    [draft, language],
  );
  const update = (key: string, value: unknown) =>
    setDraft((d) => ({ ...d, [key]: value }));
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([mdx], { type: "text/markdown" }));
    a.download = `${draft.slug || "problem"}.mdx`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)]">
      <aside className="panel flex gap-1 overflow-x-auto p-2 lg:flex-col">
        {["General", "Explanation", "Code", "Preview"].map((x) => (
          <button
            key={x}
            onClick={() => setTab(x)}
            className={`rounded-lg px-3 py-2 text-left text-sm ${tab === x ? "bg-indigo-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          >
            {x}
          </button>
        ))}
        <div className="grow" />
        <button
          onClick={() => setDraft(fresh())}
          className="rounded-lg px-3 py-2 text-left text-sm text-indigo-600"
        >
          <FilePlus2 className="mr-2 inline size-4" />
          New
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("dsa-vault-draft");
            setDraft(fresh());
          }}
          className="rounded-lg px-3 py-2 text-left text-sm text-rose-600"
        >
          <Trash2 className="mr-2 inline size-4" />
          Clear
        </button>
      </aside>
      <section className="panel min-w-0 p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{tab} editor</h1>
            <p className="text-sm text-slate-500">
              Autosaved locally in this browser.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <DriveSaveButton slug={draft.slug} mdx={mdx} />
            <button
              onClick={download}
              className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
            >
              <Download className="mr-1 inline size-4" />
              Export MDX
            </button>
          </div>
        </div>
        {tab === "General" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["title", "Title"],
              ["slug", "Filename slug"],
              ["leetcode", "LeetCode number"],
              ["pattern", "Pattern"],
              ["algorithm", "Algorithm"],
              ["datastructure", "Data structure"],
              ["companies", "Companies (comma-separated)"],
              ["lastSolved", "Last solved"],
              ["revision", "Next revision"],
            ].map(([key, label]) => (
              <label key={key} className="text-sm font-medium">
                {label}
                <input
                  value={
                    Array.isArray(draft[key as keyof Draft])
                      ? (draft[key as keyof Draft] as string[]).join(", ")
                      : String(draft[key as keyof Draft] || "")
                  }
                  onChange={(e) =>
                    update(
                      key,
                      key === "companies"
                        ? e.target.value
                            .split(",")
                            .map((x) => x.trim())
                            .filter(Boolean)
                        : key === "leetcode"
                          ? Number(e.target.value) || undefined
                          : e.target.value,
                    )
                  }
                  type={
                    key === "lastSolved" || key === "revision" ? "date" : "text"
                  }
                  className="mt-1 block h-10 w-full rounded-lg border bg-transparent px-3 font-normal outline-none focus:border-indigo-500"
                />
              </label>
            ))}
            <TagInput
              value={draft.tags}
              onChange={(tags) => update("tags", tags)}
            />
            <label className="text-sm font-medium">
              Difficulty
              <select
                value={draft.difficulty}
                onChange={(e) => update("difficulty", e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border bg-transparent px-3"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Status
              <select
                value={draft.status}
                onChange={(e) => update("status", e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border bg-transparent px-3"
              >
                <option>Todo</option>
                <option>Learning</option>
                <option>Solved</option>
              </select>
            </label>
          </div>
        )}
        {tab === "Explanation" && (
          <div className="space-y-3">
            {sections.map((s) => (
              <details
                key={s}
                open={!!draft.sections[s]}
                className="rounded-xl border p-3"
              >
                <summary className="cursor-pointer font-medium">{s}</summary>
                <textarea
                  value={draft.sections[s]}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      sections: { ...d.sections, [s]: e.target.value },
                    }))
                  }
                  placeholder={`Write ${s} in MarkdownÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦`}
                  className="mt-3 min-h-28 w-full resize-y rounded-lg bg-slate-50 p-3 text-sm outline-none dark:bg-slate-800"
                />
              </details>
            ))}
          </div>
        )}
        {tab === "Code" && (
          <>
            <div className="mb-3 flex gap-2 overflow-x-auto">
              {Object.keys(draft.code).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`chip ${language === l ? "border-indigo-500 bg-indigo-50 text-indigo-700" : ""}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <Editor
              height="480px"
              language={language === "C++" ? "cpp" : language.toLowerCase()}
              value={draft.code[language]}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  code: { ...d.code, [language]: v || "" },
                }))
              }
              theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </>
        )}
        {tab === "Preview" && (
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="chip">{draft.difficulty}</span>
              <span className="chip">{draft.pattern || "Pattern"}</span>
            </div>
            <Markdown>{mdx.replace(/^---[\s\S]*?---\s*/, "")}</Markdown>
          </div>
        )}
      </section>
    </div>
  );
}
