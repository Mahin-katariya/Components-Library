// Server Component — purely static, no interactivity needed

export function Footer() {
  return (
    <footer
      style={{
        padding: "48px 0 64px",
        marginTop: 32,
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 24px",
          textAlign: "center",
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          color: "rgba(40, 34, 28, 0.40)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        built with care
        {/* heart icon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ width: 12, height: 12, color: "#221d18", flexShrink: 0 }}
        >
          <path d="M12 21s-7-4.6-9.3-9C1 8.4 2.6 5 6 5c2 0 3.2 1.1 4 2.3C10.8 6.1 12 5 14 5c3.4 0 5 3.4 3.3 7-2.3 4.4-9.3 9-9.3 9z" />
        </svg>
        no color required
      </div>
    </footer>
  )
}