"use client";

import { useEffect, useState } from "react";

type Job = {
  id: number;
  title: string;
  company: string;
};

type Application = {
  id: number;
  jobId: number;
  status: string;
  notes: string | null;
  appliedAt: string | null;
};

export default function ApplicationsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        fetch("/api/jobs"),
        fetch("/api/applications"),
      ]);
  
      const jobsData = await jobsResponse.json().catch(() => ({}));
      const applicationsData = await applicationsResponse
        .json()
        .catch(() => ({}));
  
      if (!jobsResponse.ok) {
        throw new Error(
          jobsData.error || "Failed to fetch jobs"
        );
      }
  
      if (!applicationsResponse.ok) {
        throw new Error(
          applicationsData.error ||
            "Failed to fetch applications"
        );
      }
  
      setJobs(jobsData.jobs);
      setApplications(applicationsData.applications);
    } catch (error) {
      console.error(error);
  
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!jobId) {
      setError("Please select a job");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: Number(jobId),
          status,
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create application"
        );
      }

      setApplications((current) => [
        data.application,
        ...current,
      ]);

      setJobId("");
      setStatus("Applied");
      setNotes("");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create application"
      );
    } finally {
      setCreating(false);
    }
  };

  const getJob = (id: number) => {
    return jobs.find((job) => job.id === id);
  };

  const updateApplicationStatus = async (
    applicationId: number,
    newStatus: string
  ) => {
    try {
      setError("");

      const response = await fetch("/api/applications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: applicationId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update application"
        );
      }

      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status: newStatus,
              }
            : application
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update application"
      );
    }
  };

  const deleteApplication = async (applicationId: number) => {
    try {
      setError("");
  
      const response = await fetch("/api/applications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: applicationId,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete application"
        );
      }
  
      setApplications((current) =>
        current.filter(
          (application) => application.id !== applicationId
        )
      );
    } catch (error) {
      console.error(error);
  
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete application"
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            Applications
          </h1>

          <p className="mt-2 text-slate-400">
            Track your job applications and their progress.
          </p>
        </div>

        <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-6 text-xl font-semibold">
            Add Application
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Job
              </label>

              <select
                value={jobId}
                onChange={(e) =>
                  setJobId(e.target.value)
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="">
                  Select a job
                </option>

                {jobs.map((job) => (
                  <option
                    key={job.id}
                    value={job.id}
                  >
                    {job.title} — {job.company}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="Applied">
                  Applied
                </option>
                <option value="Interview">
                  Interview
                </option>
                <option value="Offer">
                  Offer
                </option>
                <option value="Rejected">
                  Rejected
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Optional notes..."
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating
                ? "Saving..."
                : "Add Application"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="mb-5 text-xl font-semibold">
            Your Applications
          </h2>

          {loading ? (
            <p className="text-slate-400">
              Loading applications...
            </p>
          ) : applications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
              No applications added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => {
                const job = getJob(application.jobId);

                return (
                  <article
                    key={application.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-lg font-semibold">
                      {job?.title || "Unknown Job"}
                    </h3>

                    <p className="mt-1 text-blue-400">
                      {job?.company || "Unknown Company"}
                    </p>

                    <div className="mt-4">
  <label className="mb-2 block text-sm text-slate-300">
    Status
  </label>

  <select
    value={application.status}
    onChange={(e) =>
      updateApplicationStatus(
        application.id,
        e.target.value
      )
    }

    
    className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white outline-none focus:border-blue-500"
  >
    <option value="Applied">Applied</option>
    <option value="Interview">Interview</option>
    <option value="Offer">Offer</option>
    <option value="Rejected">Rejected</option>
  </select>
</div>
                    {application.appliedAt && (
                      <p className="mt-2 text-sm text-slate-400">
                        Applied:{" "}
                        {new Date(
                          application.appliedAt
                        ).toLocaleDateString()}
                      </p>
                    )}

                    {application.notes && (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-slate-400">
                        {application.notes}
                      </p>
                    )}

<button
  type="button"
  onClick={() => deleteApplication(application.id)}
  className="mt-5 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
>
  Delete Application
</button>

                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}