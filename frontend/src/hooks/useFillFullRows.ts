import { useLayoutEffect, useRef } from 'react';

export function useFillFullRows<T extends HTMLElement>(growClass: string, deps: unknown[]) {
    const containerRef = useRef<T>(null);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        function recalc() {
            const items = Array.from(container!.children) as HTMLElement[];
            items.forEach(item => item.classList.remove(growClass));

            const rows = new Map<number, HTMLElement[]>();
            items.forEach(item => {
                const row = rows.get(item.offsetTop) ?? [];
                row.push(item);
                rows.set(item.offsetTop, row);
            });

            rows.forEach(row => {
                if (row.length > 1) row.forEach(item => item.classList.add(growClass));
            });
        }

        recalc();
        const observer = new ResizeObserver(recalc);
        observer.observe(container);
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return containerRef;
}