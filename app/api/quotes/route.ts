import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";

export async function GET() {
    try {
        const quotes = await db.quote.findMany({orderBy: {createdAt: "desc"}});
        return NextResponse.json({success: true, data: quotes});
    } catch (error) {
        return NextResponse.json(
            {success: false, error: "Failed to fetch quotes"},
            {status: 500}
        )
    }
}

