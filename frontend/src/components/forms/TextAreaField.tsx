import styles from './forms.module.scss';

type TextAreaFieldProps = {
    id:           string;
    label:        string;
    value:        string;
    onChange:     (value: string) => void;
    placeholder?: string;
    required?:    boolean;
    disabled?:    boolean;
    error?:       string;
    rows?:        number;
};

export function TextAreaField({
    id,
    label,
    value,
    onChange,
    placeholder,
    required  = false,
    disabled  = false,
    error,
    rows      = 3,
}: TextAreaFieldProps) {
    return (
        <div className={`${styles.field} ${error ? styles.fieldError : ''}`}>
            <label htmlFor={id}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <textarea
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                required={required}
                disabled={disabled}
                rows={rows}
            />
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
}