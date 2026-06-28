'use client';

import { useState, useEffect } from 'react';
import {
    X, Plus, Trash2, NotebookPen, Bookmark,
    BriefcaseBusiness, UserCog, UserStar, Hourglass,
    CopyCheck, UserSearch, PenLine,
    CheckSquare, Square,
} from 'lucide-react';

import styles from './taskForm.module.scss';
import { FloatingPanel } from '@/components/floatingPanel/FloatingPanel';
import Field from '@/components/forms/Field';
import SelectField from '@/components/forms/SelectField';
import TextAreaField from '@/components/forms/TextAreaField';
import { Button } from '@/components/forms/Button';
import { Task } from '@/types/Task';
import { TaskRequest, StepRequest, updateTask } from '@/services/taskService';
import { assignMember, removeMember as removeMemberService } from '@/services/taskService';
//import { createStep, updateStep as updateStepService, deleteStep } from '@/services/stepService';
import { getAreas } from '@/services/areaService';
import { getCategories } from '@/services/categoryService';
import { getUsersByArea } from '@/services/userService';
import { Area } from '@/types/Area';
import { Category } from '@/types/Category';
import { User } from '@/types/User';
import { UserSession } from '@/utils/auth';
import { AREA_BADGES, USER_BADGES } from '@/utils/taskHelpers';
import { Badge } from '@/components/badge/Badge';

type TaskEditProps = {
    task:        Task;
    currentUser: UserSession | null;
    onClose:     () => void;
    onSuccess:   () => void;
};

type StepEditRow =
    | { mode: 'existing'; id: string; name: string; description: string; done: boolean; priority: number; deleted: boolean; }
    | { mode: 'new';                  name: string; description: string; done: false;   priority: number; };

const STATUS_OPTIONS = [
    { value: 'NOT_STARTED', label: 'Não Iniciada' },
    { value: 'IN_PROGRESS', label: 'Em Progresso' },
    { value: 'IN_REVISION', label: 'Em Revisão'   },
    { value: 'DONE',        label: 'Concluída'     },
];

