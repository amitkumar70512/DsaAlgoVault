import { AdminEditor } from "@/components/admin-editor";
export const metadata = { title: "Admin Mode" };
export default function Admin() {
  return (
    <div className="shell py-8 pb-24">
      <p className="text-sm font-medium text-indigo-600">
        Browser-only workspace
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Admin Mode</h1>
      <p className="mt-2 max-w-2xl text-slate-500">
        Create documentation-style problem notes without a backend. Drafts stay
        in LocalStorage until you export a portable MDX file.
      </p>
      <div className="mt-7">
        <AdminEditor />
      </div>
    </div>
  );
}
