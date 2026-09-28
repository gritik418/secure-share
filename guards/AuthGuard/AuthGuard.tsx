"use client";

import { useGetMeQuery } from "@/features/auth/auth.api";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const PUBLIC_ROUTES = ["/login", "/register"];

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  const { data, isLoading, isFetching, isError } = useGetMeQuery(undefined, {
    skip: isPublicRoute,
  });

  const isAuthenticated = Boolean(data?.success && data?.data);

  useEffect(() => {
    if (isPublicRoute) {
      if (!isLoading && !isFetching && isAuthenticated) {
        router.replace("/");
      }

      return;
    }

    if (isLoading || isFetching) return;

    if (isError || !isAuthenticated) {
      router.replace("/login");
    }
  }, [isPublicRoute, isLoading, isFetching, isAuthenticated, isError, router]);

  if (isPublicRoute) {
    if (isAuthenticated) {
      return null;
    }

    return <>{children}</>;
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
