import { Activity, AlertCircle, CheckCircle, Flag, LogOut, ScanEye, Search, ShieldCog, User } from 'lucide-react';
import styles from './header.module.scss';
import { Loading } from '../loading/Loading';
import { UserSession } from '@/utils/auth';
import { AreaName, RoleName } from '@/types/Enums';

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
    areaLabel:          (s: AreaName) => string;
    areaClass:          (s: AreaName) => string;
    roleLabel:          (s: RoleName) => string;
    roleClass:          (s: RoleName) => string;
    onStatusFilter:     (status: string) => void;
    onLogout:           () => void;
}

export function Header({
    loading,
    statusFilter,
    counts,
    isAdmin,
    currentUser,
    areaLabel,
    areaClass,
    roleLabel,
    roleClass,
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
                        <p>
                            {currentUser.name}
                        </p>
                        {currentUser.role != 'CAPTAIN' &&
                            <p className={`${styles.areaBadge} ${styles[areaClass(currentUser.area)]}`}>
                                {areaLabel(currentUser.area)}
                            </p>
                        }
                        <p className={`${styles.roleBadge} ${styles[roleClass(currentUser.role)]}`}>
                            {roleLabel(currentUser.role)}
                        </p>
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