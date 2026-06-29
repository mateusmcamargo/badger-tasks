'use client';

import { useState, useEffect } from 'react';
import {
    X, NotebookPen, Bookmark,
    BriefcaseBusiness, UserCog, UserStar, Hourglass,
    CopyCheck, UserSearch, SquarePen,
} from 'lucide-react';

import styles from './taskForm.module.scss';
import { FloatingPanel } from '@/components/floatingPanel/FloatingPanel';
import Field from '@/components/forms/Field';
import SelectField from '@/components/forms/SelectField';
import TextAreaField from '@/components/forms/TextAreaField';
import { Button } from '@/components/forms/Button';
import { StepList, StepRow } from '@/components/stepList/StepList';
import { TaskRequest, createTask } from '@/services/taskService';
import { getAreas } from '@/services/areaService';
import { getCategories } from '@/services/categoryService';
import { getUsersByArea } from '@/services/userService';
import { Area } from '@/types/Area';
import { Category } from '@/types/Category';
import { User } from '@/types/User';
import { UserSession } from '@/utils/auth';
import { AREA_BADGES, USER_BADGES } from '@/utils/taskHelpers';
import { Badge } from '@/components/badge/Badge';

type TaskFormProps = {
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

export function TaskForm({ currentUser, onClose, onSuccess }: TaskFormProps) {

    const isCaptain = currentUser?.role === 'CAPTAIN';

    const [name,        setName]        = useState('');
    const [description, setDescription] = useState('');
    const [categoryId,  setCategoryId]  = useState('');
    const [areaId,      setAreaId]      = useState('');
    const [status,      setStatus]      = useState('NOT_STARTED');
    const [active,      setActive]      = useState(true);
    const [dateLimit,   setDateLimit]   = useState('');
    const [steps,       setSteps]       = useState<StepRow[]>([]);
    const [memberIds,   setMemberIds]   = useState<string[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState('');

    const [areas,      setAreas]      = useState<Area[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [leader,     setLeader]     = useState<User | null>(null);
    const [manager,    setManager]    = useState<User | null>(null);
    const [members,    setMembers]    = useState<User[]>([]);

    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState<string | null>(null);

    useEffect(() => {
        getCategories().then(setCategories).catch(() => {});
        if (isCaptain) getAreas().then(setAreas).catch(() => {});
    }, [isCaptain]);

    useEffect(() => {
        if (!isCaptain && currentUser?.area) {
            getAreas().then(fetched => {
                const match = fetched.find(a => a.name === currentUser.area);
                if (match) setAreaId(match.id);
            }).catch(() => {});
        }
    }, [isCaptain, currentUser]);

    useEffect(() => {
        if (!areaId) { setLeader(null); setManager(null); setMembers([]); return; }
        getUsersByArea(areaId).then(users => {
            setLeader(users.find(u => u.role.name === 'LEADER')   ?? null);
            setManager(users.find(u => u.role.name === 'MANAGER') ?? null);
            setMembers(users.filter(u => u.role.name === 'MEMBER'));
        }).catch(() => {});
    }, [areaId]);

    function removeMember(id: string) {
        setMemberIds(prev => prev.filter(m => m !== id));
    }

    const assignedMembers  = members.filter(u => memberIds.includes(u.id));
    const availableMembers = members.filter(u => !memberIds.includes(u.id));
    const memberOptions    = availableMembers.map(u => ({ value: u.id, label: u.name }));
    const areaOptions      = areas.map(a => ({ value: a.id, label: AREA_BADGES[a.name]?.label ?? a.name }));
    const categoryOptions  = categories.map(c => ({ value: c.id, label: c.name }));

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!leader)  { setError('Nenhum líder encontrado para esta área');  return; }
        if (!manager) { setError('Nenhum gestor encontrado para esta área'); return; }
        if (steps.some(s => !s.name.trim())) { setError('Todos os passos precisam ter um nome'); return; }

        setLoading(true);
        try {
            const payload: TaskRequest = {
                name,
                description:  description || undefined,
                categoryId,
                areaId,
                leaderId:     leader.id,
                managerId:    manager.id,
                status:       status as TaskRequest['status'],
                active,
                dateLimit:    dateLimit ? `${dateLimit}T00:00:00` : undefined,
                steps:        steps.length    > 0 ? steps.map(s => ({
                    name:        s.name,
                    description: s.description,
                    priority:    s.priority,
                    done:        false,
                })) : undefined,
                memberIds:    memberIds.length > 0 ? memberIds : undefined,
            };
            await createTask(payload);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao criar tarefa');
        } finally {
            setLoading(false);
        }
    }

    const formFooter = (
        <div className={styles.formActions}>
            <Button label='Cancelar' icon={X} variant='secondary' onClick={onClose} />
            <Button label='Criar Tarefa' loadingLabel='Criando...' type='submit' loading={loading} />
        </div>
    );

    return (
        <FloatingPanel
            headerIcon={SquarePen}
            headerTitle='Nova Tarefa'
            headerText='Nova Tarefa'
            loading={loading}
            error={error}
            onClose={onClose}
            footer={formFooter}
        >
            <form onSubmit={handleSubmit} className={styles.formBody}>

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
                        onChange={setAreaId}
                        options={areaOptions}
                        placeholder='Selecione a área'
                        required
                    />
                ) : (
                    <Field
                        icon={BriefcaseBusiness}
                        id='taskArea'
                        label='Área'
                        value={currentUser?.area ? (AREA_BADGES[currentUser.area]?.label ?? currentUser.area) : ''}
                        onChange={() => {}}
                        disabled
                    />
                )}

                <div className={styles.row}>
                    <Field
                        icon={UserStar}
                        id='taskLeader'
                        label='Líder'
                        value={leader?.name ?? (areaId ? 'Carregando...' : 'Selecione a área para ver')}
                        onChange={() => {}}
                        disabled
                    />
                    <Field
                        icon={UserCog}
                        id='taskManager'
                        label='Gestor'
                        value={manager?.name ?? (areaId ? 'Carregando...' : 'Selecione a área para ver')}
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
                        onChange={setStatus}
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
                    onChange={id => {
                        if (id && !memberIds.includes(id)) {
                            setMemberIds(prev => [...prev, id]);
                        }
                        setSelectedMemberId('');
                    }}
                    options={memberOptions}
                    placeholder={
                        !areaId                       ? 'Selecione a área primeiro'             :
                        members.length === 0          ? 'Nenhum membro disponível'              :
                        availableMembers.length === 0 ? 'Todos os membros foram adicionados'    :
                        'Selecione os membros'
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

                <StepList
                    steps={steps}
                    onChange={setSteps}
                    variant='create'
                />

            </form>
        </FloatingPanel>
    );
}