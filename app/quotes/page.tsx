import { QuotesPaper } from "@/components/QuotesPaper"

async function getQuotes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/quotes`, {
    cache: "force-cache",
  })
  const { data } = await res.json()
  return data
}

export default async function QuotesPage() {
  const quotes = await getQuotes()
  return <div style={{ paddingTop: 64 }}><QuotesPaper quotes={quotes} /></div>
}