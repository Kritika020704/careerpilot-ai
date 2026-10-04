export default function Navbar() {
    return (
      <nav className="flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold">
          CareerPilot<span className="text-blue-500">AI</span>
        </h1>
  
        <div className="flex gap-6 text-sm text-slate-300">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </div>
  
        <button className="rounded-lg bg-blue-600 px-5 py-2 font-medium hover:bg-blue-700">
          Get Started
        </button>
      </nav>
    );
  }