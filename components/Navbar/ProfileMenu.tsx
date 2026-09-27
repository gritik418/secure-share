import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import React from "react";

interface ProfileMenuProps {
  name: string;
  email: string;
  initials: string;
}

const ProfileMenu = ({ name, email, initials }: ProfileMenuProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative ml-1">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl border border-border bg-surface px-2 py-1.5 transition hover:border-white/15"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-semibold text-primary-light">
          RG
        </div>

        <div className="hidden text-left sm:block">
          <p className="text-xs font-medium text-white">Ritik Gupta</p>
          <p className="text-[10px] text-muted">Personal</p>
        </div>

        <ChevronDown
          className={`hidden h-3.5 w-3.5 text-muted transition sm:block ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-52 overflow-hidden rounded-xl border border-border bg-surface/95 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="border-b border-border px-3 py-2.5">
            <p className="text-sm font-medium">Ritik Gupta</p>
            <p className="truncate text-xs text-muted">ritik@example.com</p>
          </div>

          <div className="py-1">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-white">
              <User className="h-4 w-4" />
              Profile
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-white">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>

          <div className="border-t border-border pt-1">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
