import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const targetUsername = url.searchParams.get("username");

        const session = await getServerSession();
        let requestingUser = null;
        if (session?.user) {
            const githubUsername = (session.user.name ?? session.user.email ?? "unknown").replace(/\s+/g, "-").toLowerCase();
            requestingUser = await prisma.user.findUnique({ where: { githubUsername } });
        }

        // If targetUsername is provided, fetch collections for that user
        const queryUsername = targetUsername ? targetUsername.toLowerCase() : requestingUser?.githubUsername.toLowerCase();
        
        if (!queryUsername) {
            return NextResponse.json({ error: "Authentication required or username missing" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { githubUsername: queryUsername },
        });

        if (!user) {
            return NextResponse.json({ data: [] });
        }

        // If asking for another user's collections, only show public ones.
        const isOwner = requestingUser?.id === user.id;
        const whereClause: any = { userId: user.id };
        if (!isOwner) {
            whereClause.isPublic = true;
        }

        const collections = await prisma.collection.findMany({
            where: whereClause,
            include: { bookmarks: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ data: collections });
    } catch (err) {
        console.error("GET /api/collections error:", err);
        return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, isPublic } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const githubUsername = (session.user.name ?? session.user.email ?? "unknown").replace(/\s+/g, "-").toLowerCase();
        const user = await prisma.user.upsert({
            where: { githubUsername },
            update: {},
            create: { githubUsername, avatarUrl: session.user.image ?? undefined },
        });

        const collection = await prisma.collection.create({
            data: {
                userId: user.id,
                name,
                description: description || null,
                isPublic: isPublic || false,
            },
        });

        return NextResponse.json({ data: collection }, { status: 201 });
    } catch (err) {
        console.error("POST /api/collections error:", err);
        return NextResponse.json({ error: "Failed to create collection" }, { status: 500 });
    }
}
