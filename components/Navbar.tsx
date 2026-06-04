"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_LINKS = [
  { label: "Quotes",   href: "/quotes"  },
  { label: "Users",    href: "/users"   },
  { label: "Jokes",    href: "/jokes"   },
  { label: "Cats",     href: "/cats"    },
  { label: "Requests", href: "/requests/new" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <>
      <style>{`
        /* ── pulse animation on the logo dot ── */
        @keyframes nav-pulse {
          0%, 100% { opacity: 1; transform: scale(1);    }
          50%       { opacity: 0.4; transform: scale(0.65); }
        }
        .logo-dot {
          animation: nav-pulse 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-dot { animation: none; }
        }
      `}</style>

      {/* outer positioning — sticky pill floating 16px from top */}
      <div
        style={{
          position: "sticky",
          top: 16,
          zIndex: 100,
          maxWidth: 1080,
          width: "calc(100% - 32px)",
          margin: "16px auto 0",
        }}
      >
        <nav
          style={{
            borderRadius: 999,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            background: "rgba(255, 255, 255, 0.72)",
            border: "1px solid rgba(40, 34, 28, 0.10)",
            boxShadow:
              "0 1px 2px rgba(40,34,28,0.04), 0 10px 30px -8px rgba(40,34,28,0.10)",
          }}
        >
          <div
            style={{
              padding: "0 14px 0 22px",
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* ── logo ── */}
            <Link
              href="/"
              style={{
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.04em",
                color: "rgba(28, 24, 20, 0.92)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              {/* pulsing dot */}
              <span
                className="logo-dot"
                style={{
                  width: 9,
                  height: 9,
                  background: "#221d18",
                  borderRadius: "50%",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              components
            </Link>

            {/* ── nav links ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {NAV_LINKS.map(({ label, href }) => {
                const isActive =
                  href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(href)

                return (
                  <Link
                    key={href}
                    href={href}
                    style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                      padding: "8px 16px",
                      borderRadius: 999,
                      transition:
                        "color 180ms cubic-bezier(0.16,1,0.3,1), background 180ms cubic-bezier(0.16,1,0.3,1)",
                      color: isActive
                        ? "rgba(28, 24, 20, 0.92)"
                        : "rgba(40, 34, 28, 0.60)",
                      background: isActive ? "#f7f5f0" : "transparent",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "rgba(28, 24, 20, 0.92)"
                        e.currentTarget.style.background = "#f7f5f0"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "rgba(40, 34, 28, 0.60)"
                        e.currentTarget.style.background = "transparent"
                      }
                    }}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}