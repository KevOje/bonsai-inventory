import { useState, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { BonsaiPhoto } from "../../types/bonsai";

interface Props {
  photos: BonsaiPhoto[];
}

export function PhotoCompare({ photos }: Props) {
  const sorted = useMemo(() => [...photos].sort((a, b) => a.dateTaken.localeCompare(b.dateTaken)), [photos]);
  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(sorted.length - 1);

  if (sorted.length < 2) {
    return <p className="text-sm text-gray-500 text-center py-8">Necesitas al menos 2 fotos para comparar.</p>;
  }

  const dateOptions = sorted.map((p, i) => ({
    value: String(i),
    label: format(new Date(p.dateTaken), "dd MMM yyyy", { locale: es }),
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <select
          value={leftIdx}
          onChange={(e) => setLeftIdx(Number(e.target.value))}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
        >
          {dateOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label} (Antes)</option>
          ))}
        </select>
        <select
          value={rightIdx}
          onChange={(e) => setRightIdx(Number(e.target.value))}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
        >
          {dateOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label} (Después)</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
          {sorted[leftIdx] && <img src={sorted[leftIdx].base64} alt="Before" className="w-full h-full object-contain" />}
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
          {sorted[rightIdx] && <img src={sorted[rightIdx].base64} alt="After" className="w-full h-full object-contain" />}
        </div>
      </div>
    </div>
  );
}
