import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const firstName = session.user.name?.split(" ")[0] || "there";
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
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>
  
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Applications</p>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>
  
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Jobs Saved</p>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>
  
          </div>
  
          {/* Quick Actions */}
          <div className="mt-10">
            <h2 className="mb-5 text-xl font-semibold">
              Quick Actions
            </h2>
  
            <div className="grid gap-5 md:grid-cols-2">
  
              <button className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-blue-500">
                <h3 className="text-lg font-semibold">
                  📄 Add Resume
                </h3>
  
                <p className="mt-2 text-sm text-slate-400">
                  Upload your resume and let CareerPilot analyze it.
                </p>
              </button>
  
              <button className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-blue-500">
                <h3 className="text-lg font-semibold">
                  💼 Add Job
                </h3>
  
                <p className="mt-2 text-sm text-slate-400">
                  Save a job and compare it with your resume.
                </p>
              </button>
  
            </div>
          </div>
  
          {/* Recent Applications */}
          <div className="mt-10">
            <h2 className="mb-5 text-xl font-semibold">
              Recent Applications
            </h2>
  
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                No applications yet.
              </p>
  
              <p className="mt-2 text-sm text-slate-500">
                Your applications will appear here.
              </p>
            </div>
          </div>
  
        </div>
      </main>
    );
  }