import styles from './forms.module.scss';

type ButtonProps = {
    label:      string;
    onClick?:   () => void;
    type?:      'button' | 'submit' | 'reset';
    loading?:   boolean;
    loadingLabel?: string;
    disabled?:  boolean;
    variant?:   'primary' | 'secondary' | 'danger';
    fullWidth?: boolean;
};

export function Button({
    label,
    onClick,
    type        = 'button',
    loading     = false,
    loadingLabel,
    disabled    = false,
    variant     = 'primary',
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
            {loading ? (loadingLabel ?? label) : label}
        </button>
    );
}