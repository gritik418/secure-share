"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useGetMyFilesQuery } from "@/features/file/file.api";
import { FileVisibility } from "@/features/file/file.interface";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  File,
  FileArchive,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Search,
  Share2,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return FileImage;

  if (mimeType.startsWith("video/")) return FileVideo;

  if (mimeType.startsWith("audio/")) return FileAudio;

  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("7z") ||
    mimeType.includes("tar")
  ) {
    return FileArchive;
  }

  if (
    mimeType.includes("pdf") ||
    mimeType.includes("text") ||
    mimeType.includes("document") ||
    mimeType.includes("word")
  ) {
    return FileText;
  }

  return File;
};

const formatFileSize = (size: string) => {
  const bytes = Number(size);

  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];

  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(
    index === 0 ? 0 : 1,
  )} ${units[index]}`;
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const MyFilesPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [visibility, setVisibility] = useState<"ALL" | FileVisibility>("ALL");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const limit = 5;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setSearchQuery(search.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, isFetching, refetch } = useGetMyFilesQuery({
    limit,
    page,
    search: searchQuery,
    visibility: visibility === "ALL" ? undefined : visibility,
  });

  const files = data?.data?.files ?? [];
  const pagination = data?.data?.pagination;

  const handleVisibilityChange = (value: "ALL" | FileVisibility) => {
    setVisibility(value);
    setPage(1);
  };

  const handleDelete = async (fileId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this file?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(fileId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/file/${fileId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete file.");
      }

      toast.success("File deleted successfully.");

      if (files.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        refetch();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete file.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (fileId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/file/${fileId}?download=true`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(result?.message || "Failed to download file.");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to download file.",
      );
    }
  };

  const showLoading = isLoading || isFetching;

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="mx-auto max-w-360 px-5 py-8 sm:px-8 lg:py-10">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-primary-light">
                File management
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                My Files
              </h1>

              <p className="mt-2 text-sm text-muted">
                Manage and access all your uploaded files.
              </p>
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search files..."
                className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-muted focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="flex overflow-x-auto rounded-xl border border-border bg-surface p-1">
              <button
                onClick={() => handleVisibilityChange("ALL")}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                  visibility === "ALL"
                    ? "bg-white/8 text-white"
                    : "text-muted hover:text-white"
                }`}
              >
                All
              </button>

              <button
                onClick={() => handleVisibilityChange("PRIVATE")}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                  visibility === "PRIVATE"
                    ? "bg-white/8 text-white"
                    : "text-muted hover:text-white"
                }`}
              >
                Private
              </button>

              <button
                onClick={() => handleVisibilityChange("ANYONE_WITH_LINK")}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                  visibility === "ANYONE_WITH_LINK"
                    ? "bg-white/8 text-white"
                    : "text-muted hover:text-white"
                }`}
              >
                Link access
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface/70">
            <div className="hidden border-b border-border px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-muted md:grid md:grid-cols-[minmax(0,2fr)_160px_120px_96px] md:items-center">
              <span>File</span>

              <span>Access</span>

              <span>Uploaded</span>

              <span className="text-right">Actions</span>
            </div>

            {showLoading ? (
              <div>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-3 border-b border-border px-5 py-4 last:border-0 md:grid-cols-[minmax(0,2fr)_160px_120px_96px] md:items-center md:gap-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-white/5" />

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-4 w-1/3 animate-pulse rounded bg-white/5" />

                        <div className="h-3 w-1/4 animate-pulse rounded bg-white/5" />
                      </div>
                    </div>

                    <div className="hidden h-5 w-24 animate-pulse rounded bg-white/5 md:block" />

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
                  {searchQuery || visibility !== "ALL"
                    ? "No files found"
                    : "No files yet"}
                </h3>

                <p className="mt-1.5 max-w-sm text-sm text-muted">
                  {searchQuery || visibility !== "ALL"
                    ? "Try changing your search or filter."
                    : "Upload your first file to start sharing securely."}
                </p>

                {!searchQuery && visibility === "ALL" && (
                  <Link
                    href="/upload"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                  >
                    <Upload className="h-4 w-4" />
                    Upload file
                  </Link>
                )}
              </div>
            ) : (
              files.map((file) => {
                const FileIcon = getFileIcon(file.mimeType);

                const isDeleting = deletingId === file.id;

                return (
                  <div
                    key={file.id}
                    className="group grid grid-cols-1 gap-3 border-b border-border px-5 py-4 transition last:border-0 hover:bg-white/2.5 md:grid-cols-[minmax(0,2fr)_160px_120px_96px] md:items-center md:gap-0"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white/5">
                        <FileIcon className="h-5 w-5 text-primary-light" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          title={file.originalName}
                          className="truncate text-sm font-medium text-white"
                        >
                          {file.originalName}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {formatFileSize(file.size.toString())} ·{" "}
                          {file.mimeType || "Unknown type"}
                        </p>
                      </div>
                    </div>

                    <div className="hidden items-center md:flex">
                      {file.visibility === "PRIVATE" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/5 px-2.5 py-1 text-xs font-medium text-muted">
                          <Shield className="h-3 w-3" />
                          Private
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-light">
                          <Share2 className="h-3 w-3" />
                          Link access
                        </span>
                      )}
                    </div>

                    <div className="hidden text-sm text-muted md:block">
                      {formatDate(file.createdAt)}
                    </div>

                    <div className="hidden items-center justify-end gap-1 md:flex">
                      <button
                        onClick={() => handleDownload(file.id)}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-white"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(file.id)}
                        disabled={isDeleting}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete"
                      >
                        {isDeleting ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                      {file.visibility === "PRIVATE" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/5 px-2.5 py-1 text-xs font-medium text-muted">
                          <Shield className="h-3 w-3" />
                          Private
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-light">
                          <Share2 className="h-3 w-3" />
                          Link access
                        </span>
                      )}

                      <span className="text-xs text-muted">
                        {formatDate(file.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
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
                    disabled={!pagination.hasPreviousPage}
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
                    disabled={!pagination.hasNextPage}
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

export default MyFilesPage;
