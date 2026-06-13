"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FeedEvent } from "@/types";
import { slugify } from "@/lib/utils";

interface ToastProps {
    toastId: string;
    event: FeedEvent;
    onDismiss: () => void;
}

const eventTypeConfig: Record<string, { icon: string; color: string; label: string }> = {
    model_added: { icon: "✦", color: "text-atlas-green", label: "added" },
    review_posted: { icon: "★", color: "text-atlas-amber", label: "reviewed" },
    price_updated: { icon: "↻", color: "text-atlas-blue", label: "pricing updated" },
    tool_added: { icon: "⚡", color: "text-atlas-purple", label: "added" },
};

export function Toast({ toastId, event, onDismiss }: ToastProps) {
    const router = useRouter();

    const config = eventTypeConfig[event.eventType] ?? {
        icon: "•",
        color: "text-atlas-text-secondary",
        label: event.eventType,
    };

    // Auto-dismiss after 4 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onDismiss]);

    const handleNavigate = () => {
        if (event.entityType === "model") {
            // Resolve slugs with special overrides for known ones with hyphens (e.g. Gemini 2.5 Pro -> gemini-2-5-pro)
            let slug = slugify(event.entityName);
            if (event.entityName === "Gemini 2.5 Pro") {
                slug = "gemini-2-5-pro";
            } else if (event.entityName === "Gemini 2.5 Flash") {
                slug = "gemini-2-5-flash";
            }
            router.push(`/models/${slug}`);
        } else if (event.entityType === "tool") {
            router.push("/tools");
        }
        onDismiss();
    };

    // Format the absolute timestamp (e.g., 6:12:31 PM)
    const formattedTime = new Date(event.createdAt).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
    });

    const actionText = config.label;
    const message = `${event.entityName} ${actionText} just now`;

    return (
        <div
            role="alert"
            aria-live="polite"
            className="flex items-start justify-between gap-3 p-4 bg-atlas-bg-card/95 backdrop-blur border border-atlas-border rounded-lg shadow-lg hover:border-atlas-border-hover transition-all duration-300 w-80 text-left cursor-pointer group focus-within:ring-2 focus-within:ring-atlas-green animate-fade-in motion-reduce:animate-none"
            onClick={handleNavigate}
        >
            <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Event Icon with Type Color */}
                <span className={`text-lg shrink-0 ${config.color} leading-none mt-0.5`} aria-hidden="true">
                    {config.icon}
                </span>
                
                {/* Content info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-atlas-text-primary group-hover:text-atlas-green transition-colors break-words">
                        {message}
                    </p>
                    <span className="text-[10px] font-mono text-atlas-text-muted mt-1 block">
                        {formattedTime}
                    </span>
                </div>
            </div>

            {/* Dismiss Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDismiss();
                }}
                className="text-atlas-text-muted hover:text-atlas-text-primary p-1 rounded hover:bg-atlas-bg-tertiary transition-colors shrink-0 -mt-1 -mr-1 focus:outline-none focus:ring-1 focus:ring-atlas-border"
                aria-label="Dismiss notification"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    );
}
