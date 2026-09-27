"use client";

import Navbar from "@/components/Navbar/Navbar";
import LinkModal from "@/components/Upload/LinkModal";
import { FileVisibility } from "@/features/file/file.interface";
import {
  Check,
  File,
  FileArchive,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Lock,
  Mail,
  ShieldCheck,
  UploadCloud,
  X,
  Link as LinkIcon,
} from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { toast } from "react-toastify";

const Upload = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState<FileVisibility>("PRIVATE");
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [accessLink, setAccessLink] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setProgress(0);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const addEmail = () => {
    const value = email.trim().toLowerCase();

    if (!value || emails.includes(value)) {
      return;
    }

    setEmails((current) => [...current, value]);
    setEmail("");
  };

  const removeEmail = (value: string) => {
    setEmails((current) => current.filter((item) => item !== value));
  };

  const handleEmailKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addEmail();
    }
  };

  const getFileIcon = () => {
    if (!file) return File;

    if (file.type.startsWith("image/")) return FileImage;
    if (file.type.startsWith("video/")) return FileVideo;
    if (file.type.startsWith("audio/")) return FileAudio;

    if (
      file.type.includes("zip") ||
      file.type.includes("rar") ||
      file.type.includes("7z")
    ) {
      return FileArchive;
    }

    if (file.type.includes("pdf") || file.type.startsWith("text/")) {
      return FileText;
    }

    return File;
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;

    try {
      setIsUploading(true);
      setProgress(0);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("visibility", visibility);

      if (visibility === "PRIVATE") {
        emails.forEach((email) => {
          formData.append("mails", email);
        });
      }

      const xhr = new XMLHttpRequest();

      xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL}/file/upload`);

      xhr.withCredentials = true;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);

          setProgress(percentage);
        }
      };

      xhr.onload = () => {
        let response: {
          success?: boolean;
          message?: string;
          data?: {
            accessLink?: string;
          };
          errors?: Record<string, string>;
        } = {};

        try {
          response = JSON.parse(xhr.responseText);
        } catch {
          response = {};
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100);
          setIsUploading(false);

          toast.success(response.message || "File uploaded successfully.");

          if (visibility === "ANYONE_WITH_LINK" && response?.data?.accessLink) {
            setAccessLink(response?.data.accessLink);
            setShowLinkModal(true);
          }

          return;
        }

        setIsUploading(false);
        setProgress(0);

        if (response.errors) {
          Object.values(response.errors).forEach((message) => {
            toast.error(message);
          });

          return;
        }

        toast.error(response.message || "Upload failed.");
      };

      xhr.onerror = () => {
        setIsUploading(false);
        setProgress(0);

        toast.error("Network error while uploading file.");
      };

      xhr.send(formData);
    } catch (error) {
      setIsUploading(false);
      setProgress(0);

      toast.error("Something went wrong while uploading the file.");
    }
  };

  const resetUpload = () => {
    setFile(null);
    setEmails([]);
    setEmail("");
    setProgress(0);
    setIsUploading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const FileIcon = getFileIcon();

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-72px)] bg-background text-text">
        <div className="mx-auto max-w-260 px-5 py-8 sm:px-8 lg:py-12">
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">
              File sharing
            </p>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Upload a file
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted">
              Upload your file and choose exactly who can access it.
            </p>
          </div>

          <section className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <h2 className="text-sm font-semibold">Select file</h2>

              <p className="mt-1 text-xs font-semibold text-muted">
                Maximum file size is 100 MB
              </p>
            </div>

            <div className="p-5 sm:p-6">
              {!file ? (
                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`group flex min-h-70 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center transition ${
                    isDragging
                      ? "border-primary bg-primary/8"
                      : "border-border-light bg-background-secondary/40 hover:border-primary/50 hover:bg-primary/3"
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    hidden
                    onChange={handleFileChange}
                  />

                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl transition ${
                      isDragging
                        ? "bg-primary/20"
                        : "bg-primary/10 group-hover:bg-primary/15"
                    }`}
                  >
                    <UploadCloud className="h-7 w-7 text-primary-light" />
                  </div>

                  <h3 className="mt-5 text-sm font-semibold">
                    {isDragging
                      ? "Drop your file here"
                      : "Drag & drop your file here"}
                  </h3>

                  <p className="mt-2 text-xs text-muted">
                    or click to browse from your device
                  </p>

                  <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-[11px] text-muted">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Your file is securely uploaded
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-background-secondary/50 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <FileIcon className="h-5 w-5 text-primary-light" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {formatSize(file.size)} · {file.type || "Unknown type"}
                      </p>
                    </div>

                    {!isUploading && progress !== 100 && (
                      <button
                        onClick={resetUpload}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {isUploading && (
                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-muted">Uploading...</span>

                        <span className="font-medium text-primary-light">
                          {progress}%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-200"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {progress === 100 && !isUploading && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                      File uploaded successfully
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8">
                <div className="mb-4">
                  <h2 className="text-sm font-semibold">Who can access it?</h2>

                  <p className="mt-1 text-xs text-muted">
                    Choose how this file can be accessed.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setVisibility("PRIVATE")}
                    className={`rounded-xl cursor-pointer border p-4 text-left transition ${
                      visibility === "PRIVATE"
                        ? "border-primary/50 bg-primary/8"
                        : "border-border bg-background-secondary/40 hover:border-border-light"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Lock className="h-4 w-4 text-primary-light" />
                      </div>

                      {visibility === "PRIVATE" && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>

                    <p className="mt-4 text-sm font-semibold">Private</p>

                    <p className="mt-1 text-xs leading-5 text-muted">
                      Only you and selected people can access this file.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      setVisibility("ANYONE_WITH_LINK");
                      setEmails([]);
                    }}
                    className={`rounded-xl cursor-pointer border p-4 text-left transition ${
                      visibility === "ANYONE_WITH_LINK"
                        ? "border-primary/50 bg-primary/8"
                        : "border-border bg-background-secondary/40 hover:border-border-light"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                        <LinkIcon className="h-4 w-4 text-violet-400" />
                      </div>

                      {visibility === "ANYONE_WITH_LINK" && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>

                    <p className="mt-4 text-sm font-semibold">
                      Anyone with the link
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted">
                      Anyone who has the file link can access it.
                    </p>
                  </button>
                </div>
              </div>

              {visibility === "PRIVATE" && (
                <div className="mt-6">
                  <div className="mb-3">
                    <h2 className="text-sm font-semibold">Share with people</h2>

                    <p className="mt-1 text-xs text-muted">
                      Add the email addresses of SecureShare users.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-background-secondary/50 p-3 transition focus-within:border-primary/50">
                    <div className="flex items-center gap-2">
                      <Mail className="ml-1 h-4 w-4 shrink-0 text-muted" />

                      <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        onKeyDown={handleEmailKeyDown}
                        onBlur={addEmail}
                        placeholder="Enter email address"
                        className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-muted"
                      />

                      <button
                        onClick={addEmail}
                        disabled={!email.trim()}
                        className="rounded-lg cursor-pointer bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-light transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Add
                      </button>
                    </div>

                    {emails.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                        {emails.map((value) => (
                          <div
                            key={value}
                            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5"
                          >
                            <span className="max-w-70 truncate text-xs text-muted-light">
                              {value}
                            </span>

                            <button
                              onClick={() => removeEmail(value)}
                              className="text-muted cursor-pointer transition hover:text-white"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 rounded-xl border border-border bg-background-secondary/40 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold">
                      Your file stays secure
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted">
                      {visibility === "PRIVATE"
                        ? "Only you and the people you explicitly share this file with can access it."
                        : "Anyone with the generated link will be able to access this file."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
                <button
                  onClick={resetUpload}
                  className="h-11 cursor-pointer rounded-xl border border-border px-5 text-sm font-medium text-muted transition hover:bg-surface-hover hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpload}
                  disabled={!file || isUploading || progress === 100}
                  className="flex cursor-pointer h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <UploadCloud className="h-4 w-4" />

                  {isUploading
                    ? "Uploading..."
                    : progress === 100
                      ? "Uploaded"
                      : "Upload file"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {showLinkModal ? (
        <LinkModal
          accessLink={accessLink}
          setShowLinkModal={setShowLinkModal}
        />
      ) : null}
    </>
  );
};

export default Upload;
