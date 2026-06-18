'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertCircle, Activity, Plus, Flag } from 'lucide-react';

import styles from './tasks.module.scss';
import { Task, TaskFilter } from '@/types/Task';
import { assignMember, getTasks } from '@/services/taskService';
import { TaskCard } from '@/components/tasks/TaskCard';
import { STATUS_BADGES } from '@/utils/taskHelpers';
import { Header } from '@/components/header/Header';
import { getSession, hasAdminAccess, isMember, logout, UserSession } from '@/utils/auth';
import { Loading } from '@/components/loading/Loading';

export default function TasksPage() {
    const [tasks,        setTasks]        = useState<Task[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [loading,      setLoading]      = useState<boolean>(true);
    const [error,        setError]        = useState<string | null>(null);
    const [isAdmin,      setIsAdmin]      = useState<boolean>(false);
    const [currentUser,  setCurrentUser]  = useState<UserSession | null>(null);

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
        const session = getSession();
        setCurrentUser(session);
        setIsAdmin(hasAdminAccess());
        loadTasks();
    }, [loadTasks]);

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
    };

    const handleAssignTask = async (taskId: string) => {
        alert('Função de atribuir membros ainda não configurada.');
    };

    const handleTakeOnTask = async (taskId: string) => {
        try {
            if (!currentUser?.id) {
                alert('Usuário não identificado. Faça login novamente.');
                return;
            }
            await assignMember(taskId, currentUser.id);
            await loadTasks();    
        } catch (err) {
            console.error('Erro ao assumir tarefa.');
        }
    };

    const filteredTasks = statusFilter === 'ALL'
        ? tasks
        : tasks.filter(task => task.status === statusFilter);

    let counts;
    if (isMember()) {
        counts = {
            ALL:         tasks.length,
            NOT_STARTED: tasks.filter(
                task => task.status    === 'NOT_STARTED' &&
                        task.area.name === currentUser?.area
            ).length,
            IN_PROGRESS: tasks.filter(
                task => task.status    === 'IN_PROGRESS' &&
                        task.area.name === currentUser?.area
            ).length,
            IN_REVISION: tasks.filter(
                task => task.status    === 'IN_REVISION' &&
                        task.area.name === currentUser?.area
            ).length,
            DONE:        tasks.filter(
                task => task.status    === 'DONE' &&
                        task.area.name === currentUser?.area
            ).length,
        };
    } else {
        counts = {
            ALL:         tasks.length,
            NOT_STARTED: tasks.filter(task => task.status === 'NOT_STARTED').length,
            IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS').length,
            IN_REVISION: tasks.filter(task => task.status === 'IN_REVISION').length,
            DONE:        tasks.filter(task => task.status === 'DONE').length,
        };
    }

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
                currentUser={currentUser}
                onStatusFilter={handleStatusFilter}
                onLogout={logout}
            />

            {loading ? (
                <Loading
                    size='BIG'
                    type='VERTICAL'
                    content='tarefas'
                />
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
                                    <div
                                        className={`
                                            ${styles.columnHeader}
                                            ${styles[STATUS_BADGES[status].className]}
                                        `}
                                    >
                                        {columnIcon[status]}
                                        {STATUS_BADGES[status].label}
                                    </div>
                                    <div className={styles.columnTasks}>
                                        {tasks.filter(t => t.status === status).length === 0 ? (
                                            <div className={styles.columnEmpty}>
                                                <p>Nenhuma tarefa</p>
                                            </div>
                                        ) : (
                                            <>
                                            {isMember() ? (
                                                tasks.filter(
                                                    task => task.status === status &&
                                                         task.area.name === currentUser?.area
                                                ).map(task => (
                                                    <TaskCard
                                                        key={task.id}
                                                        task={task}
                                                        handleAssignTask={handleAssignTask}
                                                        handleTakeOnTask={handleTakeOnTask}
                                                        currentUser={currentUser}
                                                        viewMode={'column'}
                                                    />
                                                ))
                                            ) : (
                                                tasks.filter(task => task.status === status).map(task => (
                                                    <TaskCard
                                                        key={task.id}
                                                        task={task}
                                                        handleAssignTask={handleAssignTask}
                                                        handleTakeOnTask={handleTakeOnTask}
                                                        currentUser={currentUser}
                                                        viewMode={'column'}
                                                    />
                                                ))
                                            )}
                                            </>
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
                                handleAssignTask={handleAssignTask}
                                handleTakeOnTask={handleTakeOnTask}
                                currentUser={currentUser}
                                viewMode={'column'}
                            />
                        ))
                    )}
                </main>

                {hasAdminAccess() &&
                    <div className={styles.addTask}>
                        <button aria-label="Nova tarefa">
                            <Plus strokeWidth={3}/>
                        </button>
                    </div>
                }
                </>
            )}
        </div>
    );
}