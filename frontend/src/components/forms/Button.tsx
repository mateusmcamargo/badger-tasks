import styles from './forms.module.scss';
import { LucideIcon } from 'lucide-react';

type ButtonProps = {
    label?:        string;
    onClick?:      () => void;
    type?:         'button' | 'submit' | 'reset';
    variant?:      'primary' | 'secondary' | 'outline' | 'add' | 'remove' | 'close' | 'save' | 'cancel';
    loading?:      boolean;
    loadingLabel?: string;
    disabled?:     boolean;
    fullWidth?:    boolean;
    icon?:         LucideIcon;
};

export function Button({
    icon: Icon,
    label,
    onClick,
    type        = 'button',
    variant     = 'primary',
    loading     = false,
    loadingLabel,
    disabled    = false,
    fullWidth   = false,
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                ${styles.button}
                ${styles[variant]}
                ${fullWidth ? styles.fullWidth : ''}
            `}
        >
            {Icon && !loading && <Icon strokeWidth={2} />}

            {loading ? (loadingLabel ?? label) : label}
        </button>
    );
}