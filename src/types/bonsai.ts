import type { Origin, Style, PotType, HealthStatus, Location, SunExposure, PhotoAngle, TaskType, TaskStatus } from "./enums";

export interface SubstrateComponent {
  name: string;
  percentage: number;
}

export interface Bonsai {
  id: string;
  species: string;
  variety?: string;
  commonName?: string;
  nickname?: string;
  estimatedAge?: number;
  acquisitionDate?: string;
  origin: Origin;
  style: Style;
  designNotes?: string;
  potType: PotType;
  potSize?: string;
  potColorMaterial?: string;
  lastRepottingDate?: string;
  nextRepottingDate?: string;
  substrateMix: SubstrateComponent[];
  heightCm?: number;
  trunkDiameterCm?: number;
  canopyWidthCm?: number;
  healthStatus: HealthStatus;
  location: Location;
  sunExposure: SunExposure;
  pestsAndDiseases?: string;
  lastPruningDate?: string;
  lastWiringDate?: string;
  nextPlannedWork?: string;
  nextPlannedWorkDate?: string;
  notes?: string;
  thumbnailId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BonsaiPhoto {
  id: string;
  bonsaiId: string;
  base64: string;
  thumbnail: string;
  dateTaken: string;
  angle: PhotoAngle;
  notes?: string;
  createdAt: string;
}

export interface BonsaiTask {
  id: string;
  bonsaiId: string;
  type: TaskType;
  title: string;
  description?: string;
  dueDate: string;
  completedDate?: string;
  status: TaskStatus;
  recurrenceDays?: number;
  createdAt: string;
  updatedAt: string;
}
