import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../db/firebase";
import { CalendarGrid } from "../components/calendar/CalendarGrid";
import { TaskList } from "../components/tasks/TaskList";
import { Card } from "../components/ui/Card";
import { useAllTasks } from "../hooks/useTasks";
import type { Bonsai, BonsaiTask } from "../types/bonsai";
import { toISODate } from "../lib/utils";

export default function CalendarPage() {
  const allTasks = useAllTasks();
  const [bonsais, setBonsais] = useState<Bonsai[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<BonsaiTask[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(firestore, "bonsais"), (snap) => {
      setBonsais(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Bonsai));
    });
    return unsub;
  }, []);

  const bonsaiNames = useMemo(() => {
    const map = new Map<string, string>();
    bonsais.forEach((b) => map.set(b.id, b.nickname || b.species));
    return map;
  }, [bonsais]);

  const handleDayClick = (date: Date, tasks: BonsaiTask[]) => {
    setSelectedDate(date);
    setSelectedTasks(tasks);
  };

  const upcomingPending = useMemo(() => {
    if (!allTasks) return [];
    const today = toISODate(new Date());
    return allTasks
      .filter((t) => t.status === "pending" && t.dueDate >= today)
      .slice(0, 10);
  }, [allTasks]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent mb-6">Calendario de tareas</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-5">
            {allTasks && <CalendarGrid tasks={allTasks} onDayClick={handleDayClick} />}
          </Card>

          {selectedDate && (
            <Card className="p-5 mt-4">
              <h3 className="font-semibold text-teal-800 mb-3">
                {format(selectedDate, "EEEE, dd 'de' MMMM yyyy", { locale: es })}
              </h3>
              {selectedTasks.length > 0 ? (
                <div className="space-y-2">
                  {selectedTasks.map((task) => (
                    <Link
                      key={task.id}
                      to={`/bonsai/${task.bonsaiId}`}
                      className="block p-3 rounded-lg border border-teal-200 hover:bg-teal-50"
                    >
                      <div className="text-sm font-medium">{task.title}</div>
                      <div className="text-xs text-gray-500">
                        {bonsaiNames.get(task.bonsaiId) || ""}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No hay tareas para este día.</p>
              )}
            </Card>
          )}
        </div>

        <div>
          <Card className="p-5">
            <h3 className="font-semibold text-teal-800 mb-4">Próximas tareas</h3>
            <TaskList tasks={upcomingPending} showBonsaiName bonsaiNames={bonsaiNames} />
          </Card>
        </div>
      </div>
    </div>
  );
}
