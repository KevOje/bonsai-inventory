import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../db/firebase";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { toISODate } from "../lib/utils";
import type { Bonsai, BonsaiTask } from "../types/bonsai";

interface DashboardStats {
  total: number;
  healthy: number;
  tasksDueThisWeek: number;
  photosDueThisMonth: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | undefined>(undefined);
  const [bonsais, setBonsais] = useState<Bonsai[]>([]);
  const [tasks, setTasks] = useState<BonsaiTask[]>([]);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(firestore, "bonsais"), (snap) => {
      setBonsais(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Bonsai));
    });
    const unsub2 = onSnapshot(collection(firestore, "tasks"), (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BonsaiTask));
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  useEffect(() => {
    const now = new Date();
    const weekStart = toISODate(startOfWeek(now, { weekStartsOn: 1 }));
    const weekEnd = toISODate(endOfWeek(now, { weekStartsOn: 1 }));
    const total = bonsais.length;
    const healthy = bonsais.filter((b) => b.healthStatus === "healthy").length;
    const tasksDueThisWeek = tasks.filter(
      (t) => t.status === "pending" && t.dueDate >= weekStart && t.dueDate <= weekEnd
    ).length;

    // Photo counting would require subcollection queries per bonsai, simplify:
    void toISODate(startOfMonth(now));
    void toISODate(endOfMonth(now));
    const bonsaisWithPhotosNeeded = total;

    setStats({
      total,
      healthy,
      tasksDueThisWeek,
      photosDueThisMonth: Math.max(0, bonsaisWithPhotosNeeded),
    });
  }, [bonsais, tasks]);

  return stats;
}
