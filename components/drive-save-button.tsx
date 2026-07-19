"use client";
import { useState } from "react";
import { CloudUpload, LoaderCircle } from "lucide-react";

const CLIENT_ID =
  "777327125173-0c4rhenu1egc72f5god06lqq5lbkhs6p.apps.googleusercontent.com";
const FOLDER_ID = "1-JJjtEwOJ_FG80LYmZitw3cvFPE6Tvbn";
const SCOPE = "https://www.googleapis.com/auth/drive.file";
declare global {
  interface Window {
    google?: any;
  }
}
const loadIdentity = () =>
  new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve();
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Google Identity Services could not load."));
    document.head.appendChild(script);
  });
const fileIds = () => {
  try {
    return JSON.parse(
      localStorage.getItem("dsa-vault-drive-files") || "{}",
    ) as Record<string, string>;
  } catch {
    return {};
  }
};
const multipart = (metadata: object, content: string) => {
  const b = `dsa-vault-${crypto.randomUUID()}`;
  return {
    body: `--${b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${b}\r\nContent-Type: text/markdown; charset=UTF-8\r\n\r\n${content}\r\n--${b}--`,
    boundary: b,
  };
};
export function DriveSaveButton({ slug, mdx }: { slug: string; mdx: string }) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const save = async (token: string) => {
    const ids = fileIds(),
      existing = ids[slug],
      data = multipart(
        {
          name: `${slug || "problem"}.mdx`,
          mimeType: "text/markdown",
          ...(existing ? {} : { parents: [FOLDER_ID] }),
        },
        mdx,
      );
    const url = existing
      ? `https://www.googleapis.com/upload/drive/v3/files/${existing}?uploadType=multipart&fields=id,webViewLink`
      : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink";
    const res = await fetch(url, {
      method: existing ? "PATCH" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${data.boundary}`,
      },
      body: data.body,
    });
    if (!res.ok) throw new Error(await res.text());
    const result = await res.json();
    if (!existing) {
      ids[slug] = result.id;
      localStorage.setItem("dsa-vault-drive-files", JSON.stringify(ids));
    }
    setMessage(existing ? "Updated in Google Drive" : "Saved to Google Drive");
  };
  const connectAndSave = async () => {
    try {
      setBusy(true);
      setMessage("");
      await loadIdentity();
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: async (response: any) => {
          try {
            if (response.error) throw new Error(response.error);
            await save(response.access_token);
          } catch (error) {
            setMessage(
              error instanceof Error ? error.message : "Drive save failed.",
            );
          } finally {
            setBusy(false);
          }
        },
      });
      client.requestAccessToken();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not connect to Google Drive.",
      );
      setBusy(false);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={connectAndSave}
        disabled={busy}
        className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-200"
      >
        {busy ? (
          <LoaderCircle className="mr-1 inline size-4 animate-spin" />
        ) : (
          <CloudUpload className="mr-1 inline size-4" />
        )}
        {busy ? "Savingâ€¦" : "Save to Drive"}
      </button>
      {message && (
        <span className="max-w-44 text-xs text-slate-500">{message}</span>
      )}
    </div>
  );
}
