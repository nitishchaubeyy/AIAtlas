import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const collectionId = params.id;
        const collection = await prisma.collection.findUnique({
            where: { id: collectionId },
            include: { bookmarks: true },
        });

        if (!collection) {
            return NextResponse.json({ error: "Collection not found" }, { status: 404 });
        }

        const session = await getServerSession();
        const githubUsername = session?.user?.name || session?.user?.email 
            ? (session.user.name ?? session.user.email ?? "unknown").replace(/\s+/g, "-").toLowerCase()
            : null;

        let user = null;
        if (githubUsername) {
            user = await prisma.user.findUnique({ where: { githubUsername } });
        }

        // Only allow if collection is public OR if the user is the owner
        if (!collection.isPublic && collection.userId !== user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        return NextResponse.json({ data: collection });
    } catch (err) {
        console.error("GET /api/collections/[id] error:", err);
        return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const collectionId = params.id;
        const body = await request.json();

        const githubUsername = (session.user.name ?? session.user.email ?? "unknown").replace(/\s+/g, "-").toLowerCase();
        const user = await prisma.user.findUnique({ where: { githubUsername } });

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const existingCollection = await prisma.collection.findUnique({
            where: { id: collectionId },
        });

        if (!existingCollection || existingCollection.userId !== user.id) {
            return NextResponse.json({ error: "Unauthorized or not found" }, { status: 403 });
        }

        const updatedCollection = await prisma.collection.update({
            where: { id: collectionId },
            data: {
                name: body.name !== undefined ? body.name : undefined,
                description: body.description !== undefined ? body.description : undefined,
                isPublic: body.isPublic !== undefined ? body.isPublic : undefined,
            },
        });

        return NextResponse.json({ data: updatedCollection });
    } catch (err) {
        console.error("PATCH /api/collections/[id] error:", err);
        return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const collectionId = params.id;
        const githubUsername = (session.user.name ?? session.user.email ?? "unknown").replace(/\s+/g, "-").toLowerCase();
        const user = await prisma.user.findUnique({ where: { githubUsername } });

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const existingCollection = await prisma.collection.findUnique({
            where: { id: collectionId },
        });

        if (!existingCollection || existingCollection.userId !== user.id) {
            return NextResponse.json({ error: "Unauthorized or not found" }, { status: 403 });
        }

        // Delete all bookmarks in this collection first
        await prisma.bookmark.deleteMany({
            where: { collectionId },
        });

        await prisma.collection.delete({
            where: { id: collectionId },
        });

        return NextResponse.json({ message: "Collection deleted" });
    } catch (err) {
        console.error("DELETE /api/collections/[id] error:", err);
        return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
    }
}
