import { prisma as db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { ComponentType } from "@/lib/generated/prisma/enums";
export async function POST(req: NextRequest){

    try {
        const {email, componentType, description} = await req.json()
        if (!email || !componentType || !description) {
        return NextResponse.json(
            { success: false, error: "All fields are required" },
            { status: 400 }
        );
        }
        const request = await db.componentRequest.create({
        data: {
            email,
            componentType,
            description
        }
        })

        return NextResponse.json({success: true, data: {email}, message: "We've received your component request and it's now in the lineup for review. If approved, it'll make its way into the library — we'll be in touch."}, {status: 201});
    } catch (error) {
        return NextResponse.json(
            {success: false, error: "Unable to accept request at the moment, please try again"},
            {status: 500}
        )
    }
}

export async function GET(){
    const types = Object.values(ComponentType);
    return NextResponse.json({success: true, data: types});
}