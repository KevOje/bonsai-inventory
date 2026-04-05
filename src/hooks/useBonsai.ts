import { useState, useEffect } from "react";
import { doc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { nanoid } from "nanoid";
import { firestore } from "../db/firebase";
import type { Bonsai } from "../types/bonsai";

export function useBonsai(id: string | undefined) {
  const [bonsai, setBonsai] = useState<Bonsai | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(firestore, "bonsais", id), (snap) => {
      setBonsai(snap.exists() ? ({ id: snap.id, ...snap.data() } as Bonsai) : undefined);
    });
    return unsub;
  }, [id]);

  return bonsai;
}

export async function createBonsai(data: Omit<Bonsai, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const now = new Date().toISOString();
  const id = nanoid();
  await setDoc(doc(firestore, "bonsais", id), { ...data, createdAt: now, updatedAt: now });
  return id;
}

export async function updateBonsai(id: string, data: Partial<Bonsai>): Promise<void> {
  const { id: _id, ...rest } = data as Record<string, unknown>;
  await updateDoc(doc(firestore, "bonsais", id), { ...rest, updatedAt: new Date().toISOString() });
}

export async function deleteBonsai(id: string): Promise<void> {
  const batch = writeBatch(firestore);

  const photosSnap = await getDocs(collection(firestore, "bonsais", id, "photos"));
  photosSnap.docs.forEach((d) => batch.delete(d.ref));

  const tasksQuery = query(collection(firestore, "tasks"), where("bonsaiId", "==", id));
  const tasksSnap = await getDocs(tasksQuery);
  tasksSnap.docs.forEach((d) => batch.delete(d.ref));

  batch.delete(doc(firestore, "bonsais", id));
  await batch.commit();
}
