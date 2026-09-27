"use client";

import { MyFileInterface } from "@/features/file/file.interface";
import {
  formatDate,
  formatFileSize,
  getFileIcon,
} from "@/lib/utils/file.utils";
import { Download, Loader2, Share2, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { toast } from "react-toastify";

interface MyFileItemProps {
  file: MyFileInterface;
  deletingId: string | null;
  onDelete: (id: string) => void;
  onClick: (file: MyFileInterface) => void;
}

const MyFileItem = ({
  file,
  deletingId,
  onDelete,
  onClick,
}: MyFileItemProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const downloadFile = async (fileId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/file/${fileId}/download`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      throw new Error(error?.message || "Failed to download file.");
    }

    return response.blob();
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const blob = await downloadFile(file.id);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.originalName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to download file.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const FileIcon = getFileIcon(file.mimeType);
  const isDeleting = deletingId === file.id;

  const handleDelete = () => {
    onDelete(file.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        onClick={() => onClick(file)}
        className="group grid cursor-pointer grid-cols-1 gap-3 border-b border-border px-5 py-4 transition last:border-0 hover:bg-white/2.5 md:grid-cols-[minmax(0,2fr)_160px_120px_96px] md:items-center md:gap-0"
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

        <div
          className="hidden items-center justify-end gap-1 md:flex"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleDownload}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-white"
            title="Download"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
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

      <DeleteConfirmModal
        open={showDeleteModal}
        fileName={file.originalName}
        isDeleting={isDeleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default MyFileItem;
