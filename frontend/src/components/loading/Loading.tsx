import styles from './loading.module.scss';

type LoadingProps = {
    content?: string;
    size: 'BIG' |'MEDIUM' | 'SMALL';
    type: 'VERTICAL' | 'HORIZONTAL';
}

export function Loading({content, size, type}: LoadingProps) {

    const sizeClass: Record<LoadingProps['size'], string> = {
        BIG: 'big',
        MEDIUM: 'medium',
        SMALL: 'small',
    };

    const typeClass: Record<LoadingProps['type'], string> = {
        VERTICAL: 'vertical',
        HORIZONTAL: 'horizontal',
    };

    return (
        <div className={`
            ${styles.loading}
            ${styles[sizeClass[size]]}
            ${styles[typeClass[type]]}
        `}>
            <div className={styles.spinner} />
            <p>
                Carregando
                {content && (
                    ` ${content}`
                )}...
                </p>
        </div>
    );
}