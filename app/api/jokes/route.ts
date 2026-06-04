import { prisma as db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const jokes = await db.joke.findMany();
        return NextResponse.json({success: true, data: jokes});
    } catch (error) {
        return NextResponse.json(
            {success: false, error: "Failed to fetch jokes" },
            {status: 500}
        )
    }
}