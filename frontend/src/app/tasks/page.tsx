'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, UserPlus, AlertCircle, Briefcase, Activity, Plus, ScanEye, Flag, BookmarkCheck } from 'lucide-react';

import styles from './tasks.module.scss';

// Mocking backend DTO structure
interface TaskMemberDTO {
    id: string;

    user: {
        id: string;
        name: string;
        email: string;
    };
}

interface TaskDTO {
    id: number;
    name: string;
    description: string;
    categoryId?: string;
    areaId?: number;
    leaderId?: string;
    managerId?: string;
    status:
        'NOT_STARTED' |
        'IN_PROGRESS' |
        'IN_REVISION' |
        'DONE';
    active: boolean;
    dateLimit: string;
    members: TaskMemberDTO[];
}

export default function TasksPage() {
    const [tasks, setTasks]           = useState<TaskDTO[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [loading, setLoading]       = useState(true);

    useEffect(() => {
        const mockTasks: TaskDTO[] = [
            {
                id: 1,
                name:'Revisar Aerodinâmica Dianteira',
                description: 'Verificar os dados do túnel de vento para a asa dianteira do veículo.',
                categoryId: '1',
                leaderId: '1',
                managerId: '1',
                status: 'IN_PROGRESS',
                active: true, 
                dateLimit: '2026-05-15T00:00:00Z',
                members: []
            },
            {
                id: 2,
                name: 'Calibração de Sensores',
                description: 'Ajustar os sensores de telemetria no chassi conforme protocolo.',
                categoryId: '2',
                leaderId: '2',
                managerId: '2',
                status: 'NOT_STARTED',
                active: true,
                dateLimit: '2026-05-20T00:00:00Z',
                members: []
            },
            {
                id: 3,
                name: 'Design de Chassi',
                description: 'Estruturas de aço tubulares precisam de revisão estrutural completa.',
                categoryId: '2',
                leaderId: '2',
                managerId: '2',
                status: 'DONE',
                active: false, dateLimit: '2026-05-01T00:00:00Z',
                members: []
            },
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
        if (status === 'IN_PROGRESS') return styles.inProgress;
        return styles.notStarted;
    }

    return (
        <div className={styles.tasks}>

            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.headerInfo}>
                        <img src="/badger-tasks-logo-light.png" alt="Badger Tasks"/>
                        <p>Gestão de Tarefas - Badger Racing</p>
                    </div>
                    <div className={styles.headerIcon}>
                        <Briefcase/>
                    </div>
                </div>

                <div className={styles.searchWrapper}>
                    <Search/>
                    <input
                        type="text"
                        placeholder="Buscar tarefas..."
                        autoComplete="off"
                    />
                </div>

                <div className={styles.filters}>
                    <button
                        onClick={() => setStatusFilter('ALL')}
                        className={`${styles.chip} ${styles.all} ${statusFilter === 'ALL' ? styles.active : ''}`}
                    >
                        <ScanEye/>
                        Todas (3)
                    </button>
                    <button
                        onClick={() => setStatusFilter('NOT_STARTED')}
                        className={`${styles.chip} ${styles.notStarted} ${statusFilter === 'NOT_STARTED' ? styles.active : ''}`}
                    >
                        <AlertCircle/>
                        Pendentes (1)
                    </button>
                    <button
                        onClick={() => setStatusFilter('IN_PROGRESS')}
                        className={`${styles.chip} ${styles.inProgress} ${statusFilter === 'IN_PROGRESS' ? styles.active : ''}`}
                    >
                        <Activity/>
                        Em Progresso (1)
                    </button>
                    <button
                        onClick={() => setStatusFilter('IN_REVISION')}
                        className={`${styles.chip} ${styles.inRevision} ${statusFilter === 'IN_REVISION' ? styles.active : ''}`}
                    >
                        <Flag/>
                        Em revisão (0)
                    </button>
                    <button
                        onClick={() => setStatusFilter('DONE')}
                        className={`${styles.chip} ${styles.done} ${statusFilter === 'DONE' ? styles.active : ''}`}
                    >
                        <CheckCircle/>
                        Concluídas (1)
                    </button>
                </div>
            </header>

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
                                    <span className={styles.activeBadge}>
                                        <BookmarkCheck/>
                                        Ativa
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
                                        <UserPlus/>
                                        Assumir
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </main>

            <div className={styles.fab}>
                <button aria-label="Nova tarefa">
                    <Plus
                        strokeWidth={3}
                    />
                </button>
            </div>
        </div>
    );
}