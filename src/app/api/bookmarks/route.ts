import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const body = await request.json();
        const { entityType, entityId, collectionId } = body;

        if (!entityType || !entityId) {
            return NextResponse.json({ error: "entityType and entityId are required" }, { status: 400 });
        }

        const githubUsername = (session.user.name ?? session.user.email ?? "unknown").replace(/\s+/g, "-").toLowerCase();
        const user = await prisma.user.upsert({
            where: { githubUsername },
            update: {},
            create: { githubUsername, avatarUrl: session.user.image ?? undefined },
        });

        const bookmark = await prisma.bookmark.create({
            data: {
                userId: user.id,
                entityType,
                entityId,
                collectionId: collectionId || null,
            },
        });

        return NextResponse.json({ data: bookmark }, { status: 201 });
    } catch (err) {
        console.error("POST /api/bookmarks error:", err);
        return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const url = new URL(request.url);
        const entityType = url.searchParams.get("entityType");
        const entityId = url.searchParams.get("entityId");
        const collectionId = url.searchParams.get("collectionId");

        if (!entityType || !entityId) {
            return NextResponse.json({ error: "entityType and entityId are required" }, { status: 400 });
        }

        const githubUsername = (session.user.name ?? session.user.email ?? "unknown").replace(/\s+/g, "-").toLowerCase();
        const user = await prisma.user.findUnique({ where: { githubUsername } });

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Find the bookmark to delete.
        // We delete by the unique constraint: userId, entityType, entityId, collectionId
        // Notice: The schema constraint is `@@unique([userId, entityType, entityId, collectionId])`
        // But Prisma maps NULL collectionId uniquely only in some SQL implementations. Let's deleteMany to be safe.
        
        const deletePayload: any = {
            userId: user.id,
            entityType,
            entityId,
        };
        
        if (collectionId) {
            deletePayload.collectionId = collectionId;
        } else {
            // Prisma query for null collectionId
            deletePayload.collectionId = null;
        }

        await prisma.bookmark.deleteMany({
            where: deletePayload,
        });

        return NextResponse.json({ message: "Bookmark removed" });
    } catch (err) {
        console.error("DELETE /api/bookmarks error:", err);
        return NextResponse.json({ error: "Failed to remove bookmark" }, { status: 500 });
    }
}

// GET bookmarks for user
export async function GET(request: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const githubUsername = (session.user.name ?? session.user.email ?? "unknown").replace(/\s+/g, "-").toLowerCase();
        const user = await prisma.user.findUnique({ where: { githubUsername } });

        if (!user) {
            return NextResponse.json({ data: [] });
        }

        const url = new URL(request.url);
        const entityType = url.searchParams.get("entityType");
        const entityId = url.searchParams.get("entityId");

        const where: any = { userId: user.id };
        if (entityType) where.entityType = entityType;
        if (entityId) where.entityId = entityId;

        const bookmarks = await prisma.bookmark.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ data: bookmarks });
    } catch (err) {
        console.error("GET /api/bookmarks error:", err);
        return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
    }
}
