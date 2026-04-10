import Link from "next/link";
import { ReferenceList } from "@/components/reference-list";

export default function ReferencePage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link className="text-sm text-zinc-400 transition hover:text-white" href="/">
          Back to triage
        </Link>
      </div>
      <ReferenceList />
    </>
  );
}
