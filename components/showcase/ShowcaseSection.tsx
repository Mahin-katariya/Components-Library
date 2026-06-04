import Link from "next/link"

type Props = {
  index: string
  total: string
  tag: string
  title: string
  description: string
  note: string
  href: string
  children: React.ReactNode
}

export function ShowcaseSection({
  index, total, tag, title,
  description, note, href, children,
}: Props) {
  return (
    <section
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "32px 24px",
      }}
    >
      <div
        style={{
          border: "1px solid rgba(40, 34, 28, 0.10)",
          background: "#ffffff",
          borderRadius: 34,
          overflow: "hidden",
          boxShadow: "0 1px 2px rgba(40,34,28,0.04), 0 10px 30px -8px rgba(40,34,28,0.10)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {/* ── left: info panel ── */}
        <div
          style={{
            padding: "56px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 16,
            borderRight: "1px solid rgba(40, 34, 28, 0.08)",
          }}
        >
          {/* index + tag */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 10,
                color: "rgba(40, 34, 28, 0.40)",
                letterSpacing: "0.12em",
              }}
            >
              {index} / {total}
            </span>
            <span
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "rgba(40, 34, 28, 0.40)",
                background: "#f7f5f0",
                border: "1px solid rgba(40,34,28,0.10)",
                borderRadius: 999,
                padding: "3px 10px",
              }}
            >
              {tag}
            </span>
          </div>

          {/* title */}
          <h2
            style={{
              fontFamily: "var(--font-quicksand), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 42px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "rgba(28, 24, 20, 0.92)",
              margin: 0,
            }}
          >
            {title}
          </h2>

          {/* description */}
          <p
            style={{
              fontFamily: "var(--font-quicksand), sans-serif",
              fontSize: 14,
              lineHeight: 1.7,
              color: "rgba(40, 34, 28, 0.60)",
              margin: 0,
            }}
          >
            {description}
          </p>

          {/* note */}
          <span
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 10,
              color: "rgba(40, 34, 28, 0.35)",
              letterSpacing: "0.08em",
            }}
          >
            {note}
          </span>

          {/* view full page link */}
          <Link
            href={href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 8,
              fontFamily: "var(--font-quicksand), sans-serif",
              fontWeight: 600,
              fontSize: 13,
              color: "#221d18",
              textDecoration: "none",
              width: "fit-content",
            }}
          >
            View full page →
          </Link>
        </div>

        {/* ── right: live component stage ── */}
        <div
          style={{
            background: "#f7f5f0",
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(40,34,28,0.06) 1px, transparent 0)",
            backgroundSize: "20px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
            minHeight: 400,
          }}
        >
          {children}
        </div>
      </div>
    </section>
  )
}