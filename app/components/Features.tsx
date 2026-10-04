import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: "📄",
    title: "Resume Analysis",
    description: "Upload your resume and get AI-powered insights.",
  },
  {
    icon: "🎯",
    title: "Job Matching",
    description: "Compare your skills with real job requirements.",
  },
  {
    icon: "🧠",
    title: "Skill Gaps",
    description: "Discover what skills you need to improve.",
  },
  {
    icon: "🤖",
    title: "AI Interviews",
    description: "Practice interviews tailored to your target role.",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-8 py-20">
      <h3 className="text-center text-3xl font-bold">
        Everything you need
      </h3>

      <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}