import { useState, useMemo } from "react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isToday,
  addMonths, subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";
import type { BonsaiTask } from "../../types/bonsai";
import { TASK_TYPE_COLORS, TASK_TYPE_LABELS } from "../../types/enums";
import { cn, toISODate } from "../../lib/utils";

interface Props {
  tasks: BonsaiTask[];
  onDayClick?: (date: Date, tasks: BonsaiTask[]) => void;
}

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function CalendarGrid({ tasks, onDayClick }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, BonsaiTask[]>();
    for (const task of tasks) {
      const key = task.dueDate;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(task);
    }
    return map;
  }, [tasks]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-teal-50 rounded-lg cursor-pointer">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-teal-50 rounded-lg cursor-pointer">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-teal-100 rounded-lg overflow-hidden">
        {WEEKDAYS.map((day) => (
          <div key={day} className="bg-teal-50 p-2 text-center text-xs font-medium text-teal-700">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dateStr = toISODate(day);
          const dayTasks = tasksByDate.get(dateStr) || [];
          const pendingTasks = dayTasks.filter((t) => t.status === "pending");
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);

          return (
            <div
              key={dateStr}
              onClick={() => onDayClick?.(day, dayTasks)}
              className={cn(
                "bg-white p-2 min-h-[80px] cursor-pointer hover:bg-cyan-50 transition-colors",
                !inMonth && "bg-gray-50/50 text-gray-400"
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center justify-center w-7 h-7 text-sm rounded-full",
                  today && "bg-primary text-white font-bold"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="mt-1 space-y-0.5">
                {pendingTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "text-[10px] px-1 py-0.5 rounded truncate text-white",
                      TASK_TYPE_COLORS[task.type]
                    )}
                    title={`${TASK_TYPE_LABELS[task.type]}: ${task.title}`}
                  >
                    {task.title || TASK_TYPE_LABELS[task.type]}
                  </div>
                ))}
                {pendingTasks.length > 3 && (
                  <div className="text-[10px] text-gray-500">+{pendingTasks.length - 3} más</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center">
        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date())}>
          Hoy
        </Button>
      </div>
    </div>
  );
}
