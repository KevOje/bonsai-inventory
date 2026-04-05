import { useState, useEffect } from "react";
import { collection, doc, setDoc, deleteDoc, getDoc, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { nanoid } from "nanoid";
import { firestore } from "../db/firebase";
import type { BonsaiPhoto } from "../types/bonsai";
import type { PhotoAngle } from "../types/enums";
import { compressPhoto, generateThumbnail } from "../lib/photo-utils";

export function usePhotos(bonsaiId: string | undefined) {
  const [photos, setPhotos] = useState<BonsaiPhoto[] | undefined>(undefined);

  useEffect(() => {
    if (!bonsaiId) {
      setPhotos([]);
      return;
    }
    const q = query(
      collection(firestore, "bonsais", bonsaiId, "photos"),
      orderBy("dateTaken")
    );
    const unsub = onSnapshot(q, (snap) => {
      setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BonsaiPhoto));
    });
    return unsub;
  }, [bonsaiId]);

  return photos;
}

export async function addPhoto(
  bonsaiId: string,
  file: File,
  angle: PhotoAngle,
  dateTaken: string,
  notes?: string
): Promise<string> {
  const id = nanoid();
  const [base64, thumbnail] = await Promise.all([
    compressPhoto(file),
    generateThumbnail(file),
  ]);

  const photo: Omit<BonsaiPhoto, "id"> = {
    bonsaiId,
    base64,
    thumbnail,
    dateTaken,
    angle,
    notes: notes || "",
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(firestore, "bonsais", bonsaiId, "photos", id), photo);

  const bonsaiSnap = await getDoc(doc(firestore, "bonsais", bonsaiId));
  if (bonsaiSnap.exists() && !bonsaiSnap.data().thumbnailId) {
    await updateDoc(doc(firestore, "bonsais", bonsaiId), {
      thumbnailId: id,
      updatedAt: new Date().toISOString(),
    });
  }

  return id;
}

export async function deletePhoto(bonsaiId: string, photoId: string): Promise<void> {
  await deleteDoc(doc(firestore, "bonsais", bonsaiId, "photos", photoId));

  const bonsaiSnap = await getDoc(doc(firestore, "bonsais", bonsaiId));
  if (bonsaiSnap.exists() && bonsaiSnap.data().thumbnailId === photoId) {
    const q = query(collection(firestore, "bonsais", bonsaiId, "photos"), orderBy("dateTaken"));
    const { getDocs } = await import("firebase/firestore");
    const remaining = await getDocs(q);
    await updateDoc(doc(firestore, "bonsais", bonsaiId), {
      thumbnailId: remaining.docs.length > 0 ? remaining.docs[0].id : "",
      updatedAt: new Date().toISOString(),
    });
  }
}
