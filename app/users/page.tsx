import { prisma } from "@/lib/db"
import { AvatarStack } from "@/components/AvatarStack"

export default async function UsersPage() {
  const users = await prisma.user.findMany()
  return <div style={{ paddingTop: 64 }}><AvatarStack users={users} /></div>
}
