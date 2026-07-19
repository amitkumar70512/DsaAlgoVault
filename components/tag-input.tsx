"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";
const defaults = [
  "array",
  "string",
  "hash-map",
  "sliding-window",
  "two-pointers",
  "binary-search",
  "tree",
  "linked-list",
  "stack",
  "queue",
  "heap",
  "graph",
  "bfs",
  "dfs",
  "dynamic-programming",
  "backtracking",
  "greedy",
  "trie",
  "prefix-sum",
  "bit-manipulation",
  "recursion",
  "interview-classic",
];
export function TagInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [custom, setCustom] = useState("");
  const add = (tag: string) => {
    const normalized = tag.trim().toLowerCase().replace(/\s+/g, "-");
    if (normalized && !value.includes(normalized))
      onChange([...value, normalized]);
    setCustom("");
  };
  return (
    <div className="sm:col-span-2">
      <p className="text-sm font-medium">Tags</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(value.filter((x) => x !== tag))}
            className="inline-flex min-h-8 items-center gap-1 rounded-md bg-indigo-100 px-2 text-xs text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
          >
            #{tag}
            <X className="size-3" />
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {defaults
          .filter((tag) => !value.includes(tag))
          .map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => add(tag)}
              className="min-h-8 rounded-md border px-2 text-xs hover:border-indigo-400 hover:text-indigo-600"
            >
              + {tag}
            </button>
          ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(custom);
            }
          }}
          placeholder="Add a custom tag"
          className="h-10 min-w-0 flex-1 rounded-lg border bg-transparent px-3 text-sm outline-none focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={() => add(custom)}
          className="inline-flex min-h-10 items-center gap-1 rounded-lg border px-3 text-sm font-medium"
        >
          <Plus className="size-4" />
          Add
        </button>
      </div>
    </div>
  );
}
