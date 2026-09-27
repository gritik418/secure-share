"use client";

import { ArrowLeft, FileLock2, FolderOpen, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FileUnavailableProps {
  title?: string;
  message?: string;
}

const FileUnavailable = ({
  title = "File not accessible",
  message = "This file may have been deleted, moved, or you don't have permission to access it.",
}: FileUnavailableProps) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080b10] px-6">
      <div className="w-full max-w-md text-center">
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-[#0d1117] shadow-xl">
            <FileLock2 className="h-9 w-9 text-primary-light" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
          {message}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={"/"}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FileUnavailable;
