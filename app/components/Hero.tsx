export default function Hero() {
    return (
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
          AI-powered career companion
        </p>
  
        <h2 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Build your career
          <span className="text-blue-500"> smarter.</span>
        </h2>
  
        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Track your job applications, analyze resumes, discover skill gaps,
          and prepare for interviews — all in one place.
        </p>
  
        <div className="mt-8 flex gap-4">
          <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700">
            Get Started
          </button>
  
          <button className="rounded-lg border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-900">
            Explore Features
          </button>
        </div>
      </section>
    );
  }