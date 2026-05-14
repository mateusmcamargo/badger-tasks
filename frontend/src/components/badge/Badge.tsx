import styles from './badge.module.scss';
import { BadgeData } from '@/utils/taskHelpers';
import { LucideIcon } from 'lucide-react';

type BadgeProps = {
    data?: BadgeData;

    label?: string;
    variant?: string;
    icon?: LucideIcon;
};

export function Badge({
    data,
    label,
    variant,
    icon: CustomIcon
}: BadgeProps) {

    const finalLabel = data?.label ?? label ?? '';
    const finalVariant = data?.className ?? variant ?? '';
    const Icon = data?.icon ?? CustomIcon;

    return (
        <span className={`${styles.badge} ${styles[finalVariant]}`}>
            {Icon && <Icon strokeWidth={2} />}
            {finalLabel}
        </span>
    );
}