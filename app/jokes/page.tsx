import { JokeViewer } from "@/components/JokeViewer"

async function getJokes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/jokes`, {
    cache: "force-cache",
  })
  const { data } = await res.json()
  return data
}

export default async function JokesPage() {
  const jokes = await getJokes()
  return <div style={{ paddingTop: 64 }}><JokeViewer jokes={jokes} /></div>
}
