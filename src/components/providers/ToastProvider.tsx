"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { FeedEvent } from "@/types";
import { Toast } from "@/components/ui/Toast";
import { useLiveFeed } from "@/hooks/useLiveFeed";

interface ToastContextType {
    addToast: (event: FeedEvent) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

/**
 * Internal listener component that renders inside the ToastProvider.
 * Since it is a descendant of ToastProvider, calling useLiveFeed() here
 * will successfully access the ToastContext and trigger toasts when
 * real-time events are received globally (on all pages).
 */
function LiveFeedToastListener() {
    useLiveFeed();
    return null;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<{ id: string; event: FeedEvent }[]>([]);
    const seenIdsRef = useRef<Set<string>>(new Set());

    const addToast = useCallback((event: FeedEvent) => {
        // Prevent duplicate toasts for the same event
        if (seenIdsRef.current.has(event.id)) {
            return;
        }
        seenIdsRef.current.add(event.id);

        setToasts((prev) => {
            const newToast = { id: event.id, event };
            const next = [...prev, newToast];
            if (next.length > 3) {
                // Remove the oldest toast (index 0) and keep only the latest 3
                return next.slice(next.length - 3);
            }
            return next;
        });
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            
            {/* Global listener to run the realtime live feed subscription on all pages */}
            <LiveFeedToastListener />

            {/* Global Toast Container - Bottom-Left corner */}
            <div 
                className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
            >
                {toasts.map(({ id, event }) => (
                    <div key={id} className="pointer-events-auto">
                        <Toast
                            toastId={id}
                            event={event}
                            onDismiss={() => removeToast(id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
