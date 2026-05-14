'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, CheckCircle, UserPlus, AlertCircle, Activity, Plus, ScanEye, Flag, BookmarkCheck, ListTodo, ListChecks, Grip, ListX, ClockCheck, User } from 'lucide-react';

import styles from './tasks.module.scss';
import { Task, TaskFilter } from '@/types/Task';
import { assignMember, getTasks } from '@/services/taskService';

export default function TasksPage() {
    const [tasks,           setTasks]           = useState<Task[]>([]);
    const [statusFilter,    setStatusFilter]    = useState<string>('ALL');
    const [loading,         setLoading]         = useState<boolean>(true);
    const [error,           setError]           = useState<string | null>(null);

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
        const filter: TaskFilter = status === 'ALL' ? {} : {
            status: status as Task['status']
        };
        loadTasks(filter);
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
            alert(err instanceof Error ? err.message : 'Erro ao assumir tarefa.');
        }
    };

    const filteredTasks = tasks;

    function statusLabel(status: Task['status']) {
        if (status === 'DONE')        return 'Concluída';
        if (status === 'IN_PROGRESS') return 'Em Progresso';
        if (status === 'IN_REVISION') return 'Em Revisão';
        return 'Pendente';
    }

    function statusClass(status: Task['status']) {
        if (status === 'DONE')        return styles.done;
        if (status === 'IN_PROGRESS') return styles.inProgress;
        if (status === 'IN_REVISION') return styles.inRevision;
        return styles.notStarted;
    }

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

    type TaskCardProps = {
        task: Task;
        statusLabel: (s: Task['status']) => string;
        statusClass:  (s: Task['status']) => string;
        handleAssignTask: (id: string) => void;
        viewMode?: 'column' | 'grid';
    }

    function TaskCard({ task, statusLabel, statusClass, handleAssignTask, viewMode}: TaskCardProps) {
        return (
            <div className={styles.task}>
                <div className={styles.taskHeader}>
                    <div>
                        {viewMode === 'grid' && (
                            <span className={`${styles.statusBadge} ${statusClass(task.status)}`}>
                            {statusLabel(task.status)}
                        </span>
                        )}
                        {task.active && (
                            <span className={styles.activeBadge}>
                                <BookmarkCheck/>
                                Ativa
                            </span>
                        )}
                    </div>
                    
                    {viewMode === 'column' &&
                    <div className={styles.actions}>
                        <Grip/>
                    </div>
                    }
                </div>

                <div className={styles.taskMain}>
                    <div className={styles.taskInfo}>
                        <h3>{task.name}</h3>
                        <p>{task.description}</p>
                    </div>

                    <div className={styles.taskBadges}>
                        <p className={styles.taskBadge}>{task.area.name}</p>
                        <p className={styles.taskBadge}>{task.category.name}</p>
                    </div>
                        
                    <div className={styles.taskSteps}>
                        {task.status === 'DONE' ? (
                            <p className={styles.taskStepsCounter}>
                                <ListChecks strokeWidth={3}/>
                                {`Todos os passos concluídos`}
                            </p>
                        ) : task.status === 'IN_REVISION' ? (
                            <p className={styles.taskStepsCounter}>
                                <ClockCheck strokeWidth={3}/>
                                {`Em Revisão`}
                            </p>
                        ) : (
                            task.steps.filter(step => step.done).length > 0 ? (
                                <p className={styles.taskStepsCounter}>
                                    <ListTodo strokeWidth={3}/>
                                    {`${task.steps.filter(step => step.done).length} de ${task.steps.length} passos concluídos`}
                                </p>
                            ) : (
                                <p className={styles.taskStepsCounter}>
                                    <ListX strokeWidth={3}/>
                                    {`Não iniciada`}
                                </p>
                            )
                        )}
                    </div>

                    <div className={styles.taskUsers}>
                        {task.assignedTo.length > 0 ? (
                            task.assignedTo.map(user => (
                                <div key={user.id} className={styles.userAvatar} title={user.name}>
                                    {/* {user.photoUrl ? (
                                        <img
                                            src={user.photoUrl}
                                            alt={user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                        />
                                    ) : (
                                        <span>{user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                                    )} */}
                                    <span>{user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                                </div>
                            ))
                        ) : (
                            <p>Nenhum membro atribuído</p>
                        )}
                    </div>
                </div>
                
                <div className={styles.taskFooter}>
                    <span className={styles.taskDateLimit}>
                        Prazo: {task.dateLimit ? new Date(task.dateLimit).toLocaleDateString('pt-BR') : 'Sem prazo estipulado'}
                    </span>
                    {task.status !== 'DONE' && (
                        <button
                            onClick={() => handleAssignTask(task.id)}
                            className={styles.taskAssignButton}
                        >
                            <UserPlus/>
                            Assumir
                        </button>
                    )}
                </div>
            </div>
        );
    }

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
                            onClick={() => setStatusFilter('ALL')}
                            className={`${styles.chip} ${styles.all} ${statusFilter === 'ALL' ? styles.active : ''}`}
                        >
                            <ScanEye strokeWidth={3}/>
                            Todas ({counts.ALL})
                        </button>
                        <button
                            onClick={() => setStatusFilter('NOT_STARTED')}
                            className={`${styles.chip} ${styles.notStarted} ${statusFilter === 'NOT_STARTED' ? styles.active : ''}`}
                        >
                            <AlertCircle strokeWidth={3}/>
                            Pendentes ({counts.NOT_STARTED})
                        </button>
                        <button
                            onClick={() => setStatusFilter('IN_PROGRESS')}
                            className={`${styles.chip} ${styles.inProgress} ${statusFilter === 'IN_PROGRESS' ? styles.active : ''}`}
                        >
                            <Activity strokeWidth={3}/>
                            Em Progresso ({counts.IN_PROGRESS})
                        </button>
                        <button
                            onClick={() => setStatusFilter('IN_REVISION')}
                            className={`${styles.chip} ${styles.inRevision} ${statusFilter === 'IN_REVISION' ? styles.active : ''}`}
                        >
                            <Flag strokeWidth={3}/>
                            Em revisão ({counts.IN_REVISION})
                        </button>
                        <button
                            onClick={() => setStatusFilter('DONE')}
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
                                    <div className={`${styles.columnHeader} ${statusClass(status)}`}>
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
                                                    statusClass={statusClass}
                                                    handleAssignTask={handleAssignTask}
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
                                statusClass={statusClass}
                                handleAssignTask={handleAssignTask}
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