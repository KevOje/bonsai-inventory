import { useState, useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { addPhoto } from "../../hooks/usePhotos";
import { PHOTO_ANGLE_LABELS, type PhotoAngle } from "../../types/enums";
import { toISODate } from "../../lib/utils";

interface Props {
  bonsaiId: string;
  onDone?: () => void;
}

export function PhotoUploader({ bonsaiId, onDone }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [angle, setAngle] = useState<PhotoAngle>("front");
  const [dateTaken, setDateTaken] = useState(toISODate(new Date()));
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    if (selected.length > 0) {
      const url = URL.createObjectURL(selected[0]);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(url);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        await addPhoto(bonsaiId, file, angle, dateTaken, notes || undefined);
      }
      setFiles([]);
      setNotes("");
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      onDone?.();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <Upload size={32} />
            <p className="text-sm">Haz clic o arrastra fotos aquí</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {files.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ImageIcon size={16} />
          {files.length} archivo{files.length > 1 ? "s" : ""} seleccionado{files.length > 1 ? "s" : ""}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Select
          label="Ángulo"
          value={angle}
          onChange={(e) => setAngle(e.target.value as PhotoAngle)}
          options={Object.entries(PHOTO_ANGLE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
        />
        <Input label="Fecha" type="date" value={dateTaken} onChange={(e) => setDateTaken(e.target.value)} />
        <Textarea label="Notas" value={notes} onChange={(e) => setNotes(e.target.value)} rows={1} />
      </div>
      <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
        {uploading ? "Subiendo..." : "Subir fotos"}
      </Button>
    </div>
  );
}
