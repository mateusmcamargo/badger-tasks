'use client';

import { useState } from 'react';
import {
    X, Bookmark, BriefcaseBusiness, UserStar, UserCog,
    CheckSquare, Square,
    ClipboardList,
    Info,
    FolderBookmark,
    Clock,
    TriangleAlert,
    LucideIcon,
    Play,
    Send,
    Save,
} from 'lucide-react';

import styles from './taskView.module.scss';
import { Badge } from '@/components/badge/Badge';
import { Task } from '@/types/Task';
import { toggleStepDone } from '@/services/stepService';
import { startTask, submitTask } from '@/services/taskService';
import { UserSession } from '@/utils/auth';
import { ACTIVE_BADGES, AREA_BADGES, MESSAGE_BADGES, STATUS_BADGES, USER_BADGES } from '@/utils/taskHelpers';
import { FloatingPanel } from '@/components/floatingPanel/FloatingPanel';
import { Button } from '@/components/forms/Button';

type TaskViewProps = {
    task:        Task;
    currentUser: UserSession | null;
    onClose:     () => void;
    onSuccess:   () => void;
};

type BadgeItemProps = {
    icon:     LucideIcon;
    label:    string;
    children: React.ReactNode;
};

function BadgeItem({ icon: Icon, label, children }: BadgeItemProps) {
    return (
        <div className={styles.badgeItem}>
            <div className={styles.badgeTitle}>
                {Icon && <Icon/>}
                <span>{label}</span>
            </div>
            {children}
        </div>
    );
}

