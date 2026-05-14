import { Activity, AlertCircle, CheckCircle, Flag, ScanEye, Search, ShieldCog, User } from 'lucide-react';
import styles from './header.module.scss';

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
    onStatusFilter:     (status: string) => void;
}

export function Header({
    loading,
    statusFilter,
    counts,
    onStatusFilter
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
                    <button>
                        <User strokeWidth={2}/>
                    </button>

                    <button>
                        <ShieldCog strokeWidth={2}/>
                    </button>
                </div>
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
                        onClick={() => onStatusFilter('ALL')}
                        className={`${styles.chip} ${styles.all} ${statusFilter === 'ALL' ? styles.active : ''}`}
                    >
                        <ScanEye strokeWidth={3}/>
                        Todas ({counts.ALL})
                    </button>
                    <button
                        onClick={() => onStatusFilter('NOT_STARTED')}
                        className={`${styles.chip} ${styles.notStarted} ${statusFilter === 'NOT_STARTED' ? styles.active : ''}`}
                    >
                        <AlertCircle strokeWidth={3}/>
                        Pendentes ({counts.NOT_STARTED})
                    </button>
                    <button
                        onClick={() => onStatusFilter('IN_PROGRESS')}
                        className={`${styles.chip} ${styles.inProgress} ${statusFilter === 'IN_PROGRESS' ? styles.active : ''}`}
                    >
                        <Activity strokeWidth={3}/>
                        Em Progresso ({counts.IN_PROGRESS})
                    </button>
                    <button
                        onClick={() => onStatusFilter('IN_REVISION')}
                        className={`${styles.chip} ${styles.inRevision} ${statusFilter === 'IN_REVISION' ? styles.active : ''}`}
                    >
                        <Flag strokeWidth={3}/>
                        Em revisão ({counts.IN_REVISION})
                    </button>
                    <button
                        onClick={() => onStatusFilter('DONE')}
                        className={`${styles.chip} ${styles.done} ${statusFilter === 'DONE' ? styles.active : ''}`}
                    >
                        <CheckCircle strokeWidth={3}/>
                        Concluídas ({counts.DONE})
                    </button>
                    </>
                )}
            </div>
        </header>
    );
}