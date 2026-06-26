import styles from './forms.module.scss';

type SelectOption = {
    value: string;
    label: string;
};

type SelectFieldProps = {
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

export function SelectField({
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
            <select
                id={id}
                value={value}
                onChange={e => onChange(e.target.value)}
                required={required}
                disabled={disabled}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
}