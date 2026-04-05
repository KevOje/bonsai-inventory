import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, TreePine } from "lucide-react";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { BonsaiCard } from "../components/bonsai/BonsaiCard";
import { BonsaiFilters } from "../components/bonsai/BonsaiFilters";
import { StatsRow } from "../components/dashboard/StatsRow";
import { useBonsaiList, type BonsaiFilters as Filters, type BonsaiSort } from "../hooks/useBonsaiList";
import { useDashboardStats } from "../hooks/useDashboardStats";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>({});
  const [sort, setSort] = useState<BonsaiSort>("name");

  const bonsais = useBonsaiList(filters, sort);
  const stats = useDashboardStats();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">Mi colección</h1>
        <Button onClick={() => navigate("/bonsai/new")}>
          <Plus size={18} /> Nuevo bonsái
        </Button>
      </div>

      {stats && (
        <StatsRow
          total={stats.total}
          healthy={stats.healthy}
          tasksDueThisWeek={stats.tasksDueThisWeek}
          photosDueThisMonth={stats.photosDueThisMonth}
        />
      )}

      <BonsaiFilters
        filters={filters}
        sort={sort}
        onFiltersChange={setFilters}
        onSortChange={setSort}
      />

      {bonsais && bonsais.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {bonsais.map((bonsai) => (
            <BonsaiCard key={bonsai.id} bonsai={bonsai} />
          ))}
        </div>
      ) : bonsais ? (
        <EmptyState
          icon={TreePine}
          title="Sin bonsáis aún"
          description="Comienza agregando tu primer bonsái a la colección."
          action={{ label: "Agregar bonsái", onClick: () => navigate("/bonsai/new") }}
        />
      ) : null}
    </div>
  );
}
