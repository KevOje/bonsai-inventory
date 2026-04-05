import { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { Tabs } from "../ui/Tabs";
import { createBonsai, updateBonsai } from "../../hooks/useBonsai";
import type { Bonsai, SubstrateComponent } from "../../types/bonsai";
import {
  ORIGIN_LABELS, STYLE_LABELS, POT_TYPE_LABELS,
  HEALTH_LABELS, SUN_LABELS,
  type Origin, type Style, type PotType, type HealthStatus,
  type Location as Loc, type SunExposure,
} from "../../types/enums";

interface Props {
  initialData?: Bonsai;
}

const TABS = [
  { id: "basic", label: "Identificación" },
  { id: "pot", label: "Maceta y Sustrato" },
  { id: "measures", label: "Medidas y Salud" },
  { id: "care", label: "Cuidados" },
  { id: "notes", label: "Notas" },
];

function toOptions<T extends string>(labels: Record<T, string>) {
  return Object.entries(labels).map(([value, label]) => ({ value, label: label as string }));
}

export function BonsaiForm({ initialData }: Props) {
  const navigate = useNavigate();
  const isEdit = !!initialData;

  const [tab, setTab] = useState("basic");
  const [species, setSpecies] = useState(initialData?.species || "");
  const [variety, setVariety] = useState(initialData?.variety || "");
  const [commonName, _setCommonName] = useState(initialData?.commonName || ""); void _setCommonName;
  const [nickname, setNickname] = useState(initialData?.nickname || "");
  const [estimatedAge, setEstimatedAge] = useState(initialData?.estimatedAge?.toString() || "");
  const [acquisitionDate, setAcquisitionDate] = useState(initialData?.acquisitionDate || "");
  const [origin, setOrigin] = useState<Origin>(initialData?.origin || "nursery");
  const [style, setStyle] = useState<Style>(initialData?.style || "moyogi");
  const [designNotes, setDesignNotes] = useState(initialData?.designNotes || "");
  const [potType, setPotType] = useState<PotType>(initialData?.potType || "training");
  const [potSize, setPotSize] = useState(initialData?.potSize || "");
  const [potColorMaterial, setPotColorMaterial] = useState(initialData?.potColorMaterial || "");
  const [lastRepottingDate, setLastRepottingDate] = useState(initialData?.lastRepottingDate || "");
  const [nextRepottingDate, setNextRepottingDate] = useState(initialData?.nextRepottingDate || "");
  const [substrateMix, _setSubstrateMix] = useState<SubstrateComponent[]>(initialData?.substrateMix || []); void _setSubstrateMix;
  const [heightCm, setHeightCm] = useState(initialData?.heightCm?.toString() || "");
  const [trunkDiameterCm, setTrunkDiameterCm] = useState(initialData?.trunkDiameterCm?.toString() || "");
  const [canopyWidthCm, _setCanopyWidthCm] = useState(initialData?.canopyWidthCm?.toString() || ""); void _setCanopyWidthCm;
  const [healthStatus, setHealthStatus] = useState<HealthStatus>(initialData?.healthStatus || "healthy");
  const [location, _setLocation] = useState<Loc>(initialData?.location || "outdoor"); void _setLocation;
  const [sunExposure, setSunExposure] = useState<SunExposure>(initialData?.sunExposure || "full");
  const [pestsAndDiseases, setPestsAndDiseases] = useState(initialData?.pestsAndDiseases || "");
  const [lastPruningDate, setLastPruningDate] = useState(initialData?.lastPruningDate || "");
  const [lastWiringDate, setLastWiringDate] = useState(initialData?.lastWiringDate || "");
  const [nextPlannedWork, _setNextPlannedWork] = useState(initialData?.nextPlannedWork || ""); void _setNextPlannedWork;
  const [nextPlannedWorkDate, setNextPlannedWorkDate] = useState(initialData?.nextPlannedWorkDate || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!species.trim()) return;
    setSaving(true);

    const data = {
      species: species.trim(),
      variety: variety || undefined,
      commonName: commonName || undefined,
      nickname: nickname || undefined,
      estimatedAge: estimatedAge ? Number(estimatedAge) : undefined,
      acquisitionDate: acquisitionDate || undefined,
      origin,
      style,
      designNotes: designNotes || undefined,
      potType,
      potSize: potSize || undefined,
      potColorMaterial: potColorMaterial || undefined,
      lastRepottingDate: lastRepottingDate || undefined,
      nextRepottingDate: nextRepottingDate || undefined,
      substrateMix,
      heightCm: heightCm ? Number(heightCm) : undefined,
      trunkDiameterCm: trunkDiameterCm ? Number(trunkDiameterCm) : undefined,
      canopyWidthCm: canopyWidthCm ? Number(canopyWidthCm) : undefined,
      healthStatus,
      location,
      sunExposure,
      pestsAndDiseases: pestsAndDiseases || undefined,
      lastPruningDate: lastPruningDate || undefined,
      lastWiringDate: lastWiringDate || undefined,
      nextPlannedWork: nextPlannedWork || undefined,
      nextPlannedWorkDate: nextPlannedWorkDate || undefined,
      notes: notes || undefined,
    };

    try {
      if (isEdit && initialData) {
        await updateBonsai(initialData.id, data);
        navigate(`/bonsai/${initialData.id}`);
      } else {
        const id = await createBonsai(data as Omit<Bonsai, "id" | "createdAt" | "updatedAt">);
        navigate(`/bonsai/${id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs tabs={TABS} activeTab={tab} onTabChange={setTab} />

      <div className="p-1">
        {tab === "basic" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Especie *" value={species} onChange={(e) => setSpecies(e.target.value)} required />
            <Input label="Variedad" value={variety} onChange={(e) => setVariety(e.target.value)} />
            <Input label="Apodo" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            <Input label="Edad estimada (años)" type="number" value={estimatedAge} onChange={(e) => setEstimatedAge(e.target.value)} min={0} />
            <Input label="Fecha de adquisición" type="date" value={acquisitionDate} onChange={(e) => setAcquisitionDate(e.target.value)} />
            <Select label="Origen" value={origin} onChange={(e) => setOrigin(e.target.value as Origin)} options={toOptions(ORIGIN_LABELS)} />
            <Select label="Estilo" value={style} onChange={(e) => setStyle(e.target.value as Style)} options={toOptions(STYLE_LABELS)} />
            <div className="md:col-span-2">
              <Textarea label="Notas de diseño / visión futura" value={designNotes} onChange={(e) => setDesignNotes(e.target.value)} />
            </div>
          </div>
        )}

        {tab === "pot" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Tipo de maceta" value={potType} onChange={(e) => setPotType(e.target.value as PotType)} options={toOptions(POT_TYPE_LABELS)} />
              <Input label="Tamaño de maceta (cm)" value={potSize} onChange={(e) => setPotSize(e.target.value)} />
              <Select label="Material" value={potColorMaterial} onChange={(e) => setPotColorMaterial(e.target.value)} options={[{ value: "", label: "Seleccionar..." }, { value: "ceramica", label: "Cerámica" }, { value: "barro", label: "Barro" }, { value: "cemento", label: "Cemento" }]} />
              <Input label="Último trasplante" type="date" value={lastRepottingDate} onChange={(e) => setLastRepottingDate(e.target.value)} />
              <Input label="Próximo trasplante estimado" type="date" value={nextRepottingDate} onChange={(e) => setNextRepottingDate(e.target.value)} />
            </div>
          </div>
        )}

        {tab === "measures" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Altura (cm)" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} min={0} />
            <Input label="Diámetro del tronco (cm)" type="number" step="0.1" value={trunkDiameterCm} onChange={(e) => setTrunkDiameterCm(e.target.value)} min={0} />
            <Select label="Estado de salud" value={healthStatus} onChange={(e) => setHealthStatus(e.target.value as HealthStatus)} options={toOptions(HEALTH_LABELS)} />
            <Select label="Exposición solar" value={sunExposure} onChange={(e) => setSunExposure(e.target.value as SunExposure)} options={toOptions(SUN_LABELS)} />
            <div className="md:col-span-2">
              <Textarea label="Plagas o enfermedades conocidas" value={pestsAndDiseases} onChange={(e) => setPestsAndDiseases(e.target.value)} />
            </div>
          </div>
        )}

        {tab === "care" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Última poda" type="date" value={lastPruningDate} onChange={(e) => setLastPruningDate(e.target.value)} />
            <Input label="Último alambrado" type="date" value={lastWiringDate} onChange={(e) => setLastWiringDate(e.target.value)} />
            <Input label="Fecha del próximo trabajo" type="date" value={nextPlannedWorkDate} onChange={(e) => setNextPlannedWorkDate(e.target.value)} />
          </div>
        )}

        {tab === "notes" && (
          <Textarea label="Notas generales" value={notes} onChange={(e) => setNotes(e.target.value)} rows={8} />
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving || !species.trim()}>
          {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear bonsái"}
        </Button>
      </div>
    </form>
  );
}
