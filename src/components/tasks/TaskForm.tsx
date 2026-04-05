import { useState } from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import { createTask, updateTask } from "../../hooks/useTasks";
import { TASK_TYPE_LABELS, type TaskType } from "../../types/enums";
import type { BonsaiTask } from "../../types/bonsai";
import { toISODate } from "../../lib/utils";

interface Props {
  bonsaiId: string;
  task?: BonsaiTask;
  open: boolean;
  onClose: () => void;
}

export function TaskForm({ bonsaiId, task, open, onClose }: Props) {
  const isEdit = !!task;
  const [type, setType] = useState<TaskType>(task?.type || "watering");
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || toISODate(new Date()));
  const [recurrenceDays, setRecurrenceDays] = useState(task?.recurrenceDays?.toString() || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit && task) {
        await updateTask(task.id, {
          type,
          title: title || TASK_TYPE_LABELS[type],
          description: description || undefined,
          dueDate,
          recurrenceDays: recurrenceDays ? Number(recurrenceDays) : undefined,
        });
      } else {
        await createTask({
          bonsaiId,
          type,
          title: title || TASK_TYPE_LABELS[type],
          description: description || undefined,
          dueDate,
          status: "pending",
          recurrenceDays: recurrenceDays ? Number(recurrenceDays) : undefined,
        });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title={isEdit ? "Editar tarea" : "Nueva tarea"}>
      <form onSubmit={handleSubmit} className="space-y-4 min-w-[320px]">
        <Select
          label="Tipo"
          value={type}
          onChange={(e) => { setType(e.target.value as TaskType); if (!title) setTitle(""); }}
          options={Object.entries(TASK_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
        />
        <Input
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={TASK_TYPE_LABELS[type]}
        />
        <Input label="Fecha" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
        <Input
          label="Repetir cada (días)"
          type="number"
          value={recurrenceDays}
          onChange={(e) => setRecurrenceDays(e.target.value)}
          placeholder="Ej: 7 para semanal"
          min={1}
        />
        <Textarea label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Guardando..." : isEdit ? "Guardar" : "Crear tarea"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
