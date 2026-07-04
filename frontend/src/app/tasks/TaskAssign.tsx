'use client';

import { useState, useEffect, useRef } from 'react';
import { UserPlus, Search, UserCheck, Bookmark, MessageCircleDashed, SearchAlert } from 'lucide-react';

import styles from './taskAssign.module.scss';
import { FloatingPanel } from '@/components/floatingPanel/FloatingPanel';
import { assignMember } from '@/services/taskService';
import { getAssignableMembers, AssignableUser } from '@/services/userService';
import { Task } from '@/types/Task';
import { UserSession } from '@/utils/auth';
import { Badge } from '@/components/badge/Badge';
import { AREA_BADGES } from '@/utils/taskHelpers';
import Field from '@/components/forms/Field';
import { getInitials } from '@/utils/userHelpers';
import { UserAssignItem } from '@/components/userItem/UserAssignItem';

type TaskAssignProps = {
    task:        Task;
    currentUser: UserSession | null;
    onClose:     () => void;
    onSuccess:   () => void;
};

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
                {!loading && (
                    <>
                    {users.length === 0
                        ? 'Nenhum membro disponível para atribuir.'
                        : users.length === 1 ?
                        '1 membro disponível'
                        : 
                        <>
                        {`${users.length} membros disponíveis`}
                        </>
                    }
                    </>
                )}
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
                <div className={styles.taskInfo}>
                    <p className={styles.taskName}>{task.name}</p>

                    <div className={styles.taskBadges}>
                        <Badge data={AREA_BADGES[task.area.name]}/>
                        <Badge icon={Bookmark} label={task.category.name} variant='category'/>
                    </div>
                </div>

                <Field
                    icon={Search}
                    id='inputUserSeach'
                    label=''
                    placeholder='Busque por nome...'
                    value={search}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                    autoFocus
                />

                <div className={styles.userList}>
                    {loading ? (
                        <p className={styles.hint}>Buscando...</p>
                    ) : users.length === 0 ? (
                        <p className={styles.hint}>
                            <SearchAlert/>
                            Nenhum membro encontrado.
                        </p>
                    ) : (
                        users.map(user => {
                            const isAssigning  = assigning === user.id;
                            const isAssigned  = justAssigned.has(user.id);
                            return (
                                <UserAssignItem
                                    key={user.id}
                                    user={user}
                                    onClick={() => handleAssign(user.id)}
                                    isAssigned={isAssigned}
                                    isAssigning={isAssigning}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </FloatingPanel>
    );
}