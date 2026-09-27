"use client";

import { selectUser } from "@/features/auth/auth.slice";
import { CloudUpload, File, FolderOpen, LogIn, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import Logo from "../Logo/Logo";
import ProfileMenu from "./ProfileMenu";

const Navbar = () => {
  const user = useSelector(selectUser);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navItems = [
    {
      href: "/files",
      label: "My Files",
      icon: File,
    },
    {
      href: "/shared",
      label: "Shared with me",
      icon: FolderOpen,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-10">
          <Logo />

          {user && user.id ? (
            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-white/5 text-white"
                        : "text-muted hover:bg-white/4 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-primary-light" : ""
                      }`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </div>

        <div className="flex items-center gap-2.5">
          {user && user.id ? (
            <>
              <Link
                href="/upload"
                className={`hidden h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition lg:flex ${
                  pathname === "/upload"
                    ? "bg-primary-dark text-white"
                    : "bg-primary text-white shadow-lg shadow-primary/15 hover:bg-primary-dark"
                }`}
              >
                <CloudUpload className="h-4 w-4" />
                Upload
              </Link>

              <ProfileMenu
                name={user?.name || "User"}
                email={user?.email || ""}
                initials={user?.name?.charAt(0).toUpperCase() || ""}
              />

              <button
                onClick={() => setMenuOpen((value) => !value)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-muted transition hover:bg-surface-hover hover:text-white lg:hidden"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          )}
        </div>
      </div>

      {user && user.id && menuOpen && (
        <div className="border-t border-border/80 bg-background/95 px-5 py-3 backdrop-blur-xl lg:hidden">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/5 text-white"
                      : "text-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-primary-light" : ""
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/upload"
              onClick={closeMenu}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                pathname === "/upload"
                  ? "bg-primary/15 text-primary-light"
                  : "text-primary-light hover:bg-primary/10"
              }`}
            >
              <CloudUpload className="h-4 w-4" />
              Upload file
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
