import { NavLink } from "react-router";
import { LayoutDashboard, Calendar, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-teal-100 flex items-center justify-around py-2 px-4 z-50">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          cn("flex flex-col items-center gap-1 px-3 py-1 text-xs", isActive ? "text-teal-600 font-semibold" : "text-gray-500")
        }
      >
        <LayoutDashboard size={20} />
        Dashboard
      </NavLink>
      <NavLink
        to="/bonsai/new"
        className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full text-white -mt-6 shadow-lg shadow-teal-500/30"
      >
        <Plus size={24} />
      </NavLink>
      <NavLink
        to="/calendar"
        className={({ isActive }) =>
          cn("flex flex-col items-center gap-1 px-3 py-1 text-xs", isActive ? "text-teal-600 font-semibold" : "text-gray-500")
        }
      >
        <Calendar size={20} />
        Calendario
      </NavLink>
    </nav>
  );
}
