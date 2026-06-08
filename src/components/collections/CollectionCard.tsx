import Link from "next/link";
import { Folder, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollectionCardProps {
    collection: {
        id: string;
        name: string;
        description?: string | null;
        isPublic: boolean;
        bookmarks: any[];
    };
    username: string;
}

export function CollectionCard({ collection, username }: CollectionCardProps) {
    return (
        <Link href={`/u/${username}/collections/${collection.id}`}>
            <div className="group p-5 bg-atlas-bg-card border border-atlas-border rounded-lg hover:border-atlas-border-hover hover:bg-atlas-bg-tertiary transition-all duration-200 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-md bg-atlas-bg-secondary text-atlas-text-secondary group-hover:text-atlas-blue group-hover:bg-atlas-blue/10 transition-colors">
                            <Folder className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-sans font-medium text-atlas-text-primary group-hover:text-atlas-blue transition-colors">
                                {collection.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                {collection.isPublic ? (
                                    <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-atlas-green">
                                        <Globe className="w-3 h-3" /> Public
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-atlas-text-muted">
                                        <Lock className="w-3 h-3" /> Private
                                    </span>
                                )}
                                <span className="text-[10px] font-mono text-atlas-text-muted">
                                    • {collection.bookmarks?.length || 0} items
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-atlas-text-secondary mt-auto line-clamp-2 leading-relaxed">
                    {collection.description || "No description provided."}
                </p>
            </div>
        </Link>
    );
}
