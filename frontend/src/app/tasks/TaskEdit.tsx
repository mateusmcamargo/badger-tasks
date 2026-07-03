'use client';

import { useState, useEffect } from 'react';
import {
    X, NotebookPen, Bookmark,
    BriefcaseBusiness, UserCog, UserStar, Hourglass,
    CopyCheck, UserSearch, PenLine,
    ShieldCheck, Save,
} from 'lucide-react';

import styles from './taskEdit.module.scss';
import { FloatingPanel } from '@/components/floatingPanel/FloatingPanel';
import Field from '@/components/forms/Field';
import SelectField from '@/components/forms/SelectField';
import TextAreaField from '@/components/forms/TextAreaField';
import { Button } from '@/components/forms/Button';
import { StepList, StepRow } from '@/components/stepList/StepList';
import { Task } from '@/types/Task';
import { TaskRequest, updateTask, approveTask } from '@/services/taskService';
import { assignMember, removeMember as removeMemberService } from '@/services/taskService';
import { createStep, updateStep as updateStepService, deleteStep } from '@/services/stepService';
import { getAreas } from '@/services/areaService';
import { getCategories } from '@/services/categoryService';
import { getUsersByArea } from '@/services/userService';
import { Area } from '@/types/Area';
import { Category } from '@/types/Category';
import { User } from '@/types/User';
import { UserSession } from '@/utils/auth';
import { AREA_BADGES, USER_BADGES } from '@/utils/taskHelpers';
import { Badge } from '@/components/badge/Badge';
import { UserListItem } from '@/components/userItem/UserListItem';
import { useFillFullRows } from '@/hooks/useFillFullRows';

type TaskEditProps = {
    task:        Task;
    currentUser: UserSession | null;
    onClose:     () => void;
    onSuccess:   () => void;
};

const STATUS_OPTIONS = [
    { value: 'NOT_STARTED', label: 'Não Iniciada' },
    { value: 'IN_PROGRESS', label: 'Em Progresso' },
    { value: 'IN_REVISION', label: 'Em Revisão'   },
    { value: 'DONE',        label: 'Concluída'     },
];

