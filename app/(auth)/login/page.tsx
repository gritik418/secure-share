"use client";

import Logo from "@/components/Logo/Logo";
import { useLoginMutation } from "@/features/auth/auth.api";
import LoginSchema, { LoginDto } from "@/features/auth/schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  FileLock2,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const handleLogin = async (data: LoginDto) => {
    try {
      const result = await login(data).unwrap();

      if (!result.success) {
        toast.error(result.message);
      } else {
        toast.success(result.message || "Logged in successfully.");
      }
    } catch (error: any) {
      if (error.status === "FETCH_ERROR") {
        toast.error(
          "Unable to connect to the server. Please make sure the server is running.",
        );
        return;
      }

      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden border-r border-border lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(129,140,248,0.08),transparent_35%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Logo />

            <div className="relative max-w-lg">
              <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />

              <div className="relative">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-primary-light">
                  Secure file sharing
                </p>

                <h2 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
                  Your files.
                  <br />
                  <span className="text-primary-light">Your control.</span>
                </h2>

                <p className="mt-6 max-w-md text-base leading-7 text-muted">
                  Share files securely with the people you trust. Keep your data
                  organized, private, and always under your control.
                </p>

                <div className="relative mt-12 h-52 w-full max-w-md">
                  <div className="absolute left-8 top-6 h-40 w-64 -rotate-6 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl" />

                  <div className="absolute left-14 top-2 flex h-40 w-64 rotate-3 flex-col justify-between rounded-2xl border border-primary/20 bg-surface-2/90 p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <FileLock2 className="h-5 w-5 text-primary-light" />
                      </div>

                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                        Protected
                      </span>
                    </div>

                    <div>
                      <div className="h-2 w-32 rounded-full bg-white/10" />
                      <div className="mt-2 h-2 w-20 rounded-full bg-white/5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-0 flex items-center gap-3 rounded-xl border border-border bg-surface/90 px-4 py-3 shadow-xl backdrop-blur-xl">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Upload className="h-4 w-4 text-primary-light" />
                    </div>

                    <div>
                      <p className="text-xs font-medium">Encrypted upload</p>
                      <p className="text-[10px] text-muted">
                        Access controlled
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted">
              SecureShare · Private file sharing made simple
            </p>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
          <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-primary/10 blur-[100px] lg:hidden" />

          <div className="relative w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>

            <div className="mb-8">
              <p className="mb-2 text-3xl font-extrabold text-primary-light">
                Welcome back!
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Sign in to your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-muted">
                Access your files and continue sharing securely.
              </p>
            </div>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email address
                </label>

                <div className="group relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition group-focus-within:text-primary-light" />

                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-13 w-full rounded-xl border border-border bg-surface px-11 text-sm outline-none transition placeholder:text-muted/60 hover:border-white/15 focus:border-primary/60 focus:bg-surface-2 focus:ring-4 focus:ring-primary/10"
                  />
                  {errors.email && (
                    <p className="text-xs mt-1 text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold">
                    Password
                  </label>
                </div>

                <div className="group relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition group-focus-within:text-primary-light" />

                  <input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-13 w-full rounded-xl border border-border bg-surface px-11 pr-12 text-sm outline-none transition placeholder:text-muted/60 hover:border-white/15 focus:border-primary/60 focus:bg-surface-2 focus:ring-4 focus:ring-primary/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs mt-1 text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group cursor-pointer flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold shadow-lg shadow-primary/20 transition hover:bg-primary-dark hover:shadow-primary/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted">
                Secure access
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <p className="text-center text-sm text-muted">
              Don't have an account?{" "}
              <Link
                href={"/register"}
                className="font-semibold text-primary-light transition hover:text-white"
              >
                Create account
              </Link>
            </p>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted/70">
              <LockKeyhole className="h-3.5 w-3.5" />
              <span>Your files stay under your control.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
