"use client";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  FileLock2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden border-r border-border lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(129,140,248,0.08),transparent_35%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                <ShieldCheck className="h-5 w-5 text-primary-light" />
              </div>

              <span className="text-lg font-semibold tracking-tight">
                SecureShare
              </span>
            </div>

            <div className="relative max-w-lg">
              <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />

              <div className="relative">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-primary-light">
                  Your secure workspace
                </p>

                <h2 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
                  Share freely.
                  <br />
                  <span className="text-primary-light">Stay protected.</span>
                </h2>

                <p className="mt-6 max-w-md text-base leading-7 text-muted">
                  Create your SecureShare account and take control of how your
                  files are stored, accessed, and shared.
                </p>

                <div className="relative mt-12 h-52 w-full max-w-md">
                  <div className="absolute left-8 top-7 h-40 w-64 -rotate-6 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl" />

                  <div className="absolute left-14 top-2 flex h-40 w-64 rotate-3 flex-col justify-between rounded-2xl border border-primary/20 bg-surface-2/90 p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <FileLock2 className="h-5 w-5 text-primary-light" />
                      </div>

                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                        Private
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-white">
                        Project files
                      </p>

                      <div className="mt-3 h-1.5 w-36 rounded-full bg-white/10">
                        <div className="h-full w-3/4 rounded-full bg-primary" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    "Private file access",
                    "Share with specific people",
                    "Simple file management",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-muted"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary-light" />
                      </div>

                      {item}
                    </div>
                  ))}
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
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                <ShieldCheck className="h-5 w-5 text-primary-light" />
              </div>

              <h1 className="text-2xl font-bold">SecureShare</h1>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-3xl font-extrabold text-primary-light">
                Get started ✨
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Create your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-muted">
                Set up your secure space for sharing files.
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Full name
                </label>

                <div className="group relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition group-focus-within:text-primary-light" />

                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className="h-13 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-sm outline-none transition placeholder:text-muted/60 hover:border-white/15 focus:border-primary/60 focus:bg-surface-2 focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email address
                </label>

                <div className="group relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition group-focus-within:text-primary-light" />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-13 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-sm outline-none transition placeholder:text-muted/60 hover:border-white/15 focus:border-primary/60 focus:bg-surface-2 focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <div className="group relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition group-focus-within:text-primary-light" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="h-13 w-full rounded-xl border border-border bg-surface px-11 pr-12 text-sm outline-none transition placeholder:text-muted/60 hover:border-white/15 focus:border-primary/60 focus:bg-surface-2 focus:ring-4 focus:ring-primary/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirm password
                </label>

                <div className="group relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition group-focus-within:text-primary-light" />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="h-13 w-full rounded-xl border border-border bg-surface px-11 pr-12 text-sm outline-none transition placeholder:text-muted/60 hover:border-white/15 focus:border-primary/60 focus:bg-surface-2 focus:ring-4 focus:ring-primary/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold shadow-lg shadow-primary/20 transition hover:bg-primary-dark hover:shadow-primary/30 active:scale-[0.99]"
              >
                Create account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted">
                Secure access
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="mt-7 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link
                href={"/login"}
                className="font-semibold text-primary-light transition hover:text-white"
              >
                Sign in
              </Link>
            </div>

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

export default Register;
