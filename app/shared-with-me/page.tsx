"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useGetReceivedFilesQuery } from "@/features/file/file.api";
import { ReceivedFileInterface } from "@/features/file/file.interface";
import {
  formatDate,
  formatFileSize,
  getFileIcon,
} from "@/lib/utils/file.utils";
import { ArrowDownToLine, Eye, FolderOpen, Search, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const SharedWithMePage = () => {
  const [search, setSearch] = useState("");
  const [files, setFiles] = useState<ReceivedFileInterface[]>([]);

  const { data, isLoading } = useGetReceivedFilesQuery();

  const filteredFiles = useMemo(() => {
    if (!search.trim()) return files;

    return files.filter((file) =>
      file.originalName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [files, search]);

  useEffect(() => {
    if (isLoading) return;

    if (data) {
      setFiles(data?.data?.files || []);
    }
  }, [data, isLoading]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#080b10] mt-8 px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-primary/10">
                  <Share2 className="h-5 w-5 text-primary-light" />
                </div>

                <div>
                  <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Shared with Me
                  </h1>

                  <p className="mt-1 text-sm text-muted">
                    Files that other people have shared with you
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search shared files..."
                className="h-11 w-full rounded-xl border border-border bg-[#0d1117] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-muted focus:border-primary/50"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-[#0d1117]/80">
              <div className="hidden grid-cols-[minmax(0,1fr)_minmax(180px,240px)_140px_88px] items-center gap-6 border-b border-border px-5 py-3 text-xs font-medium text-muted sm:grid">
                <span>File</span>
                <span>Shared by</span>
                <span>Date</span>
                <span className="text-right">Actions</span>
              </div>

              <div className="divide-y divide-border">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="grid gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(180px,240px)_140px_88px] sm:items-center sm:gap-6 sm:px-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-white/5" />

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-3.5 w-40 animate-pulse rounded bg-white/5" />
                        <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-3.5 w-28 animate-pulse rounded bg-white/5" />
                      <div className="h-3 w-36 animate-pulse rounded bg-white/5" />
                    </div>

                    <div className="h-3 w-20 animate-pulse rounded bg-white/5" />

                    <div className="flex justify-end gap-1">
                      <div className="h-8 w-8 animate-pulse rounded-lg bg-white/5" />
                      <div className="h-8 w-8 animate-pulse rounded-lg bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-[#0d1117]/80">
              <div className="hidden grid-cols-[minmax(0,1fr)_minmax(180px,240px)_140px_88px] items-center gap-6 border-b border-border px-5 py-3 text-xs font-medium text-muted sm:grid">
                <span>File</span>
                <span>Shared by</span>
                <span>Date</span>
                <span className="text-right">Actions</span>
              </div>

              <div className="divide-y divide-border">
                {filteredFiles.map((file) => {
                  const Icon = getFileIcon(file.mimeType);

                  return (
                    <div
                      key={file.id}
                      className="grid gap-4 px-4 py-4 transition hover:bg-white/2 sm:grid-cols-[minmax(0,1fr)_minmax(180px,240px)_140px_88px] sm:items-center sm:gap-6 sm:px-5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10">
                          <Icon className="h-5 w-5 text-primary-light" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate text-sm font-medium text-white"
                            title={file.originalName}
                          >
                            {file.originalName}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {formatFileSize(file.size.toString())}
                          </p>
                        </div>
                      </div>

                      <div className="min-w-0 pl-13 sm:pl-0">
                        <p
                          className="truncate text-sm font-medium text-white"
                          title={file.owner.name}
                        >
                          {file.owner.name}
                        </p>

                        <p
                          className="truncate text-xs text-muted"
                          title={file.owner.email}
                        >
                          {file.owner.email}
                        </p>
                      </div>

                      <div className="pl-13 sm:pl-0">
                        <p className="text-xs text-muted">
                          {formatDate(file.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center justify-start gap-1 pl-13 sm:justify-end sm:pl-0">
                        <button
                          type="button"
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-white"
                          title="View file"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-white"
                          title="Download"
                        >
                          <ArrowDownToLine className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex min-h-105 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-[#0d1117]/50 px-6 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-[#0d1117]">
                  <FolderOpen className="h-8 w-8 text-primary-light" />
                </div>
              </div>

              <h2 className="text-lg font-semibold text-white">
                {search ? "No files found" : "Nothing shared yet"}
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                {search
                  ? "Try searching with a different file name."
                  : "Files that other people share with you will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SharedWithMePage;