export function TaskView({ task, currentUser, onClose, onSuccess }: TaskViewProps) {

    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState<string | null>(null);

    const isAssigned = task.assignedTo?.some(u => u.id === currentUser?.id) ?? false;

    let daysRemaining: number | undefined;
    if (task.dateLimit) {
        const today    = new Date();
        today.setHours(0, 0, 0, 0);
        const deadline = new Date(task.dateLimit);
        deadline.setHours(0, 0, 0, 0);
        daysRemaining  = Math.round((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    }

    const [steps, setSteps] = useState(
        [...(task.steps ?? [])].sort((a, b) => a.priority - b.priority)
    );

    function handleToggle(stepId: string) {
        setSteps(prev => prev.map(s => s.id === stepId ? { ...s, done: !s.done } : s));
    }

    async function handleSave() {
        setLoading(true);
        setError(null);

        const original = new Map((task.steps ?? []).map(s => [s.id, s.done]));
        const changed  = steps.filter(s => s.done !== original.get(s.id));

        try {
            await Promise.all(changed.map(s => toggleStepDone(s.id, s.done)));
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar');
        } finally {
            setLoading(false);
        }
    }

    async function handleStart() {
        setLoading(true);
        setError(null);
        try {
            await startTask(task.id);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao iniciar tarefa');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit() {
        setLoading(true);
        setError(null);
        try {
            await submitTask(task.id);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao enviar para revisão');
        } finally {
            setLoading(false);
        }
    }

    const isDone       = task.status === 'DONE';
    const isInRevision = task.status === 'IN_REVISION';
    const isNotStarted = task.status === 'NOT_STARTED';
    const isInProgress = task.status === 'IN_PROGRESS';

    const doneCount    = steps.filter(s => s.done).length;
    const statusBadge  = STATUS_BADGES[task.status];
    const activeBadge  = ACTIVE_BADGES[`${task.active}`];
    const leaderBadge  = USER_BADGES[task.leader.role.name];
    const managerBadge = USER_BADGES[task.manager.role.name];

    const hasStepChanges = steps.some(s => {
        const orig = task.steps?.find(o => o.id === s.id);
        return orig && orig.done !== s.done;
    });

    let footer: React.ReactNode;

    if (isDone || isInRevision) {
        footer = (
            <div className={styles.footerSingle}>
                <Button
                    icon={X}
                    label='Fechar'
                    variant='cancel'
                    onClick={onClose}
                />
            </div>
        );
    } else if (isNotStarted) {
        footer = (
            <div className={styles.footerActions}>
                <Button
                    icon={X}
                    label='Cancelar'
                    variant='cancel'
                    onClick={onClose}
                />
                <Button
                    label='Iniciar Tarefa'
                    icon={Play}
                    variant='save'
                    loading={loading}
                    loadingLabel='Iniciando...'
                    disabled={!isAssigned}
                    onClick={handleStart}
                />
            </div>
        );
    } else {
        footer = (
            <div className={styles.footerActions}>
                <Button
                    icon={X}
                    label='Cancelar'
                    variant='cancel'
                    onClick={onClose}
                />
                {hasStepChanges && (
                    <Button
                        label='Salvar Passos'
                        icon={Save}
                        variant='outline'
                        loading={loading}
                        loadingLabel='Salvando...'
                        disabled={!isAssigned}
                        onClick={handleSave}
                    />
                )}
                <Button
                    label='Enviar para Revisão'
                    icon={Send}
                    variant='save'
                    loading={loading}
                    loadingLabel='Enviando...'
                    disabled={!isAssigned}
                    onClick={handleSubmit}
                />
            </div>
        );
    }

    return (
        <FloatingPanel
            headerIcon={ClipboardList}
            headerTitle={task.name}
            headerText={task.name}
            loading={loading}
            error={error}
            onClose={onClose}
            footer={footer}
        >
            <div className={styles.memberView}>

                <h1>{task.name}</h1>

                <div className={styles.badgeColumn}>

                    <BadgeItem icon={Info} label='Status'>
                        <Badge data={statusBadge}/>
                    </BadgeItem>

                    <BadgeItem icon={Bookmark} label='Categoria'>
                        <Badge label={task.category.name} variant='category'/>
                    </BadgeItem>

                    <BadgeItem icon={FolderBookmark} label='Ativo'>
                        <Badge data={activeBadge}/>
                    </BadgeItem>

                    <BadgeItem icon={BriefcaseBusiness} label='Área'>
                        <Badge data={AREA_BADGES[task.area.name]}/>
                    </BadgeItem>

                    <BadgeItem icon={UserStar} label='Líder'>
                        <Badge label={task.leader.name} data={leaderBadge}/>
                    </BadgeItem>

                    <BadgeItem icon={UserCog} label='Gestor'>
                        <Badge label={task.manager.name} data={managerBadge}/>
                    </BadgeItem>

                    <BadgeItem icon={Clock} label='Criada em'>
                        <span className={styles.date}>
                            {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                    </BadgeItem>

                    {task.dateLimit && (
                        <BadgeItem icon={Clock} label='Prazo'>
                            <span className={styles.date}>
                                {new Date(task.dateLimit).toLocaleDateString('pt-BR')}
                                {daysRemaining !== undefined && (
                                    <>
                                        {daysRemaining > 1 ? (
                                            <Badge data={MESSAGE_BADGES['INFO']}    label={`${daysRemaining} dias restantes`}/>
                                        ) : daysRemaining === 1 ? (
                                            <Badge data={MESSAGE_BADGES['WARNING']} label='O prazo vence amanhã'/>
                                        ) : daysRemaining === 0 ? (
                                            <Badge data={MESSAGE_BADGES['WARNING']} label='O prazo vence hoje'/>
                                        ) : daysRemaining === -1 ? (
                                            <Badge data={MESSAGE_BADGES['DANGER']}  label='Atrasada desde ontem'/>
                                        ) : (
                                            <Badge data={MESSAGE_BADGES['DANGER']}  label={`Atrasada a ${Math.abs(daysRemaining)} dias`}/>
                                        )}
                                    </>
                                )}
                            </span>
                        </BadgeItem>
                    )}
                </div>

                {task.description && (
                    <div className={styles.description}>
                        <h3>Descrição</h3>
                        <p>{task.description}</p>
                    </div>
                )}

                {!isAssigned && !isDone && (
                    <p className={styles.notAssignedNote}>
                        <TriangleAlert/>
                        Você não está atribuído a esta tarefa. Para marcar passos, solicite ao líder ou gestor da área.
                    </p>
                )}

                <div className={styles.stepsSection}>
                    <div className={styles.stepsSectionHeader}>
                        <h3>Passos</h3>
                        {steps.length > 0 && (
                            <span className={styles.stepsProgress}>{doneCount}/{steps.length} concluídos</span>
                        )}
                    </div>

                    {steps.length === 0 ? (
                        <p className={styles.noSteps}>Nenhum passo cadastrado.</p>
                    ) : (
                        <ul className={styles.stepsList}>
                            {steps.map(step => {
                                const canToggle = isAssigned && isInProgress;
                                return (
                                    <li
                                        key={step.id}
                                        className={`${styles.stepItem} ${step.done ? styles.stepDone : ''}`}
                                    >
                                        <button
                                            className={styles.stepToggle}
                                            onClick={() => canToggle && handleToggle(step.id)}
                                            disabled={!canToggle}
                                            title={
                                                !isAssigned   ? 'Você não está atribuído a esta tarefa' :
                                                isNotStarted  ? 'Inicie a tarefa para marcar passos'    :
                                                isInRevision  ? 'Aguarde a revisão da tarefa'           :
                                                step.done     ? 'Marcar como pendente'                  :
                                                                'Marcar como concluído'
                                            }
                                        >
                                            {step.done ? <CheckSquare size={20}/> : <Square size={20}/>}
                                        </button>
                                        <div className={styles.stepContent}>
                                            <span className={styles.stepName}>{step.name}</span>
                                            {step.description && (
                                                <span className={styles.stepDesc}>{step.description}</span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

            </div>
        </FloatingPanel>
    );
}