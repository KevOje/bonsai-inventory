import { NavLink } from "react-router";
import { LayoutDashboard, Calendar, TreePine } from "lucide-react";
import { cn } from "../../lib/utils";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/calendar", icon: Calendar, label: "Calendario" },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-teal-600 via-emerald-600 to-cyan-700 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
            <TreePine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Bonsai</h1>
            <p className="text-xs text-emerald-100">Inventario</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/20 text-white shadow-lg shadow-emerald-900/20"
                  : "text-emerald-50 hover:bg-white/10 hover:text-white"
              )
            }
          >
            <link.icon size={20} />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
