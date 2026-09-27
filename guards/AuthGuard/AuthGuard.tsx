"use client";

import { useGetMeQuery } from "@/features/auth/auth.api";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const PUBLIC_ROUTES = ["/login", "/register"];

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, isError } = useGetMeQuery();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (PUBLIC_ROUTES.includes(pathname)) {
      if (data?.success && data.data) {
        router.push("/");
      }
    } else {
      if (isError || !data?.success) {
        router.push("/login");
      }
    }
  }, [data, isLoading, isError, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
