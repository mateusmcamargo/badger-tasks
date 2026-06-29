'use client';

import { Trash2, Plus, CheckSquare, Square } from 'lucide-react';
import styles from './stepList.module.scss';
import Field from '@/components/forms/Field';
import { Button } from '@/components/forms/Button';

export type StepRow =
    | { mode: 'existing'; id: string; name: string; description: string; done: boolean; priority: number; deleted: boolean; }
    | { mode: 'new';                  name: string; description: string; done: false;   priority: number; };

type StepListProps = {
    steps:    StepRow[];
    onChange: (steps: StepRow[]) => void;
    variant?: 'create' | 'edit';
};

export function makeNewStep(priority: number): StepRow {
    return { mode: 'new', name: '', description: '', done: false, priority };
}

export function StepList({ steps, onChange, variant = 'create' }: StepListProps) {

    const visibleSteps = steps
        .map((s, index) => ({ s, index }))
        .filter(({ s }) => !(s.mode === 'existing' && s.deleted));

    function addStep() {
        const nextPriority = visibleSteps.length + 1;
        onChange([...steps, makeNewStep(nextPriority)]);
    }

    function removeStep(index: number) {
        const updated = steps
            .map((s, i) => {
                if (i !== index) return s;
                if (s.mode === 'existing') return { ...s, deleted: true };
                return null; // new rows are spliced out
            })
            .filter((s): s is StepRow => s !== null);
        onChange(updated);
    }

    function updateField(index: number, field: 'name' | 'description', value: string) {
        onChange(steps.map((s, i) => i === index ? { ...s, [field]: value } : s));
    }

    return (
        <div className={styles.stepList}>
            {visibleSteps.map(({ s, index }, displayIndex) => (
                <div
                    key={s.mode === 'existing' ? s.id : `new-${index}`}
                    className={`${styles.stepRow} ${styles[variant]}`}
                >
                    {variant === 'edit' ? (
                        // edit variant
                        <>
                            <div className={styles.stepHeader}>
                                <Button
                                    icon={Trash2}
                                    type='button'
                                    variant='remove'
                                    onClick={() => removeStep(index)}
                                />
                                <p className={styles.stepLabel}>Passo {displayIndex + 1}</p>
                                {s.mode === 'existing' && (
                                    s.done ? (
                                        <div className={styles.stepStatus}>
                                            <CheckSquare className={styles.done} />
                                            <span className={styles.done}>concluído</span>
                                        </div>
                                    ) : (
                                        <div className={styles.stepStatus}>
                                            <Square className={styles.pending} />
                                            <span className={styles.pending}>pendente</span>
                                        </div>
                                    )
                                )}
                            </div>
                            <div className={styles.stepFields}>
                                <Field
                                    id={`step-name-${index}`}
                                    label='Título'
                                    value={s.name}
                                    onChange={v => updateField(index, 'name', v)}
                                    placeholder='Nome do passo'
                                    required
                                />
                                <Field
                                    id={`step-desc-${index}`}
                                    label='Descrição'
                                    value={s.description}
                                    onChange={v => updateField(index, 'description', v)}
                                    placeholder='Descrição (opcional)'
                                />
                            </div>
                        </>
                    ) : (
                        // create variant
                        <>
                            <span className={styles.stepNumber}>{displayIndex + 1}</span>
                            <div className={styles.stepFields}>
                                <Field
                                    id={`step-name-${index}`}
                                    label=''
                                    value={s.name}
                                    onChange={v => updateField(index, 'name', v)}
                                    placeholder='Nome do passo'
                                    required
                                />
                                <Field
                                    id={`step-desc-${index}`}
                                    label=''
                                    value={s.description}
                                    onChange={v => updateField(index, 'description', v)}
                                    placeholder='Descrição (opcional)'
                                />
                            </div>
                            <Button
                                type='button'
                                variant='remove'
                                icon={Trash2}
                                onClick={() => removeStep(index)}
                            />
                        </>
                    )}
                </div>
            ))}

            <Button
                label='Adicionar Passo'
                type='button'
                variant='outline'
                icon={Plus}
                onClick={addStep}
            />
        </div>
    );
}