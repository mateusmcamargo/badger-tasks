'use client';

import { X, Save, LucideIcon } from 'lucide-react';

import styles from './floatingPanel.module.scss';
import { Button } from '@/components/forms/Button';

type FloatingPanelProps = {
    headerIcon:  LucideIcon;
    headerTitle: string;
    headerText:  string;
    loading:     boolean;
    error:       string | null;
    onClose:     () => void;
    handleSave?: () => void;
    footer?:     React.ReactNode;
    children:    React.ReactNode;
};

export function FloatingPanel({
    headerIcon: Icon,
    headerTitle,
    headerText,
    loading,
    error,
    onClose,
    handleSave,
    footer,
    children,
}: FloatingPanelProps) {

    const defaultFooter = (
        <div className={styles.panelActions}>
            <Button
                icon={X}
                label='Cancelar'
                variant='cancel'
                onClick={onClose}
            />
            <Button
                icon={Save}
                label='Salvar'
                variant='save'
                loadingLabel='Salvando...'
                loading={loading}
                onClick={handleSave}
            />
        </div>
    );

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.panel} onClick={e => e.stopPropagation()}>

                <div className={styles.panelHeader}>
                    {Icon && <Icon className={styles.icon}/>}
                    <h2 title={headerTitle}>{headerText}</h2>
                    <Button
                        type='button'
                        variant='close'
                        icon={X}
                        onClick={onClose}
                    />
                </div>

                {error && <p className={styles.headerError}>{error}</p>}

                <div className={styles.panelBody}>
                    {children}
                </div>

                {footer ?? defaultFooter}

            </div>
        </div>
    );
}