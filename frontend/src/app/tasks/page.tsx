'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, CheckCircle, AlertCircle, Activity, Plus, ScanEye, Flag, User } from 'lucide-react';

import styles from './tasks.module.scss';
import { Task, TaskFilter } from '@/types/Task';
import { assignMember, getTasks } from '@/services/taskService';
import { TaskCard } from '@/components/tasks/TaskCard';

export default function TasksPage() {
    const [tasks,           setTasks]           = useState<Task[]>([]);
    const [statusFilter,    setStatusFilter]    = useState<string>('ALL');
    const [loading,         setLoading]         = useState<boolean>(true);
    const [error,           setError]           = useState<string | null>(null);
    const [currentUserId]                       = useState<string | null>(() =>
        typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') ?? 'null')?.id : null
    );

    const loadTasks = useCallback(async (filter: TaskFilter = {}) => {
        setLoading(true);
        setError(null);

        try {
            const data = await getTasks(filter);
            setTasks(data.tasks);
        } catch(error) {
            setError(error instanceof Error ? error.message: 'Erro ao carregar tarefas.')
        } finally {
            setLoading(false);
        }
    }, []);
    
    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
    };

    const handleAssignTask = async (taskId: string) => {
        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            const user = raw ? JSON.parse(raw) : null;
            if (!user?.id) {
                alert('Usuário não identificado. Faça login novamente.');
                return;
            }
            await assignMember(taskId, user.id);
            
            const filter: TaskFilter = statusFilter === 'ALL' ? {}: {
                status: statusFilter as Task['status']
            };
            await loadTasks(filter);    
        } catch (err) {
            console.error('Erro ao assumir tarefa.');
        }
    };

    const filteredTasks = statusFilter === 'ALL'
        ? tasks
        : tasks.filter(t => t.status === statusFilter);

    const counts = {
        ALL:         tasks.length,
        NOT_STARTED: tasks.filter(t => t.status === 'NOT_STARTED').length,
        IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        IN_REVISION: tasks.filter(t => t.status === 'IN_REVISION').length,
        DONE:        tasks.filter(t => t.status === 'DONE').length,
    };

    function areaLabel(area: string) {
        const labels: Record<string, string> = {
            AERODYNAMICS: 'Aerodinâmica',
            DYNAMICS:     'Dinâmica',
            TELEMETRY:    'Telemetria',
            MARKETING:    'Marketing',
            STRUCTURE:    'Estruturas',
        };
        return labels[area] ?? area;
    }

    function areaClass(area: string) {
        const classes: Record<string, string> = {
            AERODYNAMICS: 'areaAero',
            DYNAMICS:     'areaDynamics',
            TELEMETRY:    'areaTelemetry',
            MARKETING:    'areaMarketing',
            STRUCTURE:    'areaStructure',
        };
        return classes[area] ?? '';
    }

    function statusLabel(status: Task['status']) {
        const labels: Record<string, string> = {
            NOT_STARTED: 'Pendente',
            IN_PROGRESS: 'Em Progresso',
            IN_REVISION: 'Em Revisão',
            DONE:        'Concluída',
        };
        return labels[status] ?? '';
    }

    function statusClass(status: Task['status']) {
        const classes: Record<string, string> = {
            NOT_STARTED: 'notStarted',
            IN_PROGRESS: 'inProgress',
            IN_REVISION: 'inRevision',
            DONE:        'done',
        };
        return classes[status] ?? '';
    }

    const columnIcon: Record<Task['status'], React.ReactNode> = {
        NOT_STARTED: <AlertCircle strokeWidth={3}/>,
        IN_PROGRESS: <Activity strokeWidth={3}/>,
        IN_REVISION: <Flag strokeWidth={3}/>,
        DONE:        <CheckCircle strokeWidth={3}/>,
    };

    return (
        <div className={styles.tasks}>

            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.headerBranding}>
                        <img src="/badger-tasks-logo-light.png" alt="Badger Tasks"/>
                    </div>
                    <div className={styles.searchWrapper}>
                        <Search/>
                        <input
                            type="text"
                            placeholder="Buscar tarefas..."
                            autoComplete="off"
                        />
                    </div>
                    <button className={styles.headerUser}>
                        <User strokeWidth={3}/>
                    </button>
                </div>

                <div className={styles.filters}>
                    {loading ? (
                        <div className={styles.loadingFilters}>
                            <div className={styles.spinner}/>
                            <p>Carregando filtros...</p>
                        </div>
                    ) : (
                        <>
                        <button
                            onClick={() => handleStatusFilter('ALL')}
                            className={`${styles.chip} ${styles.all} ${statusFilter === 'ALL' ? styles.active : ''}`}
                        >
                            <ScanEye strokeWidth={3}/>
                            Todas ({counts.ALL})
                        </button>
                        <button
                            onClick={() => handleStatusFilter('NOT_STARTED')}
                            className={`${styles.chip} ${styles.notStarted} ${statusFilter === 'NOT_STARTED' ? styles.active : ''}`}
                        >
                            <AlertCircle strokeWidth={3}/>
                            Pendentes ({counts.NOT_STARTED})
                        </button>
                        <button
                            onClick={() => handleStatusFilter('IN_PROGRESS')}
                            className={`${styles.chip} ${styles.inProgress} ${statusFilter === 'IN_PROGRESS' ? styles.active : ''}`}
                        >
                            <Activity strokeWidth={3}/>
                            Em Progresso ({counts.IN_PROGRESS})
                        </button>
                        <button
                            onClick={() => handleStatusFilter('IN_REVISION')}
                            className={`${styles.chip} ${styles.inRevision} ${statusFilter === 'IN_REVISION' ? styles.active : ''}`}
                        >
                            <Flag strokeWidth={3}/>
                            Em revisão ({counts.IN_REVISION})
                        </button>
                        <button
                            onClick={() => handleStatusFilter('DONE')}
                            className={`${styles.chip} ${styles.done} ${statusFilter === 'DONE' ? styles.active : ''}`}
                        >
                            <CheckCircle strokeWidth={3}/>
                            Concluídas ({counts.DONE})
                        </button>
                        </>
                    )}
                </div>
            </header>

            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Carregando tarefas...</p>
                </div>
            ) : error ? (
                <div className={styles.empty}>
                    <p>{error}</p>
                </div>
            ) : (
                <>
                <main className={`${styles.main} ${statusFilter === 'ALL' ? styles.column : styles.grid}`}>
                    {statusFilter === 'ALL' ? (
                        <div className={styles.columns}>
                            {(['NOT_STARTED', 'IN_PROGRESS', 'IN_REVISION', 'DONE'] as Task['status'][]).map(status => (
                                <div key={status} className={styles.column}>
                                    <div className={`${styles.columnHeader} ${styles[statusClass(status)]}`}>
                                        {columnIcon[status]}
                                        {statusLabel(status)}
                                    </div>
                                    <div className={styles.columnTasks}>
                                        {tasks.filter(t => t.status === status).length === 0 ? (
                                            <div className={styles.columnEmpty}>
                                                <p>Nenhuma tarefa</p>
                                            </div>
                                        ) : (
                                            tasks.filter(t => t.status === status).map(task => (
                                                <TaskCard
                                                    key={task.id}
                                                    task={task}
                                                    statusLabel={statusLabel}
                                                    areaLabel={areaLabel}
                                                    statusClass={statusClass}
                                                    areaClass={areaClass}
                                                    handleAssignTask={handleAssignTask}
                                                    currentUserId={currentUserId}
                                                    viewMode={'column'}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className={styles.empty}>
                            <p>Nenhuma tarefa encontrada.</p>
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                statusLabel={statusLabel}
                                areaLabel={areaLabel}
                                statusClass={statusClass}
                                areaClass={areaClass}
                                handleAssignTask={handleAssignTask}
                                currentUserId={currentUserId}
                                viewMode='grid'
                            />
                        ))
                    )}
                </main>

                <div className={styles.addTask}>
                    <button aria-label="Nova tarefa">
                        <Plus strokeWidth={3}/>
                    </button>
                </div>
                </>
            )}
        </div>
    );
}