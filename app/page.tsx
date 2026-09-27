import Navbar from "@/components/Navbar/Navbar";
import {
  ArrowRight,
  Download,
  File,
  FileArchive,
  FileImage,
  FileText,
  FolderOpen,
  MoreHorizontal,
  Plus,
  Share2,
  UploadCloud,
  Users,
} from "lucide-react";

const files = [
  {
    name: "Project Documentation.pdf",
    type: "PDF",
    size: "2.4 MB",
    date: "Today, 10:42 AM",
    icon: FileText,
  },
  {
    name: "Dashboard Design.fig",
    type: "Figma",
    size: "8.7 MB",
    date: "Yesterday, 6:20 PM",
    icon: FileImage,
  },
  {
    name: "Source Code.zip",
    type: "ZIP",
    size: "42.1 MB",
    date: "Sep 25, 2026",
    icon: FileArchive,
  },
  {
    name: "Requirements.pdf",
    type: "PDF",
    size: "1.8 MB",
    date: "Sep 24, 2026",
    icon: FileText,
  },
];

const Home = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-background text-text">
        <div className="mx-auto max-w-360 px-5 py-8 sm:px-8 lg:py-10">
          <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 text-sm text-muted">Sunday, September 27</p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Good morning, Ritik
              </h1>

              <p className="mt-2 text-sm text-muted">
                Here's what's happening with your files.
              </p>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <File className="h-5 w-5 text-primary-light" />
                </div>

                <span className="text-xs text-muted">Total</span>
              </div>

              <p className="mt-5 text-2xl font-bold">48</p>
              <p className="mt-1 text-xs text-muted">Files uploaded</p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Share2 className="h-5 w-5 text-emerald-400" />
                </div>

                <span className="text-xs text-muted">Active</span>
              </div>

              <p className="mt-5 text-2xl font-bold">16</p>
              <p className="mt-1 text-xs text-muted">Files shared</p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                  <Users className="h-5 w-5 text-violet-400" />
                </div>

                <span className="text-xs text-muted">People</span>
              </div>

              <p className="mt-5 text-2xl font-bold">12</p>
              <p className="mt-1 text-xs text-muted">Files shared with you</p>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="font-semibold">Recent files</h2>
                  <p className="mt-1 text-xs text-muted">
                    Your latest uploaded files
                  </p>
                </div>

                <button className="flex items-center gap-1 text-xs font-medium text-primary-light transition hover:text-white">
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="divide-y divide-border">
                {files.map((file) => {
                  const Icon = file.icon;

                  return (
                    <div
                      key={file.name}
                      className="group flex items-center gap-4 px-5 py-4 transition hover:bg-white/2.5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary-light" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {file.type} · {file.size}
                        </p>
                      </div>

                      <p className="hidden text-xs text-muted md:block">
                        {file.date}
                      </p>

                      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted opacity-0 transition hover:bg-white/5 hover:text-white group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/6 p-6">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <UploadCloud className="h-5 w-5 text-primary-light" />
                  </div>

                  <h3 className="mt-5 font-semibold">Share a file securely</h3>

                  <p className="mt-2 text-xs leading-5 text-muted">
                    Upload a file and choose exactly who can access it.
                  </p>

                  <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 py-2.5 text-xs font-semibold text-primary-light transition hover:bg-primary/20">
                    <Plus className="h-4 w-4" />
                    Upload new file
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">Shared with you</h3>
                    <p className="mt-1 text-xs text-muted">Recently received</p>
                  </div>

                  <Users className="h-4 w-4 text-muted" />
                </div>

                <div className="mt-5 space-y-4">
                  {[
                    {
                      name: "Design Assets.zip",
                      from: "Aman Sharma",
                      icon: FileArchive,
                    },
                    {
                      name: "Project Brief.pdf",
                      from: "Sarah Khan",
                      icon: FileText,
                    },
                    {
                      name: "Hero Image.png",
                      from: "Dev Team",
                      icon: FileImage,
                    },
                  ].map((file) => {
                    const Icon = file.icon;

                    return (
                      <div key={file.name} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/4">
                          <Icon className="h-4 w-4 text-muted" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium">
                            {file.name}
                          </p>
                          <p className="mt-1 text-[10px] text-muted">
                            Shared by {file.from}
                          </p>
                        </div>

                        <button className="text-muted transition hover:text-primary-light">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;
