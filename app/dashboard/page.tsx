import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";
import { db } from "@/src/prisma/db";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const firstName = session.user.name?.split(" ")[0] || "there";

  const userId = Number(session.user.id);

const [resumes, jobs, applications] = await Promise.all([
  db.orm.public.Resume.where({ userId }).all(),
  db.orm.public.Job.where({ userId }).all(),
  db.orm.public.Application.where({ userId }).all(),
]);

const totalResumes = resumes.length;
const totalJobs = jobs.length;
const totalApplications = applications.length;

const recentApplications = [...applications]
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )
  .slice(0, 5);

    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
  
          {/* Header */}
          <div className="mb-10 flex items-start justify-between gap-4">
  <div>
    <h1 className="text-3xl font-bold">
      Welcome back, {firstName} 👋
    </h1>

    <p className="mt-2 text-slate-400">
      Manage your resumes, jobs, and career progress in one place.
    </p>
  </div>

  <LogoutButton />
</div>
  
          {/* Stats */}
          <div className="grid gap-5 md:grid-cols-3">
  
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Resumes</p>
              <p className="mt-2 text-3xl font-bold">{totalResumes}</p>
            </div>
  
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Applications</p>
              <p className="mt-2 text-3xl font-bold">{totalApplications}</p>
            </div>
  
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Jobs Saved</p>
              <p className="mt-2 text-3xl font-bold">{totalJobs}</p>
            </div>
  
          </div>
  
          {/* Quick Actions */}
          <div className="mt-10">
            <h2 className="mb-5 text-xl font-semibold">
              Quick Actions
            </h2>
  
            <div className="grid gap-5 md:grid-cols-2">
  
            <Link
  href="/resumes"
  className="block rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-blue-500"
>
  <h3 className="text-lg font-semibold">
    📄 Add Resume
  </h3>

  <p className="mt-2 text-sm text-slate-400">
    Upload your resume and let CareerPilot analyze it.
  </p>
</Link>
<Link
  href="/jobs"
  className="block rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-blue-500"
>
  <h3 className="text-lg font-semibold">
    💼 Add Job
  </h3>

  <p className="mt-2 text-sm text-slate-400">
    Save a job and compare it with your resume.
  </p>
</Link>
  
            </div>
          </div>
  
          {/* Recent Applications */}
<div className="mt-10">
  <h2 className="mb-5 text-xl font-semibold">
    Recent Applications
  </h2>

  {recentApplications.length === 0 ? (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
      <p className="text-slate-400">
        No applications yet.
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Your applications will appear here.
      </p>
    </div>
  ) : (
    <div className="space-y-4">
      {recentApplications.map((application) => {
        const job = jobs.find(
          (item) => item.id === application.jobId
        );

        return (
          <div
            key={application.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-semibold">
                  {job?.title || "Unknown Job"}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {job?.company || "Unknown Company"}
                </p>
              </div>

              <span className="w-fit rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
                {application.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>
  
        </div>
      </main>
    );
  }