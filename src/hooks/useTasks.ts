import { useState, useEffect } from "react";
import { collection, doc, setDoc, updateDoc, deleteDoc, getDoc, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { nanoid } from "nanoid";
import { firestore } from "../db/firebase";
import type { BonsaiTask } from "../types/bonsai";
import { toISODate } from "../lib/utils";

export function useTasks(bonsaiId: string | undefined) {
  const [tasks, setTasks] = useState<BonsaiTask[] | undefined>(undefined);

  useEffect(() => {
    if (!bonsaiId) {
      setTasks([]);
      return;
    }
    const q = query(
      collection(firestore, "tasks"),
      where("bonsaiId", "==", bonsaiId),
      orderBy("dueDate")
    );
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BonsaiTask));
    });
    return unsub;
  }, [bonsaiId]);

  return tasks;
}

export function useAllTasks() {
  const [tasks, setTasks] = useState<BonsaiTask[] | undefined>(undefined);

  useEffect(() => {
    const q = query(collection(firestore, "tasks"), orderBy("dueDate"));
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BonsaiTask));
    });
    return unsub;
  }, []);

  return tasks;
}

export function useTasksByDateRange(start: string, end: string) {
  const [tasks, setTasks] = useState<BonsaiTask[] | undefined>(undefined);

  useEffect(() => {
    const q = query(
      collection(firestore, "tasks"),
      where("dueDate", ">=", start),
      where("dueDate", "<=", end),
      orderBy("dueDate")
    );
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BonsaiTask));
    });
    return unsub;
  }, [start, end]);

  return tasks;
}

export async function createTask(data: Omit<BonsaiTask, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const now = new Date().toISOString();
  const id = nanoid();
  await setDoc(doc(firestore, "tasks", id), { ...data, createdAt: now, updatedAt: now });
  return id;
}

export async function updateTask(id: string, data: Partial<BonsaiTask>): Promise<void> {
  const { id: _id, ...rest } = data as Record<string, unknown>;
  await updateDoc(doc(firestore, "tasks", id), { ...rest, updatedAt: new Date().toISOString() });
}

export async function completeTask(id: string): Promise<void> {
  const snap = await getDoc(doc(firestore, "tasks", id));
  if (!snap.exists()) return;
  const task = { id: snap.id, ...snap.data() } as BonsaiTask;

  const now = new Date().toISOString();
  const today = toISODate(new Date());

  await updateDoc(doc(firestore, "tasks", id), { status: "completed", completedDate: today, updatedAt: now });

  if (task.recurrenceDays) {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + task.recurrenceDays);
    await createTask({
      bonsaiId: task.bonsaiId,
      type: task.type,
      title: task.title,
      description: task.description,
      dueDate: toISODate(nextDate),
      status: "pending",
      recurrenceDays: task.recurrenceDays,
    });
  }
}

export async function deleteTask(id: string): Promise<void> {
  await deleteDoc(doc(firestore, "tasks", id));
}
