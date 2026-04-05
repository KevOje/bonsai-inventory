export type Origin = "seed" | "cutting" | "yamadori" | "nursery" | "gift" | "other";
export type Style = "chokkan" | "moyogi" | "kengai" | "han-kengai" | "shakan" | "bunjin" | "fukinagashi" | "yose-ue" | "other";
export type PotType = "training" | "exhibition" | "colander" | "other";
export type HealthStatus = "healthy" | "recovering" | "sick" | "dormant";
export type Location = "indoor" | "outdoor";
export type SunExposure = "full" | "partial" | "shade";
export type PhotoAngle = "front" | "back" | "top" | "detail";
export type TaskType = "watering" | "fertilizing" | "repotting" | "pruning" | "wiring" | "photo" | "other";
export type TaskStatus = "pending" | "completed" | "skipped";

export const ORIGIN_LABELS: Record<Origin, string> = {
  seed: "Semilla",
  cutting: "Esqueje",
  yamadori: "Yamadori",
  nursery: "Vivero",
  gift: "Regalo",
  other: "Otro",
};

export const STYLE_LABELS: Record<Style, string> = {
  chokkan: "Chokkan (Formal upright)",
  moyogi: "Moyogi (Informal upright)",
  kengai: "Kengai (Cascade)",
  "han-kengai": "Han-kengai (Semi-cascade)",
  shakan: "Shakan (Slanting)",
  bunjin: "Bunjin (Literati)",
  fukinagashi: "Fukinagashi (Windswept)",
  "yose-ue": "Yose-ue (Group)",
  other: "Otro",
};

export const POT_TYPE_LABELS: Record<PotType, string> = {
  training: "Entrenamiento",
  exhibition: "Exhibición",
  colander: "Colander",
  other: "Otro",
};

export const HEALTH_LABELS: Record<HealthStatus, string> = {
  healthy: "Saludable",
  recovering: "Recuperándose",
  sick: "Enfermo",
  dormant: "Dormante",
};

export const LOCATION_LABELS: Record<Location, string> = {
  indoor: "Interior",
  outdoor: "Exterior",
};

export const SUN_LABELS: Record<SunExposure, string> = {
  full: "Sol directo",
  partial: "Semi-sombra",
  shade: "Sombra",
};

export const PHOTO_ANGLE_LABELS: Record<PhotoAngle, string> = {
  front: "Frontal",
  back: "Trasera",
  top: "Superior",
  detail: "Detalle",
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  watering: "Riego",
  fertilizing: "Abonado",
  repotting: "Trasplante",
  pruning: "Poda",
  wiring: "Alambrado",
  photo: "Foto",
  other: "Otro",
};

export const TASK_TYPE_COLORS: Record<TaskType, string> = {
  watering: "bg-watering",
  fertilizing: "bg-fertilizing",
  repotting: "bg-repotting",
  pruning: "bg-pruning",
  wiring: "bg-wiring",
  photo: "bg-photo-task",
  other: "bg-gray-400",
};
