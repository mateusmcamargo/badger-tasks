'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, UserPlus, AlertCircle, Briefcase, Activity, Plus } from 'lucide-react';

import styles from './tasks.module.scss';

// Mocking backend DTO structure
interface TaskDTO {
    id: number;
    name: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
    active: boolean;
    dateLimit: string;
    areaId?: number;
    categoryId?: number;
}

export default function TasksPage() {
    const [tasks, setTasks]           = useState<TaskDTO[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [loading, setLoading]       = useState(true);

    useEffect(() => {
        const mockTasks: TaskDTO[] = [
            { id: 1, name: 'Revisar Aerodinâmica Dianteira', description: 'Verificar os dados do túnel de vento para a asa dianteira do veículo.', status: 'IN_PROGRESS', active: true,  dateLimit: '2026-05-15T00:00:00Z', areaId: 1 },
            { id: 2, name: 'Calibração de Sensores',         description: 'Ajustar os sensores de telemetria no chassi conforme protocolo.', status: 'PENDING',     active: true,  dateLimit: '2026-05-20T00:00:00Z', areaId: 3 },
            { id: 3, name: 'Design de Chassi',               description: 'Estruturas de aço tubulares precisam de revisão estrutural completa.', status: 'DONE',        active: false, dateLimit: '2026-05-01T00:00:00Z', areaId: 5 },
        ];

        setTimeout(() => {
            setTasks(mockTasks);
            setLoading(false);
        }, 800);
    }, []);

    const handleAssignTask = async (taskId: number) => {
        alert(`Associação da tarefa ${taskId} realizada com sucesso!`);
    };

    const filteredTasks = tasks.filter(t => statusFilter === 'ALL' || t.status === statusFilter);

    function statusLabel(status: TaskDTO['status']) {
        if (status === 'DONE')        return 'Concluída';
        if (status === 'IN_PROGRESS') return 'Em Progresso';
        return 'Pendente';
    }

    function statusClass(status: TaskDTO['status']) {
        if (status === 'DONE')        return styles.done;
        if (status === 'IN_PROGRESS') return styles.progress;
        return styles.pending;
    }

    return (
        <div className={styles.tasks}>

            {/* ── Header ─────────────────────────────────────── */}
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.headerInfo}>
                        <h1>Tarefas</h1>
                        <p>Gestão de Sprints · Badger Racing</p>
                    </div>
                    <div className={styles.headerIcon}>
                        <Briefcase />
                    </div>
                </div>

                {/* Search */}
                <div className={styles.searchWrapper}>
                    <Search />
                    <input
                        type="text"
                        placeholder="Buscar tarefas..."
                        autoComplete="off"
                    />
                </div>

                {/* Filter chips */}
                <div className={styles.filters}>
                    <button
                        onClick={() => setStatusFilter('ALL')}
                        className={`${styles.chip} ${styles.all} ${statusFilter === 'ALL' ? styles.active : ''}`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setStatusFilter('PENDING')}
                        className={`${styles.chip} ${styles.pending} ${statusFilter === 'PENDING' ? styles.active : ''}`}
                    >
                        <AlertCircle /> Pendentes
                    </button>
                    <button
                        onClick={() => setStatusFilter('IN_PROGRESS')}
                        className={`${styles.chip} ${styles.progress} ${statusFilter === 'IN_PROGRESS' ? styles.active : ''}`}
                    >
                        <Activity /> Em Progresso
                    </button>
                    <button
                        onClick={() => setStatusFilter('DONE')}
                        className={`${styles.chip} ${styles.done} ${statusFilter === 'DONE' ? styles.active : ''}`}
                    >
                        <CheckCircle /> Concluídas
                    </button>
                </div>
            </header>

            {/* ── Task list ──────────────────────────────────── */}
            <main className={styles.main}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner} />
                        <p>Carregando tarefas...</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className={styles.empty}>
                        <p>Nenhuma tarefa encontrada.</p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <div key={task.id} className={styles.card}>
                            <div className={styles.cardTop}>
                                <span className={`${styles.statusBadge} ${statusClass(task.status)}`}>
                                    {statusLabel(task.status)}
                                </span>
                                {task.active && (
                                    <span className={styles.urgentBadge}>
                                        <Clock /> Urgente
                                    </span>
                                )}
                            </div>

                            <h3 className={styles.cardTitle}>{task.name}</h3>
                            <p className={styles.cardDesc}>{task.description}</p>

                            <div className={styles.cardFooter}>
                                <span className={styles.deadline}>
                                    Prazo: {new Date(task.dateLimit).toLocaleDateString('pt-BR')}
                                </span>
                                {task.status !== 'DONE' && (
                                    <button
                                        onClick={() => handleAssignTask(task.id)}
                                        className={styles.assignBtn}
                                    >
                                        <UserPlus /> Assumir
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </main>

            {/* ── FAB ────────────────────────────────────────── */}
            <div className={styles.fab}>
                <button aria-label="Nova tarefa">
                    <Plus />
                </button>
            </div>
        </div>
    );
}