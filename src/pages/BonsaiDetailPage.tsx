import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft, Edit, Trash2, Plus, TreePine, Ruler,
  Sun, Scissors,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Tabs } from "../components/ui/Tabs";
import { Badge } from "../components/ui/Badge";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { HealthBadge } from "../components/bonsai/HealthBadge";
import { PhotoUploader } from "../components/photos/PhotoUploader";
import { PhotoGallery } from "../components/photos/PhotoGallery";
import { PhotoCompare } from "../components/photos/PhotoCompare";
import { PhotoLightbox } from "../components/photos/PhotoLightbox";
import { TaskList } from "../components/tasks/TaskList";
import { TaskForm } from "../components/tasks/TaskForm";
import { useBonsai, deleteBonsai } from "../hooks/useBonsai";
import { usePhotos } from "../hooks/usePhotos";
import { useTasks } from "../hooks/useTasks";
import { formatDate } from "../lib/utils";
import {
  ORIGIN_LABELS, STYLE_LABELS, POT_TYPE_LABELS,
  LOCATION_LABELS, SUN_LABELS,
} from "../types/enums";
import type { BonsaiPhoto } from "../types/bonsai";

const TABS = [
  { id: "info", label: "Información" },
  { id: "photos", label: "Fotos" },
  { id: "tasks", label: "Tareas" },
  { id: "compare", label: "Comparar" },
];

export default function BonsaiDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bonsai = useBonsai(id);
  const photos = usePhotos(id);
  const tasks = useTasks(id);

  const [tab, setTab] = useState("info");
  const [showDelete, setShowDelete] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!bonsai) return <div className="p-6 text-center text-gray-500">Cargando...</div>;

  const handleDelete = async () => {
    await deleteBonsai(bonsai.id);
    navigate("/");
  };

  const handlePhotoSelect = (photo: BonsaiPhoto) => {
    const idx = photos?.findIndex((p) => p.id === photo.id) ?? -1;
    if (idx >= 0) setLightboxIndex(idx);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-teal-400 hover:text-teal-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">
              {bonsai.nickname || bonsai.species}
            </h1>
            {bonsai.nickname && (
              <p className="text-sm text-gray-500 italic">{bonsai.species}{bonsai.variety ? ` var. ${bonsai.variety}` : ""}</p>
            )}
          </div>
          <HealthBadge status={bonsai.healthStatus} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate(`/bonsai/${bonsai.id}/edit`)}>
            <Edit size={16} /> Editar
          </Button>
          <Button variant="destructive" onClick={() => setShowDelete(true)}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <Tabs tabs={TABS} activeTab={tab} onTabChange={setTab} />

      {tab === "info" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-teal-800 flex items-center gap-2">
              <TreePine size={18} /> Identificación
            </h3>
            <InfoRow label="Especie" value={bonsai.species} />
            <InfoRow label="Variedad" value={bonsai.variety} />
            <InfoRow label="Nombre común" value={bonsai.commonName} />
            <InfoRow label="Apodo" value={bonsai.nickname} />
            <InfoRow label="Edad estimada" value={bonsai.estimatedAge ? `${bonsai.estimatedAge} años` : undefined} />
            <InfoRow label="Fecha de adquisición" value={formatDate(bonsai.acquisitionDate)} />
            <InfoRow label="Origen" value={ORIGIN_LABELS[bonsai.origin]} />
            <InfoRow label="Estilo" value={STYLE_LABELS[bonsai.style]} />
            {bonsai.designNotes && <InfoRow label="Notas de diseño" value={bonsai.designNotes} />}
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-teal-800 flex items-center gap-2">
              <Ruler size={18} /> Medidas y Maceta
            </h3>
            <InfoRow label="Altura" value={bonsai.heightCm ? `${bonsai.heightCm} cm` : undefined} />
            <InfoRow label="Diámetro tronco" value={bonsai.trunkDiameterCm ? `${bonsai.trunkDiameterCm} cm` : undefined} />
            <InfoRow label="Ancho copa" value={bonsai.canopyWidthCm ? `${bonsai.canopyWidthCm} cm` : undefined} />
            <InfoRow label="Tipo de maceta" value={POT_TYPE_LABELS[bonsai.potType]} />
            <InfoRow label="Tamaño maceta" value={bonsai.potSize} />
            <InfoRow label="Color/Material" value={bonsai.potColorMaterial} />
            <InfoRow label="Último trasplante" value={formatDate(bonsai.lastRepottingDate)} />
            <InfoRow label="Próximo trasplante" value={formatDate(bonsai.nextRepottingDate)} />
            {bonsai.substrateMix.length > 0 && (
              <div>
                <span className="text-xs text-gray-500">Sustrato</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {bonsai.substrateMix.map((s, i) => (
                    <Badge key={i}>{s.name} {s.percentage}%</Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-teal-800 flex items-center gap-2">
              <Sun size={18} /> Salud y Ubicación
            </h3>
            <InfoRow label="Ubicación" value={LOCATION_LABELS[bonsai.location]} />
            <InfoRow label="Exposición solar" value={SUN_LABELS[bonsai.sunExposure]} />
            {bonsai.pestsAndDiseases && <InfoRow label="Plagas/Enfermedades" value={bonsai.pestsAndDiseases} />}
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-teal-800 flex items-center gap-2">
              <Scissors size={18} /> Cuidados
            </h3>
            <InfoRow label="Última poda" value={formatDate(bonsai.lastPruningDate)} />
            <InfoRow label="Último alambrado" value={formatDate(bonsai.lastWiringDate)} />
            <InfoRow label="Próximo trabajo" value={bonsai.nextPlannedWork} />
            <InfoRow label="Fecha próximo trabajo" value={formatDate(bonsai.nextPlannedWorkDate)} />
            {bonsai.notes && (
              <div>
                <span className="text-xs text-gray-500">Notas generales</span>
                <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{bonsai.notes}</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === "photos" && (
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold text-teal-800 mb-4">Subir fotos</h3>
            <PhotoUploader bonsaiId={bonsai.id} />
          </Card>
          {photos && photos.length > 0 ? (
            <PhotoGallery photos={photos} onSelect={handlePhotoSelect} />
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">Sin fotos todavía. Sube la primera foto de tu bonsái.</p>
          )}
        </div>
      )}

      {tab === "tasks" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowTaskForm(true)}>
              <Plus size={16} /> Nueva tarea
            </Button>
          </div>
          {tasks && <TaskList tasks={tasks} />}
          <TaskForm bonsaiId={bonsai.id} open={showTaskForm} onClose={() => setShowTaskForm(false)} />
        </div>
      )}

      {tab === "compare" && photos && (
        <Card className="p-5">
          <h3 className="font-semibold text-teal-800 mb-4">Comparación antes/después</h3>
          <PhotoCompare photos={photos} />
        </Card>
      )}

      {lightboxIndex !== null && photos && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Eliminar bonsái"
        message={`¿Estás seguro de que deseas eliminar "${bonsai.nickname || bonsai.species}"? Esta acción eliminará también todas sus fotos y tareas.`}
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  if (!value || value === "—") return null;
  return (
    <div>
      <span className="text-xs text-gray-500">{label}</span>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );
}
