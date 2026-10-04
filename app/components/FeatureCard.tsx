type FeatureCardProps = {
    icon: string;
    title: string;
    description: string;
  };
  
  export default function FeatureCard({
    icon,
    title,
    description,
  }: FeatureCardProps) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h4 className="text-xl font-semibold">
          {icon} {title}
        </h4>
  
        <p className="mt-3 text-slate-400">
          {description}
        </p>
      </div>
    );
  }