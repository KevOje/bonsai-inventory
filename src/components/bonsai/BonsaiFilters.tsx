import { Search } from "lucide-react";
import { HEALTH_LABELS, STYLE_LABELS, LOCATION_LABELS } from "../../types/enums";
import type { BonsaiFilters as Filters } from "../../hooks/useBonsaiList";
import type { BonsaiSort } from "../../hooks/useBonsaiList";

interface Props {
  filters: Filters;
  sort: BonsaiSort;
  onFiltersChange: (filters: Filters) => void;
  onSortChange: (sort: BonsaiSort) => void;
}

export function BonsaiFilters({ filters, sort, onFiltersChange, onSortChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Buscar por nombre, especie..."
          value={filters.search || ""}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white/70"
        />
      </div>
      <select
        value={filters.healthStatus || ""}
        onChange={(e) => onFiltersChange({ ...filters, healthStatus: e.target.value as Filters["healthStatus"] })}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white/70 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
      >
        <option value="">Salud: Todos</option>
        {Object.entries(HEALTH_LABELS).map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
      <select
        value={filters.style || ""}
        onChange={(e) => onFiltersChange({ ...filters, style: e.target.value as Filters["style"] })}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white/70 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
      >
        <option value="">Estilo: Todos</option>
        {Object.entries(STYLE_LABELS).map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
      <select
        value={filters.location || ""}
        onChange={(e) => onFiltersChange({ ...filters, location: e.target.value as Filters["location"] })}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white/70 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
      >
        <option value="">Ubicación: Todos</option>
        {Object.entries(LOCATION_LABELS).map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as BonsaiSort)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white/70 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
      >
        <option value="name">Ordenar: Nombre</option>
        <option value="age">Ordenar: Edad</option>
        <option value="updated">Ordenar: Actualizado</option>
        <option value="health">Ordenar: Salud</option>
      </select>
    </div>
  );
}
