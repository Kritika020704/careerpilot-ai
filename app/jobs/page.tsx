"use client";

import { FormEvent, useEffect, useState } from "react";

type Job = {
  id: number;
  title: string;
  company: string;
  description: string;
  location: string | null;
  url: string | null;
  createdAt: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [url, setUrl] = useState("");

  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch jobs");
      }

      setJobs(data.jobs);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch jobs"
      );
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !company.trim() || !description.trim()) {
      setError("Job title, company and description are required");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch("/api/jobs", {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(editing && { id: editingJobId }),
          title: title.trim(),
          company: company.trim(),
          description: description.trim(),
          location: location.trim(),
          url: url.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            (editing ? "Failed to update job" : "Failed to create job")
        );
      }

      if (editing) {
        setJobs((current) =>
          current.map((job) =>
            job.id === editingJobId ? data.job : job
          )
        );
      } else {
        setJobs((current) => [data.job, ...current]);
      }

      setTitle("");
      setCompany("");
      setDescription("");
      setLocation("");
      setUrl("");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create job"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );
  
    if (!confirmed) return;
  
    try {
      setError("");
  
      const response = await fetch("/api/jobs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete job");
      }
  
      setJobs((current) =>
        current.filter((job) => job.id !== id)
      );
    } catch (error) {
      console.error(error);
  
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete job"
      );
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJobId(null);
  
    setTitle(job.title);
    setCompany(job.company);
    setDescription(job.description);
    setLocation(job.location || "");
    setUrl(job.url || "");
  
    setEditing(false);
    setError("");
  
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Jobs</h1>

          <p className="mt-2 text-slate-400">
            Save job opportunities and analyze them against your resumes.
          </p>
        </div>

        <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-6 text-xl font-semibold">
            Add a Job
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Job Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full Stack Developer"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Company
              </label>

              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Microsoft"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Job Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={7}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Delhi / Remote"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Job URL
              </label>

              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
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
              disabled={creating || updating}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating
              ? "Updating..."
              : editing
              ? "Update Job"
              : "Add Job"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="mb-5 text-xl font-semibold">
            Your Jobs
          </h2>

          {jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
              No jobs added yet.
            </div>
          ) : (
            <div className="space-y-4">


              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <h3 className="text-lg font-semibold">
                    {job.title}
                  </h3>

                  <p className="mt-1 text-blue-400">
                    {job.company}
                  </p>

                  {job.location && (
                    <p className="mt-2 text-sm text-slate-400">
                      📍 {job.location}
                    </p>
                  )}

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                    {job.description}
                  </p>

                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300"
                    >
                      View Job →
                    </a>
                  )}

                  <button onClick={() => handleEdit(job)} className="mt-4 ml-4 text-sm text-yellow-400 hover:text-yellow-300">
                  Edit Job
                  </button>

                  <button onClick={() => handleDelete(job.id)}
                  className="mt-4 ml-4 text-sm text-red-400 hover:text-red-300">Delete Job</button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}