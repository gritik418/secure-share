"use client";

import { Bell, CloudUpload, File, FolderOpen, ShieldCheck } from "lucide-react";

import ProfileMenu from "./ProfileMenu";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-10">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/25">
              <ShieldCheck className="h-5 w-5 text-primary-light" />
            </div>

            <span className="hidden text-[15px] font-semibold tracking-tight sm:block">
              SecureShare
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            <a
              href="/files"
              className="flex items-center gap-2 rounded-lg bg-white/5 px-3.5 py-2 text-sm font-medium text-white"
            >
              <File className="h-4 w-4 text-primary-light" />
              My Files
            </a>

            <a
              href="/shared"
              className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-muted transition hover:bg-white/4 hover:text-white"
            >
              <FolderOpen className="h-4 w-4" />
              Shared with me
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="hidden h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/15 transition hover:bg-primary-dark sm:flex">
            <CloudUpload className="h-4 w-4" />
            Upload
          </button>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-white">
            <Bell className="h-4.5 w-4.5" />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary-light ring-2 ring-background" />
          </button>

          <ProfileMenu
            name="Ritik Gupta"
            email="[EMAIL_ADDRESS]"
            initials="RG"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
