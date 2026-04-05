import { useEffect, useState } from "react";
import { Link } from "react-router";
import { TreePine } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../db/firebase";
import { Card } from "../ui/Card";
import { HealthBadge } from "./HealthBadge";
import type { Bonsai } from "../../types/bonsai";
import { STYLE_LABELS } from "../../types/enums";

interface Props {
  bonsai: Bonsai;
}

export function BonsaiCard({ bonsai }: Props) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);

  useEffect(() => {
    if (bonsai.thumbnailId) {
      getDoc(doc(firestore, "bonsais", bonsai.id, "photos", bonsai.thumbnailId)).then((snap) => {
        if (snap.exists()) {
          setThumbUrl(snap.data().thumbnail || snap.data().base64);
        }
      });
    }
  }, [bonsai.thumbnailId, bonsai.id]);

  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(bonsai.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link to={`/bonsai/${bonsai.id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lg hover:shadow-teal-200/50 transition-all hover:-translate-y-1">
        <div className="aspect-[4/3] bg-gradient-to-br from-emerald-50 to-cyan-50 relative overflow-hidden">
          {thumbUrl ? (
            <img src={thumbUrl} alt={bonsai.species} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <TreePine className="w-12 h-12 text-teal-300" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <HealthBadge status={bonsai.healthStatus} />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">
            {bonsai.nickname || bonsai.species}
          </h3>
          {bonsai.nickname && (
            <p className="text-sm text-gray-500 italic truncate">{bonsai.species}</p>
          )}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{STYLE_LABELS[bonsai.style]?.split(" ")[0]}</span>
            <span>{daysSinceUpdate === 0 ? "Hoy" : `Hace ${daysSinceUpdate}d`}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
