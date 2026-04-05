import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { BonsaiPhoto } from "../../types/bonsai";
import { PHOTO_ANGLE_LABELS } from "../../types/enums";

interface Props {
  photos: BonsaiPhoto[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function PhotoLightbox({ photos, currentIndex, onClose, onNavigate }: Props) {
  const photo = photos[currentIndex];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIndex, photos.length, onClose, onNavigate]);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <div className="absolute top-4 right-4 z-10">
        <button onClick={onClose} className="text-white/80 hover:text-white cursor-pointer">
          <X size={28} />
        </button>
      </div>
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          className="absolute left-4 text-white/80 hover:text-white cursor-pointer"
        >
          <ChevronLeft size={36} />
        </button>
      )}
      {currentIndex < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          className="absolute right-4 text-white/80 hover:text-white cursor-pointer"
        >
          <ChevronRight size={36} />
        </button>
      )}
      <div onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[85vh]">
        <img src={photo.base64} alt="" className="max-w-full max-h-[80vh] object-contain" />
        <div className="text-center mt-3 text-white/80 text-sm">
          {format(new Date(photo.dateTaken), "dd MMMM yyyy", { locale: es })} — {PHOTO_ANGLE_LABELS[photo.angle]}
          {photo.notes && <span className="ml-2 text-white/60">({photo.notes})</span>}
        </div>
      </div>
    </div>
  );
}
