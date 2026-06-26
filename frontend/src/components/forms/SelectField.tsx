import { LucideIcon } from 'lucide-react';
import styles from './forms.module.scss';

type SelectOption = {
    value: string;
    label: string;
};

type SelectFieldProps = {
    icon?:     LucideIcon;
    id:        string;
    label:     string;
    value:     string;
    onChange:  (value: string) => void;
    options:   SelectOption[];
    required?: boolean;
    disabled?: boolean;
    error?:    string;
    placeholder?: string;
};

export default function SelectField({
    icon: Icon,
    id,
    label,
    value,
    onChange,
    options,
    required    = false,
    disabled    = false,
    error,
    placeholder,
}: SelectFieldProps) {
    return (
        <div className={`${styles.field} ${error ? styles.fieldError : ''}`}>
            
            <label htmlFor={id}>{label}{required && <span className={styles.required}>*</span>}</label>
            
            <div className={styles.inputWrapper}>
                {Icon && (
                    <span className={styles.iconLeft}>
                        <Icon size={16} strokeWidth={2}/>
                    </span>
                )}
                <select
                    id={id}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    required={required}
                    disabled={disabled}
                    className={`${Icon        ? styles.withIconLeft  : ''}`}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
}