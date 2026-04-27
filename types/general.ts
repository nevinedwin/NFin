import { RefObject } from "react";

export type Cursor = { date: Date; id: string } | null;

export type Ref<T> = RefObject<T> | ((instance: T | null) => void) | null;