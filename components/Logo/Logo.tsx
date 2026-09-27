import { ShieldCheck } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex flex-row items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
        <ShieldCheck className="h-5 w-5 text-primary-light" />
      </div>

      <span className="text-lg font-semibold tracking-tight">SecureShare</span>
    </div>
  );
};

export default Logo;
