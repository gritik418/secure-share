"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  fileName?: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal = ({
  open,
  fileName,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={isDeleting ? undefined : onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-[#0d1117] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">Delete file</h2>
              <p className="text-xs text-muted">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <p className="text-sm leading-6 text-muted">
            Are you sure you want to delete{" "}
            <span className="font-medium text-white">
              {fileName || "this file"}
            </span>
            ? The file and its access permissions will be permanently removed.
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="h-9 cursor-pointer rounded-lg border border-border px-4 text-xs font-medium text-muted transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-red-500 px-4 text-xs font-medium text-white transition hover:bg-red-500/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
