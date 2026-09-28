"use client";

import Navbar from "@/components/Navbar/Navbar";
import { selectUser } from "@/features/auth/auth.slice";
import {
  useGetMyFilesQuery,
  useGetReceivedFilesQuery,
} from "@/features/file/file.api";
import {
  ReceivedFileInterface,
  type MyFileInterface,
} from "@/features/file/file.interface";
import {
  formatDate,
  formatFileSize,
  getFileIcon,
} from "@/lib/utils/file.utils";
import {
  ArrowRight,
  Download,
  File,
  FileArchive,
  FileImage,
  FileText,
  FolderOpen,
  Loader2,
  Plus,
  Share2,
  UploadCloud,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Home = () => {
  const user = useSelector(selectUser);
  const [myFiles, setMyFiles] = useState<MyFileInterface[]>([]);
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFileInterface[]>(
    [],
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data, isLoading } = useGetMyFilesQuery({
    limit: 5,
    page: 1,
  });

  const { data: receivedData, isLoading: receivedIsLoading } =
    useGetReceivedFilesQuery({
      limit: 3,
      page: 1,
    });

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 18) {
      return "Good afternoon";
    }

    return "Good evening";
  };

  const getDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
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

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (data?.success) {
      setMyFiles(data.data.files);
    }
  }, [data]);

  useEffect(() => {
    if (receivedIsLoading) {
      return;
    }

    if (receivedData?.success && receivedData?.data) {
      setReceivedFiles(receivedData?.data?.files);
    }
  }, [receivedData]);

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-background text-text">
        <div className="mx-auto max-w-360 px-5 py-8 sm:px-8 lg:py-10">
          <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 text-sm text-muted font-semibold">
                {getDate()}
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {getGreeting()}, {user.name} <span>😊</span>
              </h1>

              <p className="mt-2 text-sm text-muted">
                Here's what's happening with your files.
              </p>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <File className="h-5 w-5 text-primary-light" />
                </div>

                <span className="text-xs text-muted">Total</span>
              </div>

              <p className="mt-5 text-2xl font-bold">
                {user.uploadedFilesCount}
              </p>
              <p className="mt-1 text-xs text-muted">Files uploaded</p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Share2 className="h-5 w-5 text-emerald-400" />
                </div>

                <span className="text-xs text-muted">Active</span>
              </div>

              <p className="mt-5 text-2xl font-bold">{user.sharedByMeCount}</p>
              <p className="mt-1 text-xs text-muted">Files shared</p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                  <Users className="h-5 w-5 text-violet-400" />
                </div>

                <span className="text-xs text-muted">People</span>
              </div>

              <p className="mt-5 text-2xl font-bold">{user.sharedToMeCount}</p>
              <p className="mt-1 text-xs text-muted">Files shared with you</p>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="font-semibold">Recent files</h2>
                  <p className="mt-1 text-xs text-muted">
                    Your latest uploaded files
                  </p>
                </div>

                <Link
                  href="/files"
                  className="flex items-center gap-1 text-xs font-medium text-primary-light transition hover:text-white"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-border">
                {myFiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <FileText className="h-7 w-7 text-primary-light" />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold">No files yet</h3>

                    <p className="mt-1 max-w-sm text-xs text-muted">
                      You haven&apos;t uploaded any files yet. Upload a file to
                      see it here.
                    </p>
                  </div>
                ) : (
                  myFiles.map((file: MyFileInterface) => {
                    const Icon = file.mimeType === "PDF" ? FileText : FileImage;

                    return (
                      <div
                        key={file.id}
                        className="group flex items-center gap-4 px-5 py-4 transition hover:bg-white/2.5"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <Icon className="h-5 w-5 text-primary-light" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {file.originalName}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {file.mimeType} ·{" "}
                            {formatFileSize(file.size.toString())}
                          </p>
                        </div>

                        <p className="hidden text-xs text-muted md:block">
                          {formatDate(file.createdAt)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/6 p-6">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <UploadCloud className="h-5 w-5 text-primary-light" />
                  </div>

                  <h3 className="mt-5 font-semibold">Share a file securely</h3>

                  <p className="mt-2 text-xs leading-5 text-muted">
                    Upload a file and choose exactly who can access it.
                  </p>

                  <Link
                    href={"/upload"}
                    className="mt-5 cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 py-2.5 text-xs font-semibold text-primary-light transition hover:bg-primary/20"
                  >
                    <Plus className="h-4 w-4" />
                    Upload new file
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">Shared with you</h3>
                    <p className="mt-1 text-xs text-muted">Recently received</p>
                  </div>

                  <Users className="h-4 w-4 text-muted" />
                </div>

                <div className="mt-5 space-y-4">
                  {receivedIsLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-white/5" />

                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-3 w-32 animate-pulse rounded bg-white/5" />
                          <div className="h-2.5 w-24 animate-pulse rounded bg-white/5" />
                        </div>

                        <div className="h-4 w-4 animate-pulse rounded bg-white/5" />
                      </div>
                    ))
                  ) : receivedFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/4">
                        <FolderOpen className="h-4 w-4 text-muted" />
                      </div>

                      <p className="mt-3 text-xs font-medium text-white">
                        No files shared with you
                      </p>

                      <p className="mt-1 text-[10px] text-muted">
                        Files shared with you will appear here.
                      </p>
                    </div>
                  ) : (
                    receivedFiles.map((file: ReceivedFileInterface) => {
                      const Icon = getFileIcon(file.mimeType);
                      const isDownloading = downloadingId === file.id;

                      return (
                        <div key={file.id} className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/4">
                            <Icon className="h-4 w-4 text-muted" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className="truncate text-xs font-medium"
                              title={file.originalName}
                            >
                              {file.originalName}
                            </p>

                            <p
                              className="mt-1 truncate text-[10px] text-muted"
                              title={file.owner.email}
                            >
                              Shared by {file.owner.name}
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={isDownloading}
                            onClick={() =>
                              handleDownload(file.id, file.originalName)
                            }
                            className="shrink-0 cursor-pointer text-muted transition hover:text-primary-light disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDownloading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;
