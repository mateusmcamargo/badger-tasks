'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertCircle, Activity, Plus, Flag } from 'lucide-react';

import styles from './tasks.module.scss';
import { Task, TaskFilter } from '@/types/Task';
import { assignMember, getTasks } from '@/services/taskService';
import { TaskCard } from '@/components/tasks/TaskCard';
import { statusClass, statusLabel, areaLabel, areaClass } from '@/utils/taskHelpers';
import { Header } from '@/components/header/Header';
import { hasAdminAccess } from '@/utils/auth';

export default function TasksPage() {
    const [tasks,           setTasks]           = useState<Task[]>([]);
    const [statusFilter,    setStatusFilter]    = useState<string>('ALL');
    const [loading,         setLoading]         = useState<boolean>(true);
    const [error,           setError]           = useState<string | null>(null);
    const [isAdmin,         setIsAdmin]         = useState<boolean>(false);
    const [currentUserId,   setCurrentUserId]   = useState<string | null>(null);

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

        const raw = localStorage.getItem('user');
        const user = raw ? JSON.parse(raw) : null;
        setCurrentUserId(user?.id ?? null);

        loadTasks();
        setIsAdmin(hasAdminAccess());
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

    const columnIcon: Record<Task['status'], React.ReactNode> = {
        NOT_STARTED: <AlertCircle strokeWidth={3}/>,
        IN_PROGRESS: <Activity strokeWidth={3}/>,
        IN_REVISION: <Flag strokeWidth={3}/>,
        DONE:        <CheckCircle strokeWidth={3}/>,
    };

    return (
        <div className={styles.tasks}>

            <Header
                loading={loading}
                statusFilter={statusFilter}
                counts={counts}
                isAdmin={isAdmin}
                onStatusFilter={handleStatusFilter}
            />

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