export function TaskEdit({ task, currentUser, onClose, onSuccess }: TaskEditProps) {

    const isCaptain = currentUser?.role === 'CAPTAIN';

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

    // track IDs currently assigned, seeded from task
    const [assignedIds,      setAssignedIds]      = useState<string[]>(
        (task.assignedTo ?? []).map(u => u.id)
    );
    const [selectedMemberId, setSelectedMemberId] = useState('');

    const [steps, setSteps] = useState<StepEditRow[]>(
        [...(task.steps ?? [])]
            .sort((a, b) => a.priority - b.priority)
            .map(s => ({
                mode:        'existing',
                id:          s.id,
                name:        s.name,
                description: s.description ?? '',
                done:        s.done,
                priority:    s.priority,
                deleted:     false,
            }))
    );

    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState<string | null>(null);

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

    // when captain changes area, reset member assignments
    function handleAreaChange(newAreaId: string) {
        setAreaId(newAreaId);
        setAssignedIds([]);
        setSelectedMemberId('');
    }

    // step handlers
    function addStep() {
        const visibleCount = steps.filter(s => !(s.mode === 'existing' && s.deleted)).length;
        setSteps(prev => [...prev, {
            mode:        'new',
            name:        '',
            description: '',
            done:        false,
            priority:    visibleCount + 1,
        }]);
    }

    function removeStep(index: number) {
        setSteps(prev => prev.map((s, i) => {
            if (i !== index) return s;
            if (s.mode === 'existing') return { ...s, deleted: true };
            return s; // will be filtered below for 'new' rows
        }).filter((s, i) => !(i === index && s.mode === 'new')));
    }

    function updateStepField(index: number, field: 'name' | 'description', value: string) {
        setSteps(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
    }

    // member handlers
    function addMember(id: string) {
        if (!id || assignedIds.includes(id)) return;
        // prevent self-assignment for all admin roles
        if (id === currentUser?.id) return;
        setAssignedIds(prev => [...prev, id]);
        setSelectedMemberId('');
    }

    function removeMember(id: string) {
        setAssignedIds(prev => prev.filter(m => m !== id));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
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

            // const originalIds = new Set((task.steps ?? []).map(s => s.id));

            await Promise.all(steps.map(async s => {
                if (s.mode === 'existing' && s.deleted) {
                    //await deleteStep(s.id);
                } else if (s.mode === 'existing') {
                    const orig = task.steps?.find(o => o.id === s.id);
                    if (orig && (orig.name !== s.name || (orig.description ?? '') !== s.description)) {
                        //await updateStepService(s.id, { name: s.name, description: s.description });
                    }
                } else {
                    // new step
                    //await createStep(task.id, { name: s.name, description: s.description, priority: s.priority });
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

    const areaOptions     = areas.map(a => ({ value: a.id, label: AREA_BADGES[a.name]?.label ?? a.name }));
    const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

    const assignedMembers  = members.filter(u => assignedIds.includes(u.id));
    const availableMembers = members.filter(u => !assignedIds.includes(u.id) && u.id !== currentUser?.id);

    const memberOptions = availableMembers.map(u => ({ value: u.id, label: u.name }));

    const visibleSteps = steps
        .map((s, index) => ({ s, index }))
        .filter(({ s }) => !(s.mode === 'existing' && s.deleted));

    const formFooter = (
        <div className={styles.formActions}>
            <Button
            label='Cancelar'
            variant='secondary'
            onClick={onClose}
        />
            <Button
                label='Salvar'
                loadingLabel='Salvando...'
                type='submit'
                loading={loading}
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
            <form id='taskEditForm' onSubmit={handleSubmit} className={styles.formBody}>

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
                        !areaId                       ? 'Selecione a área primeiro'          :
                        members.length === 0          ? 'Nenhum membro disponível'            :
                        availableMembers.length === 0 ? 'Todos os membros foram adicionados'  :
                        'Adicionar membro'
                    }
                    disabled={!areaId || availableMembers.length === 0}
                />

                {assignedMembers.length > 0 && (
                    <ul className={styles.tagList}>
                        {assignedMembers.map(user => (
                            <li key={user.id}>
                                <Badge
                                    data={USER_BADGES[user.role.name]}
                                    label={user.name}
                                    action={{
                                        icon:    X,
                                        onClick: () => removeMember(user.id),
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                )}

                <h3 className={styles.sectionTitle}>Passos</h3>

                {visibleSteps.map(({ s, index }) => (
                    <div key={s.mode === 'existing' ? s.id : `new-${index}`} className={styles.stepRow}>
                        <span className={styles.stepPriority}>
                            {s.mode === 'existing' && s.done
                                ? <CheckSquare size={16} style={{ color: 'var(--color-task-done, #16a34a)' }}/>
                                : <Square size={16} style={{ color: 'var(--color-label)' }}/>
                            }
                        </span>
                        <div className={styles.stepFields}>
                            <Field
                                id={`step-name-${index}`}
                                label=''
                                value={s.name}
                                onChange={v => updateStepField(index, 'name', v)}
                                placeholder='Nome do passo'
                                required
                            />
                            <Field
                                id={`step-desc-${index}`}
                                label=''
                                value={s.description}
                                onChange={v => updateStepField(index, 'description', v)}
                                placeholder='Descrição (opcional)'
                            />
                        </div>
                        <Button
                            type='button'
                            variant='remove'
                            icon={Trash2}
                            onClick={() => removeStep(index)}
                        />
                    </div>
                ))}

                <Button
                    label='Adicionar Passo'
                    type='button'
                    variant='outline'
                    icon={Plus}
                    onClick={addStep}
                />

            </form>
        </FloatingPanel>
    );
}