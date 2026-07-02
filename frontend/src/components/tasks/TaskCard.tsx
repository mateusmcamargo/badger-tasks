import { Bookmark, BookmarkCheck, BookmarkOff, ClockCheck, Grip, Handshake, ListChecks, ListTodo, ListX, PartyPopper, UserCheck, UserPlus } from 'lucide-react';
import styles from './taskCard.module.scss';

import { Task } from '@/types/Task';
import { Badge } from '../badge/Badge';
import { AREA_BADGES, STATUS_BADGES } from '@/utils/taskHelpers';
import { isCaptain, isMember, UserSession } from '@/utils/auth';

type TaskCardProps = {
    task:               Task;
    currentUser:        UserSession | null;
    handleTakeOnTask:   (id: string) => void;
    handleAssignTask:   (task: Task) => void;
    onOpenTask:         (task: Task) => void;
    viewMode?:          'column' | 'grid';
}

export function TaskCard({
    task,
    currentUser,
    handleTakeOnTask,
    handleAssignTask,
    onOpenTask,
    viewMode
}: TaskCardProps) {

    const userIsAssigned     = task.assignedTo.some(user => user.id === currentUser?.id);
    const userIsLinked       = currentUser?.id === task.leader?.id   ||
                               currentUser?.id === task.manager?.id;
                    
    const userHasSameArea    = currentUser?.area === task.area.name;
    
    const userCanSelfAssign  = isMember() && userHasSameArea && !userIsAssigned;
    const userCanAssignOther = !isMember() && (isCaptain() || userHasSameArea);

    return (
        <div className={styles.task} onClick={() => onOpenTask(task)}>
            <div className={styles.taskHeader}>
                <div>
                    {viewMode === 'grid' && (
                        <Badge data={STATUS_BADGES[task.status]}/>
                    )}
                    {task.active ? (
                        <span className={styles.activeBadge}>
                            <BookmarkCheck/>
                            Ativa
                        </span>
                    ) : (
                        <span className={styles.activeBadge}>
                            <BookmarkOff/>
                            Inativa
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
                        icon={Bookmark}
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

                {task.status !== 'DONE' && (
                    <>
                        {userIsAssigned ? (
                            <button
                                className={`${styles.taskAssignButton} ${styles.disabled}`}
                                disabled={true}
                            >
                                <UserCheck/>
                                Atribuída
                            </button>
                        ) : userCanAssignOther ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleAssignTask(task); }}
                                className={styles.taskAssignButton}
                            >
                                <UserPlus/>
                                Atribuír
                            </button>
                        ) : userCanSelfAssign ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleTakeOnTask(task.id); }}
                                className={styles.taskAssignButton}
                            >
                                <Handshake/>
                                Assumir
                            </button>
                        ) : null}
                    </>
                )}
            </div>
        </div>
    );
}