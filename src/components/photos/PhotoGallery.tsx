import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2, Maximize2 } from "lucide-react";
import type { BonsaiPhoto } from "../../types/bonsai";
import { PHOTO_ANGLE_LABELS } from "../../types/enums";
import { Badge } from "../ui/Badge";
import { deletePhoto } from "../../hooks/usePhotos";
import { ConfirmDialog } from "../ui/ConfirmDialog";

interface Props {
  photos: BonsaiPhoto[];
  onSelect?: (photo: BonsaiPhoto) => void;
}

function PhotoCard({ photo, onSelect }: { photo: BonsaiPhoto; onSelect?: (p: BonsaiPhoto) => void }) {
  const [deleting, setDeleting] = useState(false);
  const url = photo.thumbnail || photo.base64;

  return (
    <>
      <div className="group relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
        {url && (
          <img
            src={url}
            alt={`${photo.angle} - ${photo.dateTaken}`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          {onSelect && (
            <button onClick={() => onSelect(photo)} className="p-2 bg-white rounded-full shadow cursor-pointer">
              <Maximize2 size={16} />
            </button>
          )}
          <button onClick={() => setDeleting(true)} className="p-2 bg-white rounded-full shadow cursor-pointer text-red-500">
            <Trash2 size={16} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white">
              {format(new Date(photo.dateTaken), "dd MMM yyyy", { locale: es })}
            </span>
            <Badge className="!text-[10px] !py-0">{PHOTO_ANGLE_LABELS[photo.angle]}</Badge>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={() => deletePhoto(photo.bonsaiId, photo.id)}
        title="Eliminar foto"
        message="¿Estás seguro de que deseas eliminar esta foto?"
      />
    </>
  );
}

export function PhotoGallery({ photos, onSelect }: Props) {
  const groups = new Map<string, BonsaiPhoto[]>();
  for (const photo of [...photos].reverse()) {
    const key = format(new Date(photo.dateTaken), "MMMM yyyy", { locale: es });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(photo);
  }

  return (
    <div className="space-y-6">
      {Array.from(groups.entries()).map(([month, monthPhotos]) => (
        <div key={month}>
          <h3 className="text-sm font-medium text-gray-500 mb-3 capitalize">{month}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {monthPhotos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} onSelect={onSelect} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