export function TaskEdit({ task, currentUser, onClose, onSuccess }: TaskEditProps) {

    const isCaptain    = currentUser?.role === 'CAPTAIN';
    const isInRevision = task.status === 'IN_REVISION';

    const [name,        setName]        = useState(task.name);
    const [description, setDescription] = useState(task.description ?? '');
    const [categoryId,  setCategoryId]  = useState(task.category.id);
    const [areaId,      setAreaId]      = useState(task.area.id);
    const [status,      setStatus]      = useState(task.status);
    const [active,      setActive]      = useState(task.active);
    const [dateLimit,   setDateLimit]   = useState(
        task.dateLimit ? task.dateLimit.split('T')[0] : ''
    );

    const [areas,      setAreas]      = useState<Area[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [leader,     setLeader]     = useState<User | null>(null);
    const [manager,    setManager]    = useState<User | null>(null);
    const [members,    setMembers]    = useState<User[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState<string | null>(null);

    const [assignedIds,      setAssignedIds]      = useState<string[]>(
        (task.assignedTo ?? []).map(u => u.id)
    );

    const [steps, setSteps] = useState<StepRow[]>(
        [...(task.steps ?? [])]
            .sort((a, b) => a.priority - b.priority)
            .map(s => ({
                mode:        'existing' as const,
                id:          s.id,
                name:        s.name,
                description: s.description ?? '',
                done:        s.done,
                priority:    s.priority,
                deleted:     false,
            }))
    );

    useEffect(() => {
        getCategories().then(setCategories).catch(() => {});
        if (isCaptain) getAreas().then(setAreas).catch(() => {});
    }, [isCaptain]);

    useEffect(() => {
        if (!areaId) { setLeader(null); setManager(null); setMembers([]); return; }
        getUsersByArea(areaId).then(users => {
            setLeader(users.find(u => u.role.name === 'LEADER')   ?? null);
            setManager(users.find(u => u.role.name === 'MANAGER') ?? null);
            setMembers(users.filter(u => u.role.name === 'MEMBER'));
        }).catch(() => {});
    }, [areaId]);

    function handleAreaChange(newAreaId: string) {
        setAreaId(newAreaId);
        setAssignedIds([]);
        setSelectedMemberId('');
    }

    function addMember(id: string) {
        if (!id || assignedIds.includes(id)) return;
        if (id === currentUser?.id) return;
        setAssignedIds(prev => [...prev, id]);
        setSelectedMemberId('');
    }

    function removeMember(id: string) {
        setAssignedIds(prev => prev.filter(m => m !== id));
    }

    async function handleSave() {
        setError(null);

        const visibleSteps = steps.filter(s => !(s.mode === 'existing' && s.deleted));
        if (visibleSteps.some(s => !s.name.trim())) {
            setError('Todos os passos precisam ter um nome');
            return;
        }
        if (!leader || !manager) {
            setError('Área sem líder ou gestor definido');
            return;
        }

        setLoading(true);
        try {
            const payload: TaskRequest = {
                name,
                description: description || undefined,
                categoryId,
                areaId,
                leaderId:  leader.id,
                managerId: manager.id,
                status:    status as TaskRequest['status'],
                active,
                dateLimit: dateLimit ? `${dateLimit}T00:00:00` : undefined,
            };
            await updateTask(task.id, payload);

            await Promise.all(steps.map(async s => {
                if (s.mode === 'existing' && s.deleted) {
                    await deleteStep(s.id);
                } else if (s.mode === 'existing') {
                    const orig = task.steps?.find(o => o.id === s.id);
                    if (orig && (orig.name !== s.name || (orig.description ?? '') !== s.description)) {
                        await updateStepService(s.id, { name: s.name, description: s.description, priority: s.priority });
                    }
                } else {
                    await createStep(task.id, { name: s.name, description: s.description, priority: s.priority });
                }
            }));

            const originalMemberIds = new Set((task.assignedTo ?? []).map(u => u.id));
            const toAdd    = assignedIds.filter(id => !originalMemberIds.has(id));
            const toRemove = [...originalMemberIds].filter(id => !assignedIds.includes(id));

            await Promise.all([
                ...toAdd.map(id    => assignMember(task.id, id)),
                ...toRemove.map(id => removeMemberService(task.id, id)),
            ]);

            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar tarefa');
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove() {
        setLoading(true);
        setError(null);
        try {
            await approveTask(task.id);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao aprovar tarefa');
        } finally {
            setLoading(false);
        }
    }

    const areaOptions     = areas.map(a => ({ value: a.id, label: AREA_BADGES[a.name]?.label ?? a.name }));
    const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

    const assignedMembers  = members.filter(u => assignedIds.includes(u.id));
    const availableMembers = members.filter(u => !assignedIds.includes(u.id) && u.id !== currentUser?.id);
    const memberOptions    = availableMembers.map(u => ({ value: u.id, label: u.name }));
    const tagListRef       = useFillFullRows<HTMLUListElement>(styles.grow, [assignedMembers.length]);
    
    const formFooter = (
        <div className={styles.panelActions}>
            <Button
                label='Cancelar'
                icon={X}
                variant='secondary'
                onClick={onClose}
            />
            {isInRevision && (
                <Button
                    label='Aprovar'
                    icon={ShieldCheck}
                    variant='approve'
                    loading={loading}
                    loadingLabel='Aprovando...'
                    onClick={handleApprove}
                />
            )}
            <Button
                label='Salvar'
                icon={Save}
                variant='save'
                loadingLabel='Salvando...'
                loading={loading}
                onClick={handleSave}
            />
        </div>
    );

    return (
        <FloatingPanel
            headerIcon={PenLine}
            headerTitle={task.name}
            headerText='Editar Tarefa'
            loading={loading}
            error={error}
            onClose={onClose}
            footer={formFooter}
        >
            <form id='taskEditForm' className={styles.formBody}>

                <Field
                    icon={NotebookPen}
                    id='taskName'
                    label='Título'
                    value={name}
                    onChange={setName}
                    placeholder='Ex: Relatório de Telemetria'
                    required
                />

                <TextAreaField
                    id='taskDescription'
                    label='Descrição'
                    value={description}
                    onChange={setDescription}
                    placeholder='Descreva o objetivo da tarefa...'
                />

                <SelectField
                    icon={Bookmark}
                    id='taskCategory'
                    label='Categoria'
                    value={categoryId}
                    onChange={setCategoryId}
                    options={categoryOptions}
                    placeholder='Selecione a categoria'
                    required
                />

                {isCaptain ? (
                    <SelectField
                        icon={BriefcaseBusiness}
                        id='taskArea'
                        label='Área'
                        value={areaId}
                        onChange={handleAreaChange}
                        options={areaOptions}
                        placeholder='Selecione a área'
                        required
                    />
                ) : (
                    <Field
                        icon={BriefcaseBusiness}
                        id='taskArea'
                        label='Área'
                        value={AREA_BADGES[task.area.name]?.label ?? task.area.name}
                        onChange={() => {}}
                        disabled
                    />
                )}

                <div className={styles.row}>
                    <Field
                        icon={UserStar}
                        id='taskLeader'
                        label='Líder'
                        value={leader?.name ?? task.leader.name}
                        onChange={() => {}}
                        disabled
                    />
                    <Field
                        icon={UserCog}
                        id='taskManager'
                        label='Gestor'
                        value={manager?.name ?? task.manager.name}
                        onChange={() => {}}
                        disabled
                    />
                </div>

                <div className={styles.row}>
                    <SelectField
                        icon={CopyCheck}
                        id='taskStatus'
                        label='Status'
                        value={status}
                        onChange={(status) => setStatus(
                            status as 'NOT_STARTED' | 'IN_PROGRESS' | 'IN_REVISION' | 'DONE'
                        )}
                        options={STATUS_OPTIONS}
                        required
                    />
                    <Field
                        icon={Hourglass}
                        id='taskDateLimit'
                        label='Prazo'
                        value={dateLimit}
                        onChange={setDateLimit}
                        type='date'
                    />
                </div>

                <div className={styles.activeToggle}>
                    <label htmlFor='taskActive'>Tarefa ativa</label>
                    <input
                        id='taskActive'
                        type='checkbox'
                        checked={active}
                        onChange={e => setActive(e.target.checked)}
                    />
                </div>

                <SelectField
                    icon={UserSearch}
                    id='memberSelect'
                    label='Membros atribuídos'
                    value={selectedMemberId}
                    onChange={addMember}
                    options={memberOptions}
                    placeholder={
                        !areaId                       ? 'Selecione a área primeiro'             :
                        members.length === 0          ? 'Nenhum membro disponível'              :
                        availableMembers.length === 0 ? 'Todos os membros foram adicionados'    :
                        'Adicionar membro'
                    }
                    disabled={!areaId || availableMembers.length === 0}
                />

                {assignedMembers.length > 0 && (
                    <ul ref={tagListRef} className={styles.tagList}>
                        {assignedMembers.map(user => (
                            <li key={user.id} className={styles.user}>
                                <UserListItem
                                    user={user}
                                    onClick={() => removeMember(user.id)}
                                />
                            </li>
                        ))}
                    </ul>
                )}

                <StepList
                    steps={steps}
                    onChange={setSteps}
                    variant='edit'
                />

            </form>
        </FloatingPanel>
    );
}