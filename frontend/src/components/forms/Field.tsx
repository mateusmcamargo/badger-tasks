'use client';

import { useState } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';
import styles from './forms.module.scss';

type FieldProps = {
    id:            string;
    label:         string;
    value:         string;
    onChange:      (value: string) => void;
    type?:         'text' | 'email' | 'password' | 'date' | 'number';
    placeholder?:  string;
    required?:     boolean;
    autoComplete?: string;
    disabled?:     boolean;
    error?:        string;
    icon?:         LucideIcon;
};

export default function Field({
    id,
    label,
    value,
    onChange,
    type         = 'text',
    placeholder,
    required     = false,
    autoComplete,
    disabled     = false,
    error,
    icon: Icon,
}: FieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword    = type === 'password';
    const resolvedType  = isPassword ? (showPassword ? 'text' : 'password') : type;

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

                <input
                    id={id}
                    type={resolvedType}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    required={required}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    className={`
                        ${Icon        ? styles.withIconLeft  : ''}
                        ${isPassword  ? styles.withIconRight : ''}
                    `}
                />

                {isPassword && (
                    <button
                        type="button"
                        className={styles.iconRight}
                        onClick={() => setShowPassword(prev => !prev)}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={16} strokeWidth={2}/> : <Eye size={16} strokeWidth={2}/>}
                    </button>
                )}
            </div>

            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
}