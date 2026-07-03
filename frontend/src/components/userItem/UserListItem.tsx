import styles from './userListItem.module.scss';
import { getInitials } from '@/utils/userHelpers';
import { X } from 'lucide-react';
import { User } from '@/types/User';

type UserListItemProps = {
    user: User;
    onClick: () => (void);
}

export function UserListItem({user, onClick}: UserListItemProps) {
    return (
        <div className={styles.userItem}>
            <div className={styles.userInfo}>

                <div className={styles.avatar}>
                    <span>{getInitials(user.name)}</span>
                </div>

                <span className={styles.userName}>{user.name}</span>
            </div>

            <X onClick={onClick}/>
        </div>
    );
}