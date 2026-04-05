import { format, isPast, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { Check, Trash2, Clock } from "lucide-react";
import type { BonsaiTask } from "../../types/bonsai";
import { TASK_TYPE_LABELS, TASK_TYPE_COLORS } from "../../types/enums";
import { completeTask, deleteTask } from "../../hooks/useTasks";
import { cn } from "../../lib/utils";

interface Props {
  tasks: BonsaiTask[];
  showBonsaiName?: boolean;
  bonsaiNames?: Map<string, string>;
}

export function TaskList({ tasks, showBonsaiName, bonsaiNames }: Props) {
  const pending = tasks.filter((t) => t.status === "pending");
  const completed = tasks.filter((t) => t.status === "completed").slice(-5);

  return (
    <div className="space-y-2">
      {pending.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No hay tareas pendientes</p>
      )}
      {pending.map((task) => {
        const overdue = isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
        return (
          <div
            key={task.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border",
              overdue ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"
            )}
          >
            <div className={cn("w-2 h-2 rounded-full shrink-0", TASK_TYPE_COLORS[task.type])} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {task.title || TASK_TYPE_LABELS[task.type]}
                </span>
                {overdue && (
                  <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">ATRASADA</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={12} />
                {format(new Date(task.dueDate), "dd MMM yyyy", { locale: es })}
                {showBonsaiName && bonsaiNames?.has(task.bonsaiId) && (
                  <span className="text-primary">— {bonsaiNames.get(task.bonsaiId)}</span>
                )}
                {task.recurrenceDays && <span>· Cada {task.recurrenceDays}d</span>}
              </div>
            </div>
            <button onClick={() => completeTask(task.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded cursor-pointer" title="Completar">
              <Check size={16} />
            </button>
            <button onClick={() => deleteTask(task.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded cursor-pointer" title="Eliminar">
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
      {completed.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">Completadas</h4>
          {completed.map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg text-gray-400 line-through">
              <div className={cn("w-2 h-2 rounded-full shrink-0 opacity-40", TASK_TYPE_COLORS[task.type])} />
              <span className="text-sm truncate">{task.title || TASK_TYPE_LABELS[task.type]}</span>
              <span className="text-xs ml-auto">{task.completedDate}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
