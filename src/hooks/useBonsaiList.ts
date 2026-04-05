import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../db/firebase";
import type { Bonsai } from "../types/bonsai";
import type { HealthStatus, Style, Location } from "../types/enums";

export interface BonsaiFilters {
  search?: string;
  healthStatus?: HealthStatus | "";
  style?: Style | "";
  location?: Location | "";
}

export type BonsaiSort = "name" | "age" | "updated" | "health";

export function useBonsaiList(filters: BonsaiFilters, sort: BonsaiSort = "name") {
  const [all, setAll] = useState<Bonsai[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(firestore, "bonsais"), (snap) => {
      setAll(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Bonsai));
    });
    return unsub;
  }, []);

  let items = [...all];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (b) =>
        b.species.toLowerCase().includes(q) ||
        b.commonName?.toLowerCase().includes(q) ||
        b.nickname?.toLowerCase().includes(q) ||
        b.variety?.toLowerCase().includes(q)
    );
  }
  if (filters.healthStatus) {
    items = items.filter((b) => b.healthStatus === filters.healthStatus);
  }
  if (filters.style) {
    items = items.filter((b) => b.style === filters.style);
  }
  if (filters.location) {
    items = items.filter((b) => b.location === filters.location);
  }

  items.sort((a, b) => {
    switch (sort) {
      case "name":
        return (a.nickname || a.species).localeCompare(b.nickname || b.species);
      case "age":
        return (b.estimatedAge || 0) - (a.estimatedAge || 0);
      case "updated":
        return b.updatedAt.localeCompare(a.updatedAt);
      case "health": {
        const order: Record<string, number> = { sick: 0, recovering: 1, dormant: 2, healthy: 3 };
        return (order[a.healthStatus] ?? 4) - (order[b.healthStatus] ?? 4);
      }
      default:
        return 0;
    }
  });

  return items;
}
