"use client";
import React, { useEffect, useRef, useState } from 'react'


const useCountUp = (target: number, duration: number = 800) => {
    const [value, setValue] = useState<number>(0);
    const startTime = useRef<number | null>(null);

    useEffect(() => {
        let frame: number;

        const animate = (time: number) => {
            if (!startTime.current) startTime.current = time;
            const progress = Math.min((time - startTime.current) / duration, 1);

            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(target * eased);

            if (progress < 1) {
                frame = requestAnimationFrame(animate);
            }
        }

        frame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frame);
    }, [target, duration]);

    return Math.round(value * 100) / 100;
}

export default useCountUp