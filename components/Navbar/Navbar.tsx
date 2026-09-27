"use client";

import { selectUser } from "@/features/auth/auth.slice";
import { CloudUpload, File, FolderOpen, LogIn } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import Logo from "../Logo/Logo";
import ProfileMenu from "./ProfileMenu";

const Navbar = () => {
  const user = useSelector(selectUser);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-10">
          <Logo />

          {user && user.id ? (
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                href="/files"
                className="flex items-center gap-2 rounded-lg bg-white/5 px-3.5 py-2 text-sm font-medium text-white"
              >
                <File className="h-4 w-4 text-primary-light" />
                My Files
              </Link>

              <Link
                href="/shared"
                className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-muted transition hover:bg-white/4 hover:text-white"
              >
                <FolderOpen className="h-4 w-4" />
                Shared with me
              </Link>
            </nav>
          ) : null}
        </div>

        <div className="flex items-center gap-2.5">
          {user && user.id ? (
            <>
              <button className="hidden h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/15 transition hover:bg-primary-dark sm:flex">
                <CloudUpload className="h-4 w-4" />
                Upload
              </button>

              <ProfileMenu
                name={user?.name || "User"}
                email={user?.email || ""}
                initials={user?.name.charAt(0).toUpperCase() || ""}
              />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg flex items-center justify-center gap-2 bg-primary px-2 py-2 text-sm font-bold text-white"
            >
              <LogIn className="h-4 w-4" /> Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
