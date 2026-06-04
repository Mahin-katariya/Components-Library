export const dynamic = "force-dynamic"

import { prisma } from "@/lib/db"
import { QuotesPaper } from "@/components/QuotesPaper"

export default async function QuotesPage() {
  const quotes = await prisma.quote.findMany()
  return <div style={{ paddingTop: 64 }}><QuotesPaper quotes={quotes} /></div>
}
