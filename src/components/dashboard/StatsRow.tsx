import { TreePine, Heart, CheckSquare, Camera } from "lucide-react";
import { Card } from "../ui/Card";

interface Props {
  total: number;
  healthy: number;
  tasksDueThisWeek: number;
  photosDueThisMonth: number;
}

const stats = [
  { key: "total", label: "Total bonsáis", icon: TreePine, iconColor: "text-teal-600", bg: "bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200" },
  { key: "healthy", label: "Saludables", icon: Heart, iconColor: "text-green-600", bg: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" },
  { key: "tasksDueThisWeek", label: "Tareas esta semana", icon: CheckSquare, iconColor: "text-sky-600", bg: "bg-gradient-to-br from-sky-50 to-cyan-50 border-sky-200" },
  { key: "photosDueThisMonth", label: "Fotos pendientes", icon: Camera, iconColor: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200" },
] as const;

export function StatsRow(props: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.key} className={`p-4 ${stat.bg}`}>
          <div className="flex items-center gap-3">
            <div className={stat.iconColor}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{props[stat.key]}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
