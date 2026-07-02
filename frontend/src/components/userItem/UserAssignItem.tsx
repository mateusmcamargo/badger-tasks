import styles from './userAssignItem.module.scss';
import { getInitials } from '@/utils/userHelpers';
import { AssignableUser } from '@/services/userService';
import { Button } from '../forms/Button';
import { UserCheck, UserPlus } from 'lucide-react';

type UserAssignItemProps = {
    user: AssignableUser;
    onClick: () => (void);
    isAssigning: boolean;
    isAssigned:  boolean;
}

export function UserAssignItem({user, onClick, isAssigning, isAssigned}: UserAssignItemProps) {
    return (
        <div className={styles.userItem}>
            <div className={styles.avatar}>
                <span>{getInitials(user.name)}</span>
            </div>

            <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.taskCount}>
                    {user.assignedTaskCount > 0 ? (
                        <>
                        {user.assignedTaskCount}
                        {user.assignedTaskCount === 1  ? 'tarefa atribuída' : 'tarefas atribuídas'}
                        </>
                    ): (
                        'Nenhuma tarefa atribuída'
                    )}
                </span>
            </div>

            {isAssigned ? (
                <Button
                    icon={UserCheck}
                    onClick={onClick}
                    disabled={isAssigning || isAssigned}
                    loading={isAssigning}
                    label='Atribuído'
                    loadingLabel='Atribuindo...'
                    variant='save'              
                />
            ) : (
                <Button
                    icon={UserPlus}
                    onClick={onClick}
                    disabled={isAssigning || isAssigned}
                    loading={isAssigning}
                    label='Atribuir'
                    loadingLabel='Atribuindo...'
                    variant='save'              
                />
            )}
        </div>
    );
}