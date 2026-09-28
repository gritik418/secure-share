import { useLogoutMutation } from "@/features/auth/auth.api";
import { AppDispatch } from "@/store";
import baseApi from "@/store/api/base-api";
import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface ProfileMenuProps {
  name: string;
  email: string;
  initials: string;
}

const ProfileMenu = ({ name, email, initials }: ProfileMenuProps) => {
  const [logout] = useLogoutMutation();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      const result = await logout().unwrap();

      if (!result.success) {
        toast.error(result.message || "Failed to logout.");
      } else {
        toast.success(result.message || "Logged out successfully.");

        dispatch(baseApi.util.resetApiState());
        router.push("/login");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to logout.");
    }
  };

  return (
    <div className="relative ml-1">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-2 py-1.5 transition hover:border-white/15"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-semibold text-primary-light">
          {initials}
        </div>

        <div className="hidden text-left sm:block">
          <p className="text-xs font-medium text-white">{name}</p>
          <p className="text-[10px] text-muted">{email}</p>
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
            <p className="text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-muted">{email}</p>
          </div>

          <div className="border-t border-border pt-1">
            <button
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
            >
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
