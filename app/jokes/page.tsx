import { prisma } from "@/lib/db"
import { JokeViewer } from "@/components/JokeViewer"

export default async function JokesPage() {
  const jokes = await prisma.joke.findMany()
  return <div style={{ paddingTop: 64 }}><JokeViewer jokes={jokes} /></div>
}
