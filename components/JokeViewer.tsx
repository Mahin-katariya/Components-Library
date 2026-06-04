"use client"

import { useState, useRef, useCallback, useEffect } from "react"

type Joke = {
  id: string
  setup: string
  punchline: string
}

type Props = {
  jokes: Joke[]
}

const pad = (n: number) => String(n).padStart(2, "0")

export function JokeViewer({ jokes }: Props) {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [exitDir, setExitDir] = useState<"" | "left" | "right">("")
  const [advancing, setAdvancing] = useState(false)
  const [saved, setSaved] = useState<Set<number>>(new Set())
  const [overlayOpen, setOverlayOpen] = useState(false)
  const lockRef = useRef(false)

  const top = jokes[index]

  const go = useCallback(
    (dir: number) => {
      if (lockRef.current || jokes.length === 0) return
      lockRef.current = true
      setExitDir(dir > 0 ? "left" : "right")
      setAdvancing(true)
      setRevealed(false)
      setTimeout(() => {
        setIndex((i) => (i + (dir > 0 ? 1 : jokes.length - 1)) % jokes.length)
        setExitDir("")
        setAdvancing(false)
        lockRef.current = false
      }, 280)
    },
    [jokes.length]
  )

  const toggleSave = useCallback(() => {
    setSaved((prev) => {
      const next = new Set(prev)
      next.has(index) ? next.delete(index) : next.add(index)
      return next
    })
  }, [index])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(1) }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1) }
      else if (e.key.toLowerCase() === "s") toggleSave()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go, toggleSave])

  const savedList = [...saved].sort((a, b) => a - b).map((i) => jokes[i]).filter(Boolean)

  if (!top) return null

  // ─── transition classes for the top card
  const topCardClass = [
    "card-top",
    revealed ? "revealed" : "",
    exitDir ? `exit-${exitDir}` : "",
  ].filter(Boolean).join(" ")

  return (
    <>
      {/* ─── global styles injected once ─── */}
      <style>{`
        .card-base {
          width: 100%;
          border: 1px solid #e0ddd6;
          padding: 40px;
          transition: transform 280ms ease, opacity 280ms ease-in, background 280ms ease;
        }
        .card-third {
          position: absolute; top: 0; left: 0; right: 0; height: 100%;
          z-index: 1;
          transform: translateY(20px) scale(0.92);
          background: #dedad2;
        }
        .card-second {
          position: absolute; top: 0; left: 0; right: 0; height: 100%;
          z-index: 2;
          transform: translateY(12px) scale(0.96);
          background: #e8e5de;
        }
        .card-top {
          position: relative;
          background: #ffffff;
          z-index: 3;
        }
        .stack.advancing .card-second { transform: translateY(0) scale(1); }
        .stack.advancing .card-third  { transform: translateY(12px) scale(0.96); }
        .card-top.exit-left  { transform: translateX(-120%) rotate(-4deg); opacity: 0; }
        .card-top.exit-right { transform: translateX(120%)  rotate(4deg);  opacity: 0; }
        .punchline {
          filter: blur(8px);
          color: #cccccc;
          transition: filter 400ms ease, color 400ms ease;
        }
        .card-top.revealed .punchline {
          filter: blur(0);
          color: #2a2a2a;
        }
      `}</style>

      <div
        className="flex flex-col items-center w-full"
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >

        {/* ─── Saved badge ─── */}
        <div className="w-full flex justify-end mb-4" style={{ maxWidth: 480 }}>
          <button
            onClick={() => setOverlayOpen(true)}
            className="text-xs cursor-pointer bg-transparent border-none"
            style={{ color: "#aaaaaa", letterSpacing: "0.02em", padding: "4px 6px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#777")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#aaaaaa")}
          >
            {saved.size} saved
          </button>
        </div>

        {/* ─── Card stack ─── */}
        <div
          className={`stack relative${advancing ? " advancing" : ""}`}
          style={{ position: "relative", width: 480, maxWidth: "calc(100vw - 48px)" }}
        >
          {/* Back cards — decorative depth */}
          <div className="card-base card-third" />
          <div className="card-base card-second" />

          {/* Top card */}
          <div className={`card-base ${topCardClass}`}>

            {/* Index + category header */}
            <div className="flex justify-between items-baseline mb-7">
              <span
                style={{
                  fontFamily: "'SF Mono', ui-monospace, Menlo, Consolas, monospace",
                  fontSize: 11,
                  color: "#cccccc",
                }}
              >
                {pad(index + 1)} / {pad(jokes.length)}
              </span>
              <button
                onClick={toggleSave}
                className="text-xs bg-transparent border-none cursor-pointer"
                style={{
                  fontSize: 11,
                  color: saved.has(index) ? "#2a2a2a" : "#cccccc",
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#777")}
                onMouseLeave={(e) => (e.currentTarget.style.color = saved.has(index) ? "#2a2a2a" : "#cccccc")}
              >
                {saved.has(index) ? "★ saved" : "☆ save"}
              </button>
            </div>

            {/* Setup */}
            <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.75, color: "#2a2a2a" }}>
              {top.setup}
            </p>

            {/* Divider with reveal trigger */}
            <div className="relative my-8" style={{ height: 1, background: "#eeebe6", textAlign: "center" }}>
              <span
                className="absolute cursor-pointer select-none"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "#ffffff",
                  padding: "0 12px",
                  fontSize: 10,
                  color: revealed ? "#999" : "#cccccc",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                }}
                onClick={() => setRevealed(true)}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#999")}
                onMouseLeave={(e) => (e.currentTarget.style.color = revealed ? "#999" : "#ccc")}
              >
                punchline
              </span>
            </div>

            {/* Punchline — blurred until revealed */}
            <p
              className="punchline"
              style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.75 }}
            >
              {top.punchline}
            </p>
          </div>
        </div>

        {/* ─── Nav buttons ─── */}
        <div className="flex gap-9 mt-8">
          <button
            onClick={() => go(-1)}
            className="cursor-pointer bg-transparent border-none"
            style={{ fontSize: 12, color: "#aaaaaa", padding: "6px 4px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#777")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#aaaaaa")}
          >
            ← prev
          </button>
          <button
            onClick={() => go(1)}
            className="cursor-pointer bg-transparent border-none"
            style={{ fontSize: 12, color: "#aaaaaa", padding: "6px 4px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#777")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#aaaaaa")}
          >
            next →
          </button>
        </div>

        {/* ─── Keyboard hint ─── */}
        <p
          className="mt-4"
          style={{
            fontFamily: "'SF Mono', ui-monospace, Menlo, monospace",
            fontSize: 10,
            color: "#cccccc",
            letterSpacing: "0.08em",
          }}
        >
          ← → navigate &nbsp;·&nbsp; s to save
        </p>

        {/* ─── Saved overlay ─── */}
        {overlayOpen && (
          <div
            className="fixed inset-0 overflow-y-auto"
            style={{ background: "#ffffff", zIndex: 100, padding: "80px 48px" }}
          >
            <button
              className="fixed cursor-pointer bg-transparent border-none"
              style={{ top: 26, right: 28, fontSize: 20, color: "#aaaaaa", lineHeight: 1 }}
              onClick={() => setOverlayOpen(false)}
              aria-label="Close"
              onMouseEnter={(e) => (e.currentTarget.style.color = "#2a2a2a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#aaaaaa")}
            >
              ×
            </button>

            <p
              style={{
                fontSize: 11,
                color: "#aaaaaa",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                marginBottom: 32,
                maxWidth: 560,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {saved.size} saved jokes
            </p>

            {savedList.length === 0 ? (
              <p style={{ maxWidth: 560, margin: "0 auto", fontSize: 15, color: "#aaa" }}>
                Nothing saved yet.
              </p>
            ) : (
              <ol style={{ maxWidth: 560, margin: "0 auto", listStyle: "none", padding: 0 }}>
                {savedList.map((j, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: 18,
                      padding: "16px 0",
                      borderBottom: "1px solid #f0ede8",
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: "#2a2a2a",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'SF Mono', ui-monospace, Menlo, monospace",
                        fontSize: 11,
                        color: "#ccc",
                        paddingTop: 4,
                        flexShrink: 0,
                      }}
                    >
                      {pad(i + 1)}
                    </span>
                    <span>
                      {j.setup}{" "}
                      <span style={{ color: "#888" }}>{j.punchline}</span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </>
  )
}