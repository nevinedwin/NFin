'use client';

import { useCallback, useEffect, useRef, useState } from "react";

type ActionParams<T> = {
    search: string;
    cursor: T | null;
    take: number;
    [key: string]: unknown;
};

type InfiniteResponse<T, D> = {
    data: D[];
    nextCursor: T | null;
};

type InfiniteScrollProps<T, D> = {
    query: string;
    action: (params: ActionParams<T>) => Promise<InfiniteResponse<T, D>>;
    size?: number;
    format?: (prev: D[], incoming: D[]) => D[];
    extraParams?: Record<string, unknown>;
    initialData?: D[];
    initialCursor?: T | null
    cacheTTL?: number; // milliseconds; optional per-hook cache
};

/**
 * Tracks mutable values without triggering re-renders.
 * Useful for values needed inside callbacks/effects that must stay fresh.
 */
function useLatest<T>(value: T) {
    const ref = useRef(value);
    ref.current = value;
    return ref;
}

const useInfiniteScroll = <T, D>({
    query,
    action,
    size = 10,
    format,
    extraParams,
    initialData,
    initialCursor,
    cacheTTL
}: InfiniteScrollProps<T, D>) => {

    const hasSSRData = Boolean(initialData?.length);

    const [loading, setLoading] = useState(!hasSSRData);
    const [error, setError] = useState(false);
    const [data, setData] = useState<D[]>(() => initialData ?? []);
    const [hasMore, setHasMore] = useState(true);
    const [trigger, setTrigger] = useState(0);

    /**
     * Use refs for cursor and loading to avoid adding them to
     * useCallback/useEffect dep arrays (which would cause infinite loops or
     * stale-closure bugs).  The actual state values drive the UI; the refs
     * give us the latest value inside async callbacks without re-subscribing.
     */
    const cursorRef = useRef<T | null>(initialCursor ?? null);
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const initialMountRef = useRef(true);

    /** Incremented on every query change so in-flight requests are ignored. */
    const requestIdRef = useRef(0);
    const skipNextFetchRef = useRef(hasSSRData);

    // Simple in-memory cache per hook instance. Keyed by JSON of query+cursor+extraParams
    const cacheRef = useRef<Map<string, { ts: number; data: D[]; nextCursor: T | null }>>(new Map());


    /** Stable refs for action / format so we never need them in dep arrays. */
    const actionRef = useLatest(action);
    const formatRef = useLatest(format);
    const sizeRef = useLatest(size);
    const extraParamsRef = useLatest(extraParams);
    const queryRef = useLatest(query);
    const cacheTTLRef = useLatest(cacheTTL);

    // ─── Core fetch ───────────────────────────────────────────────────────────

    /**
     * fetchData is intentionally dependency-free (stable across renders).
     * All values it needs are read from refs so it is never recreated and
     * never triggers downstream effect re-runs.
     */
    // fetchData intentionally reads refs and is stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchData = useCallback(async () => {
        // Guard: skip if a fetch is already running or there's nothing more
        if (loadingRef.current || !hasMoreRef.current) return;

        loadingRef.current = true;
        setLoading(true);
        setError(false);

        const requestId = ++requestIdRef.current;

        try {

            const cacheKey = JSON.stringify({ q: queryRef.current, cursor: cursorRef.current, extra: extraParamsRef.current });
            const ttl = cacheTTLRef.current ?? 0;

            if (ttl > 0) {
                const cached = cacheRef.current.get(cacheKey);
                if (cached && Date.now() - cached.ts < ttl) {
                    // apply cached result
                    const nextCursor = cached.nextCursor;
                    const nextHasMore = nextCursor !== null;

                    cursorRef.current = nextCursor;
                    hasMoreRef.current = nextHasMore;

                    setData(prev => {
                        const fmt = formatRef.current;
                        return fmt ? fmt(prev, cached.data) : [...prev, ...cached.data];
                    });
                    setHasMore(nextHasMore);
                    return;
                }
            }

            const resp = await actionRef.current({
                search: queryRef.current,
                cursor: cursorRef.current,
                take: sizeRef.current,
                ...extraParamsRef.current
            });

            // Discard results from a superseded query (e.g. user typed quickly)
            if (requestId !== requestIdRef.current) return;

            const nextCursor = resp.nextCursor;
            const nextHasMore = nextCursor !== null;

            cursorRef.current = nextCursor;
            hasMoreRef.current = nextHasMore;

            setData(prev => {
                const fmt = formatRef.current;
                return fmt ? fmt(prev, resp.data) : [...prev, ...resp.data];
            });
            setHasMore(nextHasMore);

            // store in cache
            if (cacheTTLRef.current && cacheTTLRef.current > 0) {
                cacheRef.current.set(cacheKey, { ts: Date.now(), data: resp.data, nextCursor });
            }
        } catch {
            if (requestId === requestIdRef.current) {
                setError(true);
            }
        } finally {
            // Only update loading state if this request is still current
            if (requestId === requestIdRef.current) {
                loadingRef.current = false;
                setLoading(false);
            }
        }
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const refetch = useCallback(() => {
        cursorRef.current = null;
        hasMoreRef.current = true;
        loadingRef.current = false;
        setData([]);
        setHasMore(true);
        setLoading(false);
        setError(false);
        setTrigger(t => t + 1);
    }, []);


    useEffect(() => {

        if (skipNextFetchRef.current) {
            skipNextFetchRef.current = false;
            return;
        }

        requestIdRef.current++;

        // Reset all state/refs synchronously before the first fetch
        cursorRef.current = null;
        hasMoreRef.current = true;
        loadingRef.current = false;

        setHasMore(true);
        setLoading(false);
        setError(false);

        if (initialMountRef.current && initialData) {
            initialMountRef.current = false;
            setData(initialData);
            if (initialCursor) {
                cursorRef.current = initialCursor;
            }
            return;
        };

        initialMountRef.current = false;
        // Cancel any in-flight request for the previous query

        setData([]);

        // Kick off the first page immediately
        fetchData();
    }, [query, trigger]);

    const observerRef = useRef<IntersectionObserver | null>(null);

    const scrollElementRef = useCallback((node: HTMLElement | null) => {
        observerRef.current?.disconnect();

        if (!node) return;

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    fetchData();
                }
            },
            { rootMargin: '200px' }
        );

        observerRef.current.observe(node);
    }, [fetchData]);

    useEffect(() => {
        return () => {
            observerRef.current?.disconnect();
            requestIdRef.current++;
        };
    }, []);

    return {
        data,
        loading,
        error,
        hasMore,
        scrollElementRef,
        refetch
    } as const;
};

export default useInfiniteScroll;