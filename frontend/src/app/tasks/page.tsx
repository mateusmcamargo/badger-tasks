"use client";

import { useState, useEffect } from "react";
import { Search, Filter, CheckCircle, Clock, UserPlus, AlertCircle, Briefcase, Activity } from "lucide-react";

// Mocking backend DTO structure
interface TaskDTO {
  id: number;
  name: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  active: boolean;
  dateLimit: string;
  areaId?: number;
  categoryId?: number;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  // Mock fetch function (in reality, calls the Sprint 2 API we just created)
  useEffect(() => {
    // Simulating API Call to GET /api/tasks?status=...
    const mockTasks: TaskDTO[] = [
      { id: 1, name: "Revisar Aerodinâmica Dianteira", description: "Verificar os dados do túnel de vento para a asa.", status: "IN_PROGRESS", active: true, dateLimit: "2026-05-15T00:00:00Z", areaId: 1 },
      { id: 2, name: "Calibração de Sensores", description: "Ajustar os sensores de telemetria no chassi.", status: "PENDING", active: true, dateLimit: "2026-05-20T00:00:00Z", areaId: 3 },
      { id: 3, name: "Design de Chassi", description: "Estruturas de aço tubulares precisam de revisão.", status: "DONE", active: false, dateLimit: "2026-05-01T00:00:00Z", areaId: 5 },
    ];
    
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 800);
  }, []);

  const handleAssignTask = async (taskId: number) => {
    // Simulates POST /api/tasks/{taskId}/members/{userId}
    alert(`Associação da tarefa ${taskId} realizada com sucesso! (API mock)`);
  };

  const filteredTasks = tasks.filter(t => statusFilter === "ALL" || t.status === statusFilter);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] pb-24">
      {/* Header Premium */}
      <header className="bg-white sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <div className="px-6 pt-12 pb-6 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tarefas</h1>
              <p className="text-sm text-gray-500 font-medium mt-1">Gestão de Sprints - Badger Racing</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full shadow-inner">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar tarefas..." 
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl text-base shadow-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            
            {/* Filter Chips - Operável com uma mão (RNF-01) */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button 
                onClick={() => setStatusFilter("ALL")}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${statusFilter === "ALL" ? "bg-blue-600 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                Todas
              </button>
              <button 
                onClick={() => setStatusFilter("PENDING")}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${statusFilter === "PENDING" ? "bg-amber-500 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                <AlertCircle className="w-4 h-4" /> Pendentes
              </button>
              <button 
                onClick={() => setStatusFilter("IN_PROGRESS")}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${statusFilter === "IN_PROGRESS" ? "bg-blue-500 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                <Activity className="w-4 h-4" /> Em Progresso
              </button>
              <button 
                onClick={() => setStatusFilter("DONE")}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${statusFilter === "DONE" ? "bg-emerald-500 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                <CheckCircle className="w-4 h-4" /> Concluídas
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Task List */}
      <main className="px-6 py-6 max-w-md mx-auto space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium">Carregando tarefas...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  task.status === "DONE" ? "bg-emerald-100 text-emerald-700" :
                  task.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {task.status === "DONE" ? "Concluída" : task.status === "IN_PROGRESS" ? "Em Progresso" : "Pendente"}
                </span>
                {task.active && (
                  <span className="flex items-center text-xs text-rose-500 font-semibold bg-rose-50 px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3 mr-1" /> Urgente
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{task.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{task.description}</p>
              
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="text-xs text-gray-400 font-medium">
                  Prazo: {new Date(task.dateLimit).toLocaleDateString("pt-BR")}
                </div>
                {task.status !== "DONE" && (
                  <button 
                    onClick={() => handleAssignTask(task.id)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                    <UserPlus className="w-4 h-4" />
                    Assumir
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Floating Action Button (Optional for MVP, but good for UX) */}
      <div className="fixed bottom-6 right-6 z-20">
        <button className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all">
          <Filter className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
