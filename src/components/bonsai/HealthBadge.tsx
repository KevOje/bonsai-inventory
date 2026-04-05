import { Badge } from "../ui/Badge";
import { HEALTH_LABELS, type HealthStatus } from "../../types/enums";

export function HealthBadge({ status }: { status: HealthStatus }) {
  return <Badge variant={status}>{HEALTH_LABELS[status]}</Badge>;
}
