import { Plus, Trash2 } from "lucide-react";
import type { SubstrateComponent } from "../../types/bonsai";
import { Button } from "../ui/Button";

interface Props {
  value: SubstrateComponent[];
  onChange: (mix: SubstrateComponent[]) => void;
}

const PRESETS = ["Akadama", "Pumice", "Lava rock", "Perlita", "Tierra orgánica"];

export function SubstrateMixEditor({ value, onChange }: Props) {
  const total = value.reduce((sum, c) => sum + c.percentage, 0);

  const addComponent = () => {
    const unused = PRESETS.find((p) => !value.some((v) => v.name === p));
    onChange([...value, { name: unused || "", percentage: 0 }]);
  };

  const updateComponent = (index: number, field: keyof SubstrateComponent, val: string | number) => {
    const next = [...value];
    next[index] = { ...next[index], [field]: val };
    onChange(next);
  };

  const removeComponent = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Mezcla de sustrato</label>
        <span className={`text-xs font-medium ${total === 100 ? "text-green-600" : total > 100 ? "text-red-600" : "text-amber-600"}`}>
          Total: {total}%
        </span>
      </div>
      {value.map((comp, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={comp.name}
            onChange={(e) => updateComponent(i, "name", e.target.value)}
            placeholder="Componente"
            list="substrate-presets"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          />
          <input
            type="number"
            value={comp.percentage}
            onChange={(e) => updateComponent(i, "percentage", Number(e.target.value))}
            min={0}
            max={100}
            className="w-20 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-center"
          />
          <span className="text-sm text-gray-500">%</span>
          <button onClick={() => removeComponent(i)} className="text-gray-400 hover:text-red-500 cursor-pointer">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <datalist id="substrate-presets">
        {PRESETS.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>
      <Button variant="ghost" size="sm" onClick={addComponent} type="button">
        <Plus size={16} /> Agregar componente
      </Button>
    </div>
  );
}
