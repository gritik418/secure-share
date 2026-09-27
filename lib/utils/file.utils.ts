import {
  File,
  FileArchive,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
} from "lucide-react";

export const getFileIcon = (mimeType: string) => {
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

export const formatFileSize = (size: string) => {
  const bytes = Number(size);

  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];

  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(
    index === 0 ? 0 : 1,
  )} ${units[index]}`;
};

export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};
