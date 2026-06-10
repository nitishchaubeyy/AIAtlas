"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
    entityType: "model" | "tool";
    entityId: string;
    className?: string;
}

export function BookmarkButton({ entityType, entityId, className }: BookmarkButtonProps) {
    const { data: session, status } = useSession();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            // Check if already bookmarked
            fetch(`/api/bookmarks?entityType=${entityType}&entityId=${entityId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.data && data.data.length > 0) {
                        // User has bookmarked this item
                        setIsBookmarked(true);
                    }
                })
                .catch(err => console.error("Failed to fetch bookmark status", err));
        }
    }, [status, entityType, entityId]);

    const toggleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if inside a Link
        e.stopPropagation();

        if (status !== "authenticated") {
            alert("Please sign in to bookmark items.");
            return;
        }

        setIsLoading(true);
        try {
            if (isBookmarked) {
                // Remove bookmark
                const res = await fetch(`/api/bookmarks?entityType=${entityType}&entityId=${entityId}`, {
                    method: "DELETE",
                });
                if (res.ok) setIsBookmarked(false);
            } else {
                // Add bookmark
                const res = await fetch("/api/bookmarks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ entityType, entityId }),
                });
                if (res.ok) setIsBookmarked(true);
            }
        } catch (err) {
            console.error("Bookmark toggle failed", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleBookmark}
            disabled={isLoading}
            className={cn(
                "p-1.5 rounded-md transition-colors",
                isBookmarked 
                    ? "text-atlas-blue bg-atlas-blue/10 hover:bg-atlas-blue/20" 
                    : "text-atlas-text-muted hover:text-atlas-text-primary hover:bg-atlas-bg-secondary",
                isLoading && "opacity-50 cursor-not-allowed",
                className
            )}
            title={isBookmarked ? "Remove bookmark" : "Save bookmark"}
        >
            {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5" />
            ) : (
                <Bookmark className="w-5 h-5" />
            )}
        </button>
    );
}
