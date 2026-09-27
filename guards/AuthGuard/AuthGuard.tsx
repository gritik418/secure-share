"use client";

import { useGetMeQuery } from "@/features/auth/auth.api";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const PUBLIC_ROUTES = ["/login", "/register"];

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, isFetching, isError } = useGetMeQuery();

  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthenticated = Boolean(data?.success && data?.data);

  useEffect(() => {
    if (isLoading || isFetching) return;

    if (isPublicRoute) {
      if (isAuthenticated) {
        router.replace("/");
      }

      return;
    }

    if (isError || !isAuthenticated) {
      router.replace("/login");
    }
  }, [
    data,
    isLoading,
    isFetching,
    isError,
    isPublicRoute,
    isAuthenticated,
    router,
  ]);

  if (isLoading || isFetching) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isPublicRoute && isAuthenticated) {
    return null;
  }

  if (!isPublicRoute && (isError || !isAuthenticated)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
