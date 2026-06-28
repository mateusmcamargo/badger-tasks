'use client';

import { useState, useEffect, useRef } from 'react';
import { UserPlus, Search, UserCheck } from 'lucide-react';

import styles from './taskAssign.module.scss';
import { FloatingPanel } from '@/components/floatingPanel/FloatingPanel';
import { assignMember } from '@/services/taskService';
import { getAssignableMembers, AssignableUser } from '@/services/userService';
import { Task } from '@/types/Task';
import { UserSession } from '@/utils/auth';

type TaskAssignProps = {
    task:        Task;
    currentUser: UserSession | null;
    onClose:     () => void;
    onSuccess:   () => void;
};

function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export function TaskAssign({ task, currentUser, onClose, onSuccess }: TaskAssignProps) {

    const [search,       setSearch]       = useState('');
    const [users,        setUsers]        = useState<AssignableUser[]>([]);
    const [loading,      setLoading]      = useState(false);
    const [error,        setError]        = useState<string | null>(null);
    const [assigning,    setAssigning]    = useState<string | null>(null); // userId being assigned
    const [justAssigned, setJustAssigned] = useState<Set<string>>(new Set());

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const loadUsers = (nameFilter: string) => {
        setLoading(true);
        setError(null);
        getAssignableMembers(task.id, nameFilter)
            .then(setUsers)
            .catch(err => setError(err instanceof Error ? err.message : 'Erro ao buscar membros.'))
            .finally(() => setLoading(false));
    };

    // Initial load
    useEffect(() => {
        loadUsers('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task.id]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => loadUsers(value), 250);
    };

    const handleAssign = async (userId: string) => {
        setAssigning(userId);
        setError(null);
        try {
            await assignMember(task.id, userId);
            setJustAssigned(prev => new Set(prev).add(userId));
            // Remove from list after brief feedback delay
            setTimeout(() => {
                setUsers(prev => prev.filter(u => u.id !== userId));
                setJustAssigned(prev => {
                    const next = new Set(prev);
                    next.delete(userId);
                    return next;
                });
            }, 800);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao atribuir membro.');
        } finally {
            setAssigning(null);
        }
    };

    const footer = (
        <div className={styles.footer}>
            <p className={styles.footerHint}>
                {users.length === 0 && !loading
                    ? 'Nenhum membro disponível para atribuir.'
                    : `${users.length} membro${users.length !== 1 ? 's' : ''} disponível${users.length !== 1 ? 'is' : ''}`
                }
            </p>
        </div>
    );

    return (
        <FloatingPanel
            headerIcon={UserPlus}
            headerTitle={task.name}
            headerText='Atribuir Membros'
            loading={false}
            error={error}
            onClose={onClose}
            footer={footer}
        >
            <div className={styles.body}>
                <p className={styles.taskName}>{task.name}</p>

                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} />
                    <input
                        type='text'
                        placeholder='Buscar por nome...'
                        value={search}
                        onChange={e => handleSearchChange(e.target.value)}
                        className={styles.searchInput}
                        autoFocus
                    />
                </div>

                <div className={styles.userList}>
                    {loading ? (
                        <p className={styles.hint}>Buscando...</p>
                    ) : users.length === 0 ? (
                        <p className={styles.hint}>Nenhum membro encontrado.</p>
                    ) : (
                        users.map(user => {
                            const isAssigning  = assigning === user.id;
                            const wasAssigned  = justAssigned.has(user.id);
                            return (
                                <div key={user.id} className={styles.userRow}>
                                    <div className={styles.avatar}>
                                        <span>{getInitials(user.name)}</span>
                                    </div>

                                    <div className={styles.userInfo}>
                                        <span className={styles.userName}>{user.name}</span>
                                        <span className={styles.taskCount}>
                                            {user.assignedTaskCount} {user.assignedTaskCount === 1 ? 'tarefa' : 'tarefas'}
                                        </span>
                                    </div>

                                    <button
                                        className={`${styles.assignBtn} ${wasAssigned ? styles.assigned : ''}`}
                                        onClick={() => handleAssign(user.id)}
                                        disabled={isAssigning || wasAssigned}
                                    >
                                        {wasAssigned ? (
                                            <><UserCheck /><span>Atribuído</span></>
                                        ) : isAssigning ? (
                                            <span>Salvando...</span>
                                        ) : (
                                            <><UserPlus /><span>Atribuir</span></>
                                        )}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </FloatingPanel>
    );
}