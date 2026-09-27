"use client";

import { useAddFileMemberMutation } from "@/features/file/file.api";
import { MyFileInterface } from "@/features/file/file.interface";
import {
  formatDate,
  formatFileSize,
  getFileIcon,
} from "@/lib/utils/file.utils";
import { Calendar, Copy, Link2, Mail, Shield, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FileDetailsModalProps {
  file: MyFileInterface | null;
  onClose: () => void;
}

const FileDetailsModal = ({ file, onClose }: FileDetailsModalProps) => {
  const [addMember] = useAddFileMemberMutation();
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sharedEmails, setSharedEmails] = useState<string[]>([]);

  useEffect(() => {
    if (file) {
      setSharedEmails(file.shares?.map((share) => share.email) || []);
    }
  }, [file?.id]);

  if (!file) return null;

  const FileIcon = getFileIcon(file.mimeType);

  const handleAddMember = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) return;

    try {
      setIsSubmitting(true);

      const response = await addMember({
        email: trimmedEmail,
        fileId: file.id,
      }).unwrap();

      if (response.success) {
        setSharedEmails((prev) =>
          prev.includes(trimmedEmail) ? prev : [...prev, trimmedEmail],
        );

        toast.success(response.message || "User added to file successfully.");

        setEmail("");
        setIsAddingMember(false);
      } else {
        toast.error(response.message || "Failed to add user to file.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async (accessLink: string) => {
    if (!accessLink) return;

    await navigator.clipboard.writeText(accessLink);

    toast.success("Link copied to clipboard.");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-[#0d1117] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <FileIcon className="h-5 w-5 text-primary-light" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-white">
                {file.originalName}
              </h2>

              <p className="mt-0.5 text-xs text-muted">
                {formatFileSize(file.size.toString())}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
              File information
            </p>

            <div className="grid grid-cols-2 gap-3">
              <InfoItem label="Type" value={file.mimeType || "Unknown"} />

              <InfoItem
                label="Size"
                value={formatFileSize(file.size.toString())}
              />

              <InfoItem
                label="Uploaded"
                value={formatDate(file.createdAt)}
                icon={<Calendar className="h-3.5 w-3.5" />}
              />

              <InfoItem
                label="Access"
                value={
                  file.visibility === "PRIVATE" ? "Private" : "Anyone with link"
                }
                icon={
                  file.visibility === "PRIVATE" ? (
                    <Shield className="h-3.5 w-3.5" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )
                }
              />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Access
              </p>

              {file.visibility === "PRIVATE" && !isAddingMember && (
                <button
                  onClick={() => setIsAddingMember(true)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary-light transition hover:bg-primary/20"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Add member
                </button>
              )}
            </div>

            {file.visibility === "PRIVATE" ? (
              <div className="rounded-xl border border-border bg-white/2 p-4">
                {isAddingMember ? (
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <UserPlus className="h-4 w-4 text-primary-light" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          Add member
                        </p>

                        <p className="text-xs text-muted">
                          Enter the email address of the member.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddMember();
                            }

                            if (e.key === "Escape") {
                              setIsAddingMember(false);
                              setEmail("");
                            }
                          }}
                          autoFocus
                          placeholder="member@example.com"
                          className="h-10 w-full rounded-lg border border-border bg-white/3 pl-9 pr-3 text-sm text-white outline-none placeholder:text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                        />
                      </div>

                      <button
                        onClick={handleAddMember}
                        disabled={!email.trim() || isSubmitting}
                        className="h-10 cursor-pointer rounded-lg bg-primary px-4 text-xs font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSubmitting ? "Adding..." : "Add"}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingMember(false);
                        setEmail("");
                      }}
                      className="mt-3 place-self-center block bg-gray-300/10 p-2 rounded-md cursor-pointer text-xs text-muted font-semibold transition hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Shield className="h-4 w-4 text-primary-light" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          Private file
                        </p>

                        <p className="text-xs text-muted">
                          Only selected members can access this file.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-border pt-4">
                      <p className="mb-3 text-xs font-medium text-muted">
                        Members with access
                      </p>

                      <div className="flex flex-col gap-3 rounded-lg bg-white/2 px-3 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary-light">
                            You
                          </div>

                          <div>
                            <p className="text-xs font-medium text-white">
                              Owner
                            </p>
                            <p className="text-[11px] text-muted">
                              Full access
                            </p>
                          </div>
                        </div>

                        {sharedEmails.length > 0 && (
                          <div className="max-h-24 space-y-2 overflow-y-auto">
                            {sharedEmails.map((email) => (
                              <div
                                key={email}
                                className="flex items-center gap-3"
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary-light">
                                  {email.charAt(0).toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-xs font-medium text-white">
                                    {email}
                                  </p>

                                  <p className="text-[11px] text-muted">
                                    View only
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {sharedEmails.length === 0 && (
                        <p className="mt-3 text-center text-xs text-muted">
                          No other members have access yet.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : null}

            <div className="rounded-xl mt-4 border border-border bg-white/2 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Link2 className="h-4 w-4 text-primary-light" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">
                    {file.visibility === "PRIVATE"
                      ? "Private file"
                      : "Anyone with the link"}
                  </p>

                  <p className="mt-0.5 text-xs text-muted">
                    {file.visibility === "PRIVATE"
                      ? "Only you and selected members can access."
                      : "Anyone with the link can access."}
                  </p>
                </div>
                <button
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-white"
                  onClick={() => handleCopyLink(file.accessLink)}
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-white/2 p-3">
      <p className="text-[11px] text-muted">{label}</p>

      <div className="mt-1 flex items-center gap-1.5">
        {icon && <span className="text-muted">{icon}</span>}
        <p className="truncate text-xs font-medium text-white">{value}</p>
      </div>
    </div>
  );
}

export default FileDetailsModal;
