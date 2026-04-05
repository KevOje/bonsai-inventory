import { Card } from "../components/ui/Card";
import { BonsaiForm } from "../components/bonsai/BonsaiForm";

export default function BonsaiCreatePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent mb-6">Nuevo bonsái</h1>
      <Card className="p-6">
        <BonsaiForm />
      </Card>
    </div>
  );
}
