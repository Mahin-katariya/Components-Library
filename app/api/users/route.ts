import { prisma as db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const users = await db.user.findMany();
        return NextResponse.json({success: true, data: users});
    } catch (error) {
        return NextResponse.json(
            {success: false, error: "Failed to fetch users" },
            {status: 500}
        )
    }
}