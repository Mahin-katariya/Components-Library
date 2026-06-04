"use client"

import { useState } from "react"

type User = {
  id: string
  name: string
  bio: string
  avatarUrl: string
}

type Props = {
  users: User[]
}

// derive initials from a full name — "Mara Lin" → "ML"
function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

// deterministic dark tone per index — matches the original palette
const TONES = ["#1d1915", "#3a322a", "#564b40", "#6b5e50", "#2b251f"]

export function AvatarStack({ users }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <>
      <style>{`
        .avatar-stack-root {
          font-family: "Quicksand", sans-serif;
          -webkit-font-smoothing: antialiased;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── stack row ── */
        .avatar-list {
          display: flex;
          align-items: center;
          padding: 96px 0 16px; /* top padding gives room for tooltip */
        }

        /* ── individual item ── */
        .avatar-item {
          position: relative;
          width: 88px;
          height: 88px;
          margin-left: -30px; /* overlap */
          z-index: 1;
          transition: z-index 0s;
        }
        .avatar-item:first-child { margin-left: 0; }
        /* stacking order: later items render on top by default */
        .avatar-item:nth-child(1) { z-index: 1; }
        .avatar-item:nth-child(2) { z-index: 2; }
        .avatar-item:nth-child(3) { z-index: 3; }
        .avatar-item:nth-child(4) { z-index: 4; }
        .avatar-item:nth-child(5) { z-index: 5; }
        .avatar-item.is-hovered   { z-index: 20; }

        /* ── circle ── */
        .avatar-circle {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          /* gap ring between neighbours using bg colour */
          box-shadow: 0 0 0 5px #f1efe9;
          transition:
            transform 340ms cubic-bezier(0.34, 1.4, 0.5, 1),
            box-shadow 280ms cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .avatar-item.is-hovered .avatar-circle {
          transform: translateY(-12px) scale(1.07);
          box-shadow:
            0 0 0 5px #f1efe9,
            0 2px 4px rgba(40,34,28,0.05),
            0 22px 50px -12px rgba(40,34,28,0.16);
        }

        /* ── monogram fallback ── */
        .avatar-mono {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Quicksand", sans-serif;
          font-weight: 700;
          font-size: 30px;
          color: #fff;
          letter-spacing: 0.02em;
        }

        /* ── tooltip ── */
        .avatar-tooltip {
          position: absolute;
          left: 50%;
          bottom: calc(100% + 18px);
          transform: translateX(-50%) translateY(8px) scale(0.96);
          transform-origin: bottom center;
          background: #221d18;
          color: #fff;
          border-radius: 16px;
          padding: 13px 18px;
          box-shadow: 0 2px 4px rgba(40,34,28,0.05), 0 22px 50px -12px rgba(40,34,28,0.16);
          opacity: 0;
          pointer-events: none;
          transition:
            opacity 200ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 260ms cubic-bezier(0.34, 1.4, 0.5, 1);
          white-space: nowrap;
          z-index: 30;
        }
        /* arrow caret */
        .avatar-tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-6px) rotate(45deg);
          width: 12px;
          height: 12px;
          background: #221d18;
          border-radius: 3px;
        }
        .avatar-item.is-hovered .avatar-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
        }

        .tooltip-name {
          font-family: "Quicksand", sans-serif;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: -0.01em;
          line-height: 1.1;
        }
        .tooltip-bio {
          font-family: "Quicksand", sans-serif;
          font-weight: 500;
          font-size: 12.5px;
          line-height: 1.45;
          color: rgba(255,255,255,0.6);
          margin-top: 5px;
        }

        /* ── hint ── */
        .avatar-hint {
          margin-top: 40px;
          font-family: "DM Mono", monospace;
          font-size: 11px;
          color: rgba(40,34,28,0.40);
          letter-spacing: 0.04em;
          text-align: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .avatar-circle,
          .avatar-tooltip { transition: none !important; }
        }
      `}</style>

      <div className="avatar-stack-root">
        <ul
          className="avatar-list"
          style={{ listStyle: "none", margin: 0, padding: "96px 0 16px" }}
        >
          {users.map((user, i) => {
            const isHovered = hoveredId === user.id
            // bio lines — split on newline if present
            const bioLines = user.bio.split("\n")

            return (
              <li
                key={user.id}
                className={`avatar-item${isHovered ? " is-hovered" : ""}`}
                onMouseEnter={() => setHoveredId(user.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* tooltip — rendered above the circle */}
                <div className="avatar-tooltip">
                  <div className="tooltip-name">{user.name}</div>
                  <div className="tooltip-bio">
                    {bioLines.map((line, j) => (
                      <span key={j}>
                        {line}
                        {j < bioLines.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>

                {/* circle */}
                <div className="avatar-circle">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      draggable={false}
                    />
                  ) : (
                    /* monogram fallback — shown when avatarUrl is empty string */
                    <div
                      className="avatar-mono"
                      style={{ background: TONES[i % TONES.length] }}
                    >
                      {initials(user.name)}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        <p className="avatar-hint">hover to reveal name &amp; role</p>
      </div>
    </>
  )
}