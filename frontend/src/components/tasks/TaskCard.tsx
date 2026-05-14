import { BookmarkCheck, ClockCheck, Grip, ListChecks, ListTodo, ListX, UserCheck, UserPlus } from 'lucide-react';
import styles from './taskCard.module.scss';

import { Task } from '@/types/Task';
import { AreaName } from '@/types/Enums';
import { Badge } from '../badge/Badge';
import { AREA_BADGES, STATUS_BADGES } from '@/utils/taskHelpers';

type TaskCardProps = {
    task: Task;
    handleAssignTask:   ( id: string) => void;
    viewMode?: 'column' | 'grid';
    currentUserId: string | null;
}

export function TaskCard({
    task,
    handleAssignTask,
    currentUserId, 
    viewMode
}: TaskCardProps) {
    return (
        <div className={styles.task}>
            <div className={styles.taskHeader}>
                <div>
                    {viewMode === 'grid' && (
                        <Badge data={STATUS_BADGES[task.status]}/>
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
                    <Badge data={AREA_BADGES[task.area.name]}/>
                    <Badge
                        label={task.category.name}
                        variant='category'
                    />
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
                {task.status !== 'DONE' && !task.assignedTo.some(u => u.id === currentUserId) && (
                    <button
                        onClick={() => handleAssignTask(task.id)}
                        className={styles.taskAssignButton}
                    >
                        <UserPlus/>
                        Assumir
                    </button>
                )}
                {task.status !== 'DONE' && task.assignedTo.some(u => u.id === currentUserId) && (
                    <button
                        className={`${styles.taskAssignButton} ${styles.disabled}`}
                        disabled={true}
                    >
                        <UserCheck/>
                        Atribuída
                    </button>
                )}
            </div>
        </div>
    );
}