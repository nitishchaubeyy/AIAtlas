import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number | undefined | null): string {
    if (price === undefined || price === null) return "—";
    if (price < 0.01) return `$${price.toFixed(4)}`;
    if (price < 1) return `$${price.toFixed(3)}`;
    return `$${price.toFixed(2)}`;
}

export function formatNumber(num: number | undefined | null): string {
    if (num === undefined || num === null) return "—";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
    return num.toLocaleString();
}

export function formatContextWindow(ctx: number | undefined | null): string {
    if (ctx === undefined || ctx === null) return "—";
    if (ctx >= 1_000_000) return `${(ctx / 1_000).toFixed(0)}K`;
    if (ctx >= 1_000) return `${(ctx / 1_000).toFixed(0)}K`;
    return ctx.toString();
}

export function formatBenchmark(score: number | undefined | null): string {
    if (score === undefined || score === null) return "—";
    return score.toFixed(1);
}

export function getBenchmarkColor(score: number | undefined | null): string {
    if (score === undefined || score === null) return "text-atlas-text-muted";
    if (score >= 85) return "text-atlas-green";
    if (score >= 70) return "text-atlas-amber";
    return "text-atlas-red";
}

export function timeAgo(date: string | Date): string {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

export function highlightText(text: string, query: string) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
        regex.test(part) ? (
            <mark key={i} className="bg-yellow-300 text-black font-bold rounded px-0.5">
                {part}
            </mark>
        ) : (
            part
        )
    );
}

export function getPriceChangeIndicator(
    current: number | null | undefined, 
    previous: number | null | undefined, 
    changedAt: string | Date | null | undefined
) {
    if (current == null || previous == null || !changedAt) return null;

    const changeDate = new Date(changedAt);
    const now = new Date();
    const daysSinceChange = (now.getTime() - changeDate.getTime()) / (1000 * 3600 * 24);

    // Only show if changed in the last 30 days, and the price actually differs
    if (daysSinceChange > 30 || current === previous) return null;

    const isDecrease = current < previous;
    
    return {
        symbol: isDecrease ? "↓" : "↑",
        colorClass: isDecrease ? "text-atlas-green" : "text-red-500",
        tooltip: `Price ${isDecrease ? 'decreased' : 'increased'} from $${previous.toFixed(2)} to $${current.toFixed(2)} on ${changeDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
    };
}

export const modalityIcons: Record<string, string> = {
  text: "📄",
  image: "🖼️",
  audio: "🔊",
  video: "🎥",
};

