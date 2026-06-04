"use server"
import { prisma as db } from "@/lib/db"
import { ComponentType } from "@/lib/generated/prisma/enums"

export type RequestState = { success: boolean; error?: string } | null

export async function submitRequest(
  _prev: RequestState,
  formData: FormData,
): Promise<RequestState> {
  const email = (formData.get("email") as string)?.trim()
  const componentType = formData.get("componentType") as ComponentType
  const description = (formData.get("description") as string)?.trim()

  if (!email || !componentType || !description) {
    return { success: false, error: "All fields are required." }
  }

  try {
    await db.componentRequest.create({
      data: { email, componentType, description },
    })
    return { success: true }
  } catch {
    return { success: false, error: "Something went wrong. Please try again." }
  }
}   