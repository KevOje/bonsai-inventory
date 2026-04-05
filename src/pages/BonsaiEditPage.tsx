import { useParams } from "react-router";
import { Card } from "../components/ui/Card";
import { BonsaiForm } from "../components/bonsai/BonsaiForm";
import { useBonsai } from "../hooks/useBonsai";

export default function BonsaiEditPage() {
  const { id } = useParams();
  const bonsai = useBonsai(id);

  if (!bonsai) return <div className="p-6 text-center text-gray-500">Cargando...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent mb-6">Editar bonsái</h1>
      <Card className="p-6">
        <BonsaiForm initialData={bonsai} />
      </Card>
    </div>
  );
}
