'use client';

import { useState, InputHTMLAttributes } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';
import styles from './forms.module.scss';

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    label?: string;
    error?: string;
    icon?: LucideIcon;
    onChange?: (value: string) => void;
};

export default function Field({
    label,
    error,
    icon: Icon,
    type = 'text',
    onChange,
    required,
    ...inputProps
}: FieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const resolvedType = isPassword
        ? (showPassword ? 'text' : 'password')
        : type;

    return (
        <div
            className={`${styles.field} ${
                error ? styles.fieldError : ''
            }`}
        >
            {label && (
                <label htmlFor={inputProps.id}>
                    {label}
                    {required && (
                        <span className={styles.required}>*</span>
                    )}
                </label>
            )}

            <div className={styles.inputWrapper}>
                {Icon && (
                    <span className={styles.iconLeft}>
                        <Icon size={16} strokeWidth={2} />
                    </span>
                )}

                <input
                    {...inputProps}
                    type={resolvedType}
                    required={required}
                    onChange={(e) => onChange?.(e.target.value)}
                    className={`
                        ${inputProps.className ?? ''}
                        ${Icon ? styles.withIconLeft : ''}
                        ${isPassword ? styles.withIconRight : ''}
                    `}
                />

                {isPassword && (
                    <button
                        type="button"
                        className={styles.iconRight}
                        onClick={() =>
                            setShowPassword((prev) => !prev)
                        }
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff size={16} strokeWidth={2} />
                        ) : (
                            <Eye size={16} strokeWidth={2} />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <span className={styles.errorMessage}>
                    {error}
                </span>
            )}
        </div>
    );
}