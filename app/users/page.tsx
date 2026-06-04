import { AvatarStack } from "@/components/AvatarStack"

async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users`, {
    cache: "force-cache",
  })
  const { data } = await res.json()
  return data
}

export default async function UsersPage() {
  const users = await getUsers()
  return <div style={{ paddingTop: 64 }}><AvatarStack users={users} /></div>
}
