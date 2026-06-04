import { prisma } from "@/lib/db"
import { Hero } from "@/components/Hero"
import { ShowcaseSection } from "@/components/showcase/ShowcaseSection"
import { QuotesPaper } from "@/components/QuotesPaper"
import { AvatarStack } from "@/components/AvatarStack"
import { JokeViewer } from "@/components/JokeViewer"
import { CatSwiper } from "@/components/CatSwiper"

async function getAllData() {
  const [quotes, users, jokes] = await Promise.all([
    prisma.quote.findMany(),
    prisma.user.findMany(),
    prisma.joke.findMany(),
  ])
  return { quotes, users, jokes }
}

export default async function HomePage() {
  const { quotes, users, jokes } = await getAllData()

  return (
    <main>
      <Hero componentCount={4} />

      <ShowcaseSection
        index="01"
        total="04"
        tag="Display"
        title="Quote Swiper"
        description="Handwritten paper quotes with a satisfying tear-away animation. Click to rip through the deck."
        note="tear animation · rip + drop · SSG"
        href="/quotes"
      >
        <QuotesPaper quotes={quotes} />
      </ShowcaseSection>

      <ShowcaseSection
        index="02"
        total="04"
        tag="Display"
        title="Avatar Stack"
        description="Overlapping user circles that lift and reveal a name and bio tooltip on hover."
        note="hover lift · tooltip · SSG"
        href="/users"
      >
        <AvatarStack users={users} />
      </ShowcaseSection>

      <ShowcaseSection
        index="03"
        total="04"
        tag="Display"
        title="Joke Viewer"
        description="A stacked card deck with a blurred punchline. Navigate with arrow keys or buttons."
        note="card stack · blur reveal · SSG"
        href="/jokes"
      >
        <JokeViewer jokes={jokes} />
      </ShowcaseSection>

      <ShowcaseSection
        index="04"
        total="04"
        tag="Display"
        title="Cat Swiper"
        description="Swipeable cat image cards fetched from your own API. Drag or click to move through the deck."
        note="drag to swipe · CSR fetch · SSG page"
        href="/cats"
      >
        <CatSwiper />
      </ShowcaseSection>
    </main>
  )
}
