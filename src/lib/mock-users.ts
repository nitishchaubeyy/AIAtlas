import { User, UserBadge, Review, Contribution } from "@/types";

export const mockUsersList: Record<string, Partial<User> & {
    totalModels: number;
    totalReviews: number;
    approvedRate: number;
    mockBadges: string[];
    mockReviews: Partial<Review>[];
    mockContributions: Partial<Contribution>[];
}> = {
    "sarah-dev": {
        id: "u1",
        githubUsername: "sarah-dev",
        bio: "Full stack ML engineer and open-source enthusiast.",
        contributionScore: 42,
        createdAt: "2024-06-01T12:00:00.000Z" as any,
        totalModels: 3,
        totalReviews: 5,
        approvedRate: 92,
        mockBadges: ["NEW_CONTRIBUTOR", "ACTIVE_CONTRIBUTOR", "TOP_CONTRIBUTOR"],
        mockReviews: [
            { id: "r1", entityId: "gemini-2-5-pro", rating: 5, comment: "Incredible 1M context capabilities! Ideal for processing large codebases.", createdAt: "2026-05-20" as any },
            { id: "r2", entityId: "gpt-4o-mini", rating: 4, comment: "Extremely fast and inexpensive. Excellent choice for high-volume agents.", createdAt: "2026-05-15" as any }
        ],
        mockContributions: [
            { id: "c1", action: "add", entityType: "model", status: "approved", createdAt: "2026-05-30" as any },
            { id: "c2", action: "update", entityType: "model", status: "approved", createdAt: "2026-05-25" as any }
        ]
    },
    "ml-enthusiast": {
        id: "u2",
        githubUsername: "ml-enthusiast",
        bio: "Researching large language models and neural architecture search.",
        contributionScore: 18,
        createdAt: "2024-09-01T12:00:00.000Z" as any,
        totalModels: 1,
        totalReviews: 4,
        approvedRate: 85,
        mockBadges: ["NEW_CONTRIBUTOR", "ACTIVE_CONTRIBUTOR"],
        mockReviews: [
            { id: "r3", entityId: "claude-sonnet-4", rating: 5, comment: "Top-notch coding performance. Simply the best software assistant.", createdAt: "2026-05-18" as any }
        ],
        mockContributions: [
            { id: "c3", action: "review", entityType: "model", status: "approved", createdAt: "2026-05-28" as any }
        ]
    },
    "open-source-fan": {
        id: "u3",
        githubUsername: "open-source-fan",
        bio: "Proud promoter of open-weights models and open-source licensing.",
        contributionScore: 67,
        createdAt: "2024-03-01T12:00:00.000Z" as any,
        totalModels: 5,
        totalReviews: 8,
        approvedRate: 98,
        mockBadges: ["NEW_CONTRIBUTOR", "ACTIVE_CONTRIBUTOR", "TOP_CONTRIBUTOR", "VERIFIED_CONTRIBUTOR"],
        mockReviews: [
            { id: "r4", entityId: "deepseek-v3", rating: 5, comment: "Outstanding performance-to-cost ratio. A true win for open source!", createdAt: "2026-05-24" as any },
            { id: "r5", entityId: "llama-3-1-405b", rating: 4, comment: "Superb capability at massive scale, though hosting costs are high.", createdAt: "2026-05-10" as any }
        ],
        mockContributions: [
            { id: "c4", action: "add", entityType: "model", status: "approved", createdAt: "2026-05-29" as any },
            { id: "c5", action: "review", entityType: "model", status: "approved", createdAt: "2026-05-20" as any }
        ]
    },
    "techwatch": {
        id: "u4",
        githubUsername: "techwatch",
        bio: "Tracking the latest AI model updates and releases.",
        contributionScore: 12,
        createdAt: "2025-01-01T12:00:00.000Z" as any,
        totalModels: 1,
        totalReviews: 2,
        approvedRate: 75,
        mockBadges: ["NEW_CONTRIBUTOR"],
        mockReviews: [
            { id: "r6", entityId: "grok-3", rating: 4, comment: "Impressive reasoning capabilities with high tok/s speed.", createdAt: "2026-05-22" as any }
        ],
        mockContributions: [
            { id: "c6", action: "add", entityType: "model", status: "approved", createdAt: "2026-05-27" as any }
        ]
    },
    "mistryvishwa": {
        id: "u5",
        githubUsername: "MistryVishwa",
        bio: "Lead developer and chief AIAtlas platform contributor.",
        contributionScore: 125,
        createdAt: "2026-01-15T12:00:00.000Z" as any,
        totalModels: 8,
        totalReviews: 15,
        approvedRate: 100,
        mockBadges: ["NEW_CONTRIBUTOR", "ACTIVE_CONTRIBUTOR", "TOP_CONTRIBUTOR", "VERIFIED_CONTRIBUTOR"],
        mockReviews: [
            { id: "r7", entityId: "o3", rating: 5, comment: "OpenAI's reasoning performance is truly mindblowing on GPQA benchmarks.", createdAt: "2026-05-31" as any },
            { id: "r8", entityId: "deepseek-r1", rating: 5, comment: "Chain-of-thought capabilities are exceptional and widely accessible.", createdAt: "2026-05-29" as any }
        ],
        mockContributions: [
            { id: "c7", action: "add", entityType: "model", status: "approved", createdAt: "2026-05-31" as any },
            { id: "c8", action: "update", entityType: "model", status: "approved", createdAt: "2026-05-30" as any },
            { id: "c9", action: "add", entityType: "repo", status: "approved", createdAt: "2026-05-28" as any }
        ]
    }
};

export const getLevelInfo = (xp: number) => {
    if (xp < 10) return { level: 1, title: "Level 1 Newbie", minXp: 0, maxXp: 10 };
    if (xp < 30) return { level: 2, title: "Level 2 Bronze Contributor", minXp: 10, maxXp: 30 };
    if (xp < 60) return { level: 3, title: "Level 3 Silver Contributor", minXp: 30, maxXp: 60 };
    if (xp < 100) return { level: 4, title: "Level 4 Gold Contributor", minXp: 60, maxXp: 100 };
    return { level: 5, title: "Level 5 Apex Contributor", minXp: 100, maxXp: 100 };
};

export const BADGE_META: Record<string, { label: string; desc: string; color: string; icon: string }> = {
    NEW_CONTRIBUTOR: {
        label: "New Contributor",
        desc: "Awarded for earning your first reputation points on the platform.",
        color: "bg-atlas-blue/10 text-atlas-blue border-atlas-blue/30",
        icon: "🌟"
    },
    ACTIVE_CONTRIBUTOR: {
        label: "Active Contributor",
        desc: "Given to members with more than 15 XP who contribute consistently.",
        color: "bg-atlas-amber/10 text-atlas-amber border-atlas-amber/30",
        icon: "🔥"
    },
    TOP_CONTRIBUTOR: {
        label: "Top Contributor",
        desc: "Earned by elite community members reaching Level 3 or higher.",
        color: "bg-atlas-purple/10 text-atlas-purple border-atlas-purple/30",
        icon: "🏆"
    },
    VERIFIED_CONTRIBUTOR: {
        label: "Verified Contributor",
        desc: "Manually vetted members known for highly accurate and validated reviews.",
        color: "bg-atlas-green/10 text-atlas-green border-atlas-green/30",
        icon: "✅"
    }
};
