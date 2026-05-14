import { Activity, AlertCircle, CheckCircle, Flag, LogOut, ScanEye, Search, ShieldCog, User } from 'lucide-react';
import styles from './header.module.scss';
import { Loading } from '../loading/Loading';
import { UserSession } from '@/utils/auth';
import { AreaName, RoleName } from '@/types/Enums';
import { AREA_BADGES, ROLE_BADGES } from '@/utils/taskHelpers';
import { Badge } from '../badge/Badge';

type Counts = {
    ALL:         number;
    NOT_STARTED: number;
    IN_PROGRESS: number;
    IN_REVISION: number;
    DONE:        number;
}

type HeaderProps = {
    loading:            boolean;
    statusFilter:       string;
    counts:             Counts;
    isAdmin:            boolean;
    currentUser:        UserSession | null;
    onStatusFilter:     (status: string) => void;
    onLogout:           () => void;
}

export function Header({
    loading,
    statusFilter,
    counts,
    isAdmin,
    currentUser,
    onStatusFilter,
    onLogout
}: HeaderProps) {

    return (
        <header className={styles.header}>
            <div className={styles.headerTop}>
                <div className={styles.headerBranding}>
                    <img src="/badger-tasks-logo-light.png" alt="Badger Tasks"/>
                </div>
                <div className={styles.headerSearch}>
                    <Search/>
                    <input
                        type="text"
                        placeholder="Buscar tarefas..."
                        autoComplete="off"
                    />
                </div>

                <div className={styles.headerActions}>
                    {/*
                        placeholder:
                        it now only logs out. in the future, it should display
                        user data.
                    */}
                    <button onClick={onLogout}>
                        {/*<User strokeWidth={2}/>*/}
                        <LogOut strokeWidth={2}/>
                    </button>

                    {isAdmin &&
                        <button>
                            <ShieldCog strokeWidth={2}/>
                        </button>
                    }
                </div>
            </div>

            <div className={styles.headerBottom}>

                <div className={styles.headerFilters}>
                    <button
                        onClick={() => onStatusFilter('ALL')}
                        className={`${styles.chip} ${styles.all} ${statusFilter === 'ALL' ? styles.active : ''}`}
                    >
                        <ScanEye strokeWidth={3}/>
                        Todas 
                        {loading ? (
                            <Loading
                                type='SPINNER'
                                size='SMALL'
                            />
                        ) : (
                            ` (${counts.ALL})`
                        )}
                    </button>
                    <button
                        onClick={() => onStatusFilter('NOT_STARTED')}
                        className={`${styles.chip} ${styles.notStarted} ${statusFilter === 'NOT_STARTED' ? styles.active : ''}`}
                    >
                        <AlertCircle strokeWidth={3}/>
                        Pendentes 
                        {loading ? (
                            <Loading
                                type='SPINNER'
                                size='SMALL'
                            />
                        ) : (
                            ` (${counts.NOT_STARTED})`
                        )}
                    </button>
                    <button
                        onClick={() => onStatusFilter('IN_PROGRESS')}
                        className={`${styles.chip} ${styles.inProgress} ${statusFilter === 'IN_PROGRESS' ? styles.active : ''}`}
                    >
                        <Activity strokeWidth={3}/>
                        Em Progresso 
                        {loading ? (
                            <Loading
                                type='SPINNER'
                                size='SMALL'
                            />
                        ) : (
                            ` (${counts.IN_PROGRESS})`
                        )}
                    </button>
                    <button
                        onClick={() => onStatusFilter('IN_REVISION')}
                        className={`${styles.chip} ${styles.inRevision} ${statusFilter === 'IN_REVISION' ? styles.active : ''}`}
                    >
                        <Flag strokeWidth={3}/>
                        Em Revisão 
                        {loading ? (
                            <Loading
                                type='SPINNER'
                                size='SMALL'
                            />
                        ) : (
                            ` (${counts.IN_REVISION})`
                        )}
                    </button>
                    <button
                        onClick={() => onStatusFilter('DONE')}
                        className={`${styles.chip} ${styles.done} ${statusFilter === 'DONE' ? styles.active : ''}`}
                    >
                        <CheckCircle strokeWidth={3}/>
                        Concluídas 
                        {loading ? (
                            <Loading
                                type='SPINNER'
                                size='SMALL'
                            />
                        ) : (
                            ` (${counts.DONE})`
                        )}
                    </button>
                </div>

                <div className={styles.headerUser}>
                    {currentUser ? (
                    <>
                        <div className={styles.userAvatar} title={currentUser.name}>
                            {/* {user.photoUrl ? (
                                <img
                                    src={user.photoUrl}
                                    alt={user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                />
                            ) : (
                                <span>{user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                            )} */}
                            <span>{currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                        </div>
                        <p>
                            {currentUser.name}
                        </p>
                        {currentUser.role != 'CAPTAIN' &&
                            <Badge data={AREA_BADGES[currentUser.area]} />
                        }
                            <Badge data={ROLE_BADGES[currentUser.role]} />
                    </>
                    ) : (
                        <Loading
                            size='SMALL'
                            type='HORIZONTAL'
                            content='seus dados'
                        />
                    )
                    }
                </div>
            </div>
        </header>
    );
}