import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

export default function StatsCard({ title, value, icon: Icon, trend, color = "purple" }: StatsCardProps) {
  const colorClasses = {
    purple: "bg-[#4051a4]/10 text-[#4051a4]",
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-green-500/10 text-green-500",
    orange: "bg-orange-500/10 text-orange-500",
  };

  return (
    <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl hover:border-[#4051a4]/30 transition-all duration-300 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-[#6B7280] text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-[#111827]">{value}</p>
    </div>
  );
}
