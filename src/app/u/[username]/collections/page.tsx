"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { UserBadge } from "@/types";
import { cn } from "@/lib/utils";
import { mockUsersList, getLevelInfo, BADGE_META } from "@/lib/mock-users";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { useSession } from "next-auth/react";

export default function UserCollectionsPage() {
    const params = useParams();
    const usernameParam = params.username as string;
    const lowerUsername = usernameParam.toLowerCase();
    const { data: session } = useSession();

    const [user, setUser] = useState<any>(null);
    const [collections, setCollections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notFoundError, setNotFoundError] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

    const isOwner = session?.user && 
        (session.user.name ?? session.user.email ?? "unknown").replace(/\s+/g, "-").toLowerCase() === lowerUsername;

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        setNotFoundError(false);

        // Fetch user basic data
        const matchedKey = Object.keys(mockUsersList).find(
            (k) => k.toLowerCase() === lowerUsername
        );

        if (matchedKey) {
            const matched = mockUsersList[matchedKey];
            setUser({
                ...matched,
                githubUsername: matchedKey,
                contributionScore: matched.contributionScore ?? 0,
                badges: matched.mockBadges.map((b) => ({ badgeType: b })),
                totalModels: matched.totalModels,
                totalReviews: matched.totalReviews,
                approvedRate: matched.approvedRate
            });
        } else {
            // Since we rely on mock list for header, if not found, we could just render basic username
            setUser({
                githubUsername: usernameParam,
                contributionScore: 0,
                badges: [],
                totalModels: 0,
                totalReviews: 0,
                approvedRate: 100
            });
        }

        // Fetch collections
        fetch(`/api/collections?username=${lowerUsername}`, { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch collections");
                return res.json();
            })
            .then((data) => {
                setCollections(data.data || []);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });

        return () => controller.abort();
    }, [lowerUsername]);

    const handleCreateCollection = async () => {
        const name = prompt("Enter a name for the new collection:");
        if (!name) return;

        const isPublic = confirm("Make this collection public? (OK for Yes, Cancel for Private)");

        try {
            const res = await fetch("/api/collections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, isPublic })
            });

            if (res.ok) {
                const { data } = await res.json();
                setCollections((prev) => [data, ...prev]);
            } else {
                alert("Failed to create collection.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
                <div className="h-24 bg-atlas-bg-tertiary rounded-lg mb-10"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="h-32 bg-atlas-bg-tertiary rounded-lg"></div>
                    <div className="h-32 bg-atlas-bg-tertiary rounded-lg"></div>
                    <div className="h-32 bg-atlas-bg-tertiary rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (notFoundError || !user) {
        return (
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-2xl font-bold text-atlas-text-primary mb-2">User not found</h1>
                <Link href="/" className="text-atlas-blue hover:underline text-sm">← Back to Leaderboard</Link>
            </div>
        );
    }

    const avatar = user.avatarUrl || `https://avatars.githubusercontent.com/u/${user.githubUsername === "MistryVishwa" ? "9919" : "120593"}?v=4`;
    const score = user.contributionScore;
    const levelInfo = getLevelInfo(score);

    return (
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
            {/* 👤 Profile Header */}
            <div className="pb-10 flex flex-col sm:flex-row items-start gap-8">
                <div className="relative group">
                    <img
                        src={avatar}
                        alt={`${user.githubUsername}`}
                        className="w-28 h-28 rounded-full border-2 border-atlas-border object-cover shadow-xl"
                    />
                    <div className="absolute -bottom-2 -right-1 bg-atlas-purple text-white px-2 py-0.5 text-[10px] font-bold font-mono rounded-full border border-atlas-bg-primary shadow">
                        LVL {levelInfo.level}
                    </div>
                </div>

                <div className="flex-1 w-full mt-2 sm:mt-0">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-sans font-bold text-atlas-text-primary tracking-tight">
                                    {user.githubUsername}
                                </h1>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-atlas-green/10 text-atlas-green border border-atlas-green/20 text-xs font-mono font-bold">
                                    {score} XP
                                </span>
                            </div>
                            <p className="text-xs text-atlas-text-muted mt-1.5 font-mono">
                                {levelInfo.title}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-atlas-text-secondary mt-5 max-w-2xl leading-relaxed">
                        {user.bio || "No bio provided."}
                    </p>
                </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex items-center gap-6 mt-2 border-b border-atlas-border">
                <Link href={`/u/${lowerUsername}`} className="pb-3 border-b-2 border-transparent text-atlas-text-muted hover:text-atlas-text-primary text-sm transition-colors">
                    Overview
                </Link>
                <Link href={`/u/${lowerUsername}/collections`} className="pb-3 border-b-2 border-atlas-blue text-atlas-text-primary font-medium text-sm">
                    Collections
                </Link>
            </div>

            {/* Collections Section */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-atlas-text-primary">Collections</h2>
                    {isOwner && (
                        <button
                            onClick={handleCreateCollection}
                            className="px-4 py-2 text-sm font-medium bg-atlas-blue/10 text-atlas-blue border border-atlas-blue/20 rounded-md hover:bg-atlas-blue/20 transition-colors"
                        >
                            + New Collection
                        </button>
                    )}
                </div>

                {collections.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collections.map((col) => (
                            <CollectionCard key={col.id} collection={col} username={lowerUsername} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border border-dashed border-atlas-border rounded-lg bg-atlas-bg-card/50">
                        <p className="text-atlas-text-muted mb-2">No collections found.</p>
                        {isOwner && (
                            <p className="text-sm text-atlas-text-secondary">
                                Create a collection to organize your favorite AI models and tools.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
