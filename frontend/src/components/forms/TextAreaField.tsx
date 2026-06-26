import { LucideIcon } from 'lucide-react';
import styles from './forms.module.scss';

type TextAreaFieldProps = {
    icon?:        LucideIcon
    id:           string;
    label:        string;
    value:        string;
    onChange:     (value: string) => void;
    placeholder?: string;
    required?:    boolean;
    disabled?:    boolean;
    error?:       string;
};

export default function TextAreaField({
    icon: Icon,
    id,
    label,
    value,
    onChange,
    placeholder,
    required  = false,
    disabled  = false,
    error,
}: TextAreaFieldProps) {
    return (
        <div className={`${styles.field} ${error ? styles.fieldError : ''}`}>
            <label htmlFor={id}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>

            <div className={styles.inputWrapper}>
                {Icon && (
                    <span className={styles.iconLeft}>
                        <Icon size={16} strokeWidth={2}/>
                    </span>
                )}
                <textarea
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    required={required}
                    disabled={disabled}
                    className={`${Icon        ? styles.withIconLeft  : ''}`}
                />
                {error && <span className={styles.errorMessage}>{error}</span>}
            </div>
        </div>
    );
}