"use client";

import { Check, LinkIcon, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface LinkModalProps {
  accessLink: string;
  setShowLinkModal: (value: boolean) => void;
}

const LinkModal = ({ accessLink, setShowLinkModal }: LinkModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (!accessLink) return;

    await navigator.clipboard.writeText(accessLink);

    setCopied(true);
    toast.success("Link copied to clipboard.");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <LinkIcon className="h-5 w-5 text-primary-light" />
              </div>

              <div>
                <h2 className="text-sm font-semibold">
                  Your file is ready to share
                </h2>

                <p className="mt-1 text-xs text-muted">
                  Anyone with this link can access the file.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowLinkModal(false)}
              className="flex cursor-pointer h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-background-secondary/60 p-3">
            <div className="flex items-center gap-3">
              <p className="min-w-0 flex-1 truncate text-xs text-muted-light">
                {accessLink}
              </p>

              <button
                onClick={handleCopyLink}
                className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2.5 text-xs text-amber-300">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />

            <p>Anyone who has this link will be able to access your file.</p>
          </div>

          <button
            onClick={() => setShowLinkModal(false)}
            className="mt-5 cursor-pointer w-full rounded-xl border border-border py-2.5 text-sm font-medium text-muted transition hover:bg-surface-hover hover:text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkModal;
