"use client";

import FileDetailsModal from "@/components/Files/FileDetailsModal";
import MyFileItem from "@/components/Files/MyFileItem";
import Navbar from "@/components/Navbar/Navbar";
import {
  useDeleteFileMutation,
  useGetMyFilesQuery,
} from "@/features/file/file.api";
import {
  MyFileInterface,
  FileVisibility,
} from "@/features/file/file.interface";
import {
  ChevronLeft,
  ChevronRight,
  File,
  FileText,
  Search,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MyFilesPage = () => {
  const [deleteFile] = useDeleteFileMutation();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<MyFileInterface | null>(
    null,
  );

  const [visibility, setVisibility] = useState<"ALL" | FileVisibility>("ALL");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [files, setFiles] = useState<MyFileInterface[]>([]);

  const limit = 5;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setSearchQuery(search.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, isFetching } = useGetMyFilesQuery({
    limit,
    page,
    search: searchQuery,
    visibility: visibility === "ALL" ? undefined : visibility,
  });

  const pagination = data?.data?.pagination;

  const handleVisibilityChange = (value: "ALL" | FileVisibility) => {
    setVisibility(value);
    setPage(1);
  };

  const handleDelete = async (fileId: string) => {
    try {
      setDeletingId(fileId);

      const result = await deleteFile(fileId).unwrap();

      if (!result.success) {
        toast.error(result.message || "Failed to delete file.");
      } else {
        toast.success(result.message || "File deleted successfully.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete file.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (fileId: string) => {};

  const showLoading = isLoading || isFetching;

  useEffect(() => {
    if (data?.success) {
      setFiles(data.data.files);
    }
  }, [data]);

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
              <>
                <div className="divide-y divide-border">
                  {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                        <FileText className="h-7 w-7 text-primary-light" />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-white">
                        No files yet
                      </h3>

                      <p className="mt-1 text-xs text-muted">
                        Upload your first file to get started.
                      </p>
                    </div>
                  ) : (
                    files.map((file) => (
                      <MyFileItem
                        key={file.id}
                        file={file}
                        deletingId={deletingId}
                        onDownload={handleDownload}
                        onDelete={handleDelete}
                        onClick={setSelectedFile}
                      />
                    ))
                  )}
                </div>

                <FileDetailsModal
                  file={selectedFile}
                  onClose={() => setSelectedFile(null)}
                />
              </>
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
