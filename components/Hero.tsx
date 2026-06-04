// Server Component — no interactivity, no "use client" needed

type Props = {
  componentCount?: number
}

export function Hero({ componentCount = 4 }: Props) {
  return (
    <header
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "96px 24px 32px",
        textAlign: "center",
      }}
    >
      {/* ── eyebrow badge ── */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 28,
          background: "#ffffff",
          border: "1px solid rgba(40, 34, 28, 0.10)",
          borderRadius: 999,
          padding: "7px 16px",
          boxShadow:
            "0 1px 2px rgba(40,34,28,0.04), 0 10px 30px -8px rgba(40,34,28,0.10)",
          whiteSpace: "nowrap",
        }}
      >
        {/* sparkle icon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ width: 12, height: 12, color: "#221d18", flexShrink: 0 }}
        >
          <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
        </svg>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "rgba(40, 34, 28, 0.40)",
          }}
        >
          a soft little component library
        </span>
      </div>

      {/* ── headline ── */}
      <h1
        style={{
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(48px, 9vw, 100px)",
          lineHeight: 0.98,
          letterSpacing: "-0.02em",
          color: "rgba(28, 24, 20, 0.92)",
          margin: "0 0 20px",
        }}
      >
        UI Components
      </h1>

      {/* ── sub heading ── */}
      <p
        style={{
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 500,
          fontSize: "clamp(16px, 2.4vw, 22px)",
          color: "rgba(40, 34, 28, 0.60)",
          margin: "0 0 28px",
        }}
      >
        Soft. Rounded. Monochrome.
      </p>

      {/* ── count bar ── */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
          color: "rgba(40, 34, 28, 0.40)",
        }}
      >
        <span>
          <b style={{ color: "rgba(28, 24, 20, 0.92)", fontWeight: 500 }}>
            {componentCount}
          </b>{" "}
          components
        </span>

        {/* divider bar */}
        <span
          style={{
            width: 36,
            height: 1,
            background: "rgba(40, 34, 28, 0.30)",
            display: "inline-block",
          }}
        />

        <span>0 dependencies</span>
      </div>
    </header>
  )
}