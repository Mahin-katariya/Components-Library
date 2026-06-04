import { prisma as db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const cats = await db.cat.findMany();
        return NextResponse.json({success: true, data: cats});
    } catch (error) {
        return NextResponse.json(
            {success: false, error: "Failed to fetch cats information" },
            {status: 500}
        )
    }
}

