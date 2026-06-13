"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
    title: string;
    className?: string;
}

export function ShareButton({ title, className }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
    const url = window.location.href;

    try {
        const isMobile =
            /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile && navigator.share) {
            await navigator.share({
                title,
                url,
            });
            return;
        }

        await navigator.clipboard.writeText(url);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    } catch (err) {
        console.error("Share failed", err);
    }
};

    return (
        <button
            onClick={handleShare}
            className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono uppercase tracking-wider bg-atlas-bg-secondary text-atlas-text-secondary border border-atlas-border rounded hover:text-atlas-text-primary hover:border-atlas-border-hover transition-all",
                className
            )}
            title="Share model"
              aria-label="Share model"
        >
            <Share2 className="w-3 h-3" />
            {copied ? "Copied!" : "Share"}
          

        </button>
    );
}