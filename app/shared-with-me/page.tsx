"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useGetReceivedFilesQuery } from "@/features/file/file.api";
import {
  formatDate,
  formatFileSize,
  getFileIcon,
} from "@/lib/utils/file.utils";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  File,
  Loader2,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SharedWithMePage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [viewingId, setViewingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const limit = 5;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setSearchQuery(search.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, isFetching } = useGetReceivedFilesQuery({
    limit,
    page,
    search: searchQuery,
  });

  const files = data?.data?.files || [];
  const pagination = data?.data?.pagination;

  const showLoading = isLoading || isFetching;

  const handleView = async (fileId: string) => {
    const newTab = window.open("", "_blank");

    if (!newTab) {
      toast.error("Please allow popups to view the file.");
      return;
    }

    try {
      setViewingId(fileId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/file/${fileId}/view`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(error?.message || "Failed to open file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      newTab.location.href = url;

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 60000);
    } catch (error) {
      newTab.close();

      toast.error(
        error instanceof Error ? error.message : "Failed to open file.",
      );
    } finally {
      setViewingId(null);
    }
  };

  const handleDownload = async (fileId: string, originalName: string) => {
    try {
      setDownloadingId(fileId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/file/${fileId}/view`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(error?.message || "Failed to download file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = originalName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to download file.",
      );
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#080b10] px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-360 px-5 py-8 sm:px-8 lg:py-10">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold text-primary-light">
                Shared files
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Shared with Me
              </h1>

              <p className="mt-2 text-sm text-muted">
                Files that other people have shared with you.
              </p>
            </div>
          </div>

          <div className="mb-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search shared files..."
                className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-muted focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface/70">
            <div className="hidden border-b border-border px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-muted md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_120px_96px] md:items-center">
              <span>File</span>
              <span>Shared by</span>
              <span>Uploaded</span>
              <span className="text-right">Actions</span>
            </div>

            {showLoading ? (
              <div>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-3 border-b border-border px-5 py-4 last:border-0 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_120px_96px] md:items-center md:gap-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-white/5" />

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-4 w-1/3 animate-pulse rounded bg-white/5" />
                        <div className="h-3 w-1/4 animate-pulse rounded bg-white/5" />
                      </div>
                    </div>

                    <div className="hidden space-y-2 md:block">
                      <div className="h-4 w-28 animate-pulse rounded bg-white/5" />
                      <div className="h-3 w-36 animate-pulse rounded bg-white/5" />
                    </div>

                    <div className="hidden h-4 w-20 animate-pulse rounded bg-white/5 md:block" />

                    <div className="hidden h-9 w-20 animate-pulse rounded bg-white/5 md:block" />
                  </div>
                ))}
              </div>
            ) : files.length === 0 ? (
              <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white/5">
                  <File className="h-6 w-6 text-muted" />
                </div>

                <h3 className="text-sm font-semibold text-white">
                  {searchQuery ? "No files found" : "No shared files yet"}
                </h3>

                <p className="mt-1.5 max-w-sm text-sm text-muted">
                  {searchQuery
                    ? "Try changing your search."
                    : "Files shared with you will appear here."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {files.map((file) => {
                  const Icon = getFileIcon(file.mimeType);

                  const isViewing = viewingId === file.id;
                  const isDownloading = downloadingId === file.id;

                  return (
                    <div
                      key={file.id}
                      className="grid grid-cols-1 gap-3 px-5 py-4 transition hover:bg-white/2 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_120px_96px] md:items-center md:gap-0"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10">
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

                      <div className="min-w-0 md:pr-4">
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

                      <div>
                        <p className="text-sm text-muted">
                          {formatDate(file.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center justify-start gap-1 md:justify-end">
                        <button
                          type="button"
                          onClick={() => handleView(file.id)}
                          disabled={isViewing || isDownloading}
                          title="View file"
                          className="flex h-9 w-9 items-center cursor-pointer justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isViewing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDownload(file.id, file.originalName)
                          }
                          disabled={isViewing || isDownloading}
                          title="Download file"
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDownloading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!showLoading && pagination && pagination.total > 0 && (
              <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted">
                  Showing{" "}
                  <span className="font-medium text-white">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-white">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-white">
                    {pagination.total}
                  </span>{" "}
                  files
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((current) => current - 1)}
                    disabled={
                      !pagination.hasPreviousPage ||
                      isFetching ||
                      !!viewingId ||
                      !!downloadingId
                    }
                    className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-white/5 px-3 text-sm font-medium text-white">
                    {pagination.page}
                  </span>

                  <button
                    onClick={() => setPage((current) => current + 1)}
                    disabled={
                      !pagination.hasNextPage ||
                      isFetching ||
                      !!viewingId ||
                      !!downloadingId
                    }
                    className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default SharedWithMePage;
