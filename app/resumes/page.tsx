"use client";

import { FormEvent, useEffect, useState } from "react";

type Resume = {
  id: number;
  title: string;
  fileUrl: string;
  createdAt: string;
};

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes");

      if (!response.ok) {
        throw new Error("Failed to fetch resumes");
      }

      const data = await response.json();
      setResumes(data.resumes);
    } catch (error) {
      console.error(error);
      setError("Could not load your resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!title.trim()) {
      setError("Please enter a resume title");
      return;
    }
  
    if (!file) {
      setError("Please select a PDF file");
      return;
    }
  
    try {
      setLoading(true);
      setError("");
  
      // Step 1: Upload PDF to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
  
      const uploadResponse = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });
  
      const uploadData = await uploadResponse.json();
  
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Failed to upload file");
      }
  
      // Step 2: Save Cloudinary URL in our database
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          fileUrl: uploadData.fileUrl,
          cloudinaryPublicId: uploadData.cloudinaryPublicId,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to create resume");
      }
  
      // Step 3: Add new resume to the UI
      setResumes((current) => [...current, data.resume]);
  
      setTitle("");
      setFile(null);
    } catch (error) {
      console.error(error);
  
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );
  
    if (!confirmed) return;
  
    try {
      const response = await fetch("/api/resumes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete resume");
      }
  
      setResumes((current) =>
        current.filter((resume) => resume.id !== id)
      );
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete resume"
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            My Resumes
          </h1>

          <p className="mt-2 text-slate-400">
            Manage your resumes and prepare them for job applications.
          </p>
        </div>

        {/* Add Resume */}
        <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Add a Resume
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Give your resume a name to get started.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-5 flex flex-col gap-4 sm:flex-row"
          >
            <input
             type="text"
             value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Software Developer Resume"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-400"
            />

<div className="mt-4">
  <label className="mb-2 block text-sm font-medium text-white">
    Resume PDF
  </label>

  <input
    type="file"
    accept="application/pdf"
    onChange={(e) => setFile(e.target.files?.[0] || null)}
    className="block w-full text-sm text-gray-300"
  />
</div>

<button
  type="submit"
  disabled={creating}
  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
  {creating ? "Adding..." : "Add Resume"}
</button>
          </form>

          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Resume List */}
        <div>
          <h2 className="mb-5 text-xl font-semibold">
            Your Resumes
          </h2>

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                Loading resumes...
              </p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                You haven't added any resumes yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Add your first resume above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        📄 {resume.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        Added{" "}
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                      Saved
                    </span>

                    <a href={resume.fileUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="mt-5 mr-4 inline-block text-sm text-blue-400 hover:text-blue-300">
                     View Resume
                     </a>

                    <button onClick={() => handleDelete(resume.id)}
                     className="mt-5 text-sm text-red-400 hover:text-red-300"> 
                     Delete Resume 
                     </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}