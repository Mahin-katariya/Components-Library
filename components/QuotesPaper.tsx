"use client"

import { useState, useRef, useCallback } from "react"

type Quote = {
  id: string
  text: string
  author: string
}

type Props = {
  quotes: Quote[]
}

// animation phase the card can be in
type Phase = "idle" | "ripping" | "dropping"

export function QuotesPaper({ quotes }: Props) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>("idle")
  // CSS custom property values for the settled/drop position
  const [ripVars, setRipVars] = useState({
    rotStart: "0deg",
    rotEnd: "0deg",
    posX: "0px",
    posY: "0px",
  })

  const isAnimating = useRef(false)
  const flashRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const triggerRip = useCallback(() => {
    if (isAnimating.current) return
    isAnimating.current = true

    // 1. start rip + flash + shake
    setPhase("ripping")

    if (flashRef.current) {
      // force reflow so re-adding the class triggers the animation again
      flashRef.current.classList.remove("flash-active")
      void flashRef.current.offsetWidth
      flashRef.current.classList.add("flash-active")
    }
    if (containerRef.current) {
      containerRef.current.classList.remove("screen-shake")
      void containerRef.current.offsetWidth
      containerRef.current.classList.add("screen-shake")
    }

    // 2. after rip finishes (600ms) — pick new quote, calc offsets, drop in
    setTimeout(() => {
      const nextIndex = (index + 1) % quotes.length

      const rot    = Math.random() * 10 - 5   // ±5 deg
      const posX   = Math.random() * 40 - 20  // ±20 px
      const posY   = Math.random() * 40 - 20  // ±20 px

      // Write offsets into state — these become CSS vars on the card element.
      // The dropIn keyframe reads --rot-start, --rot-end, --pos-x, --pos-y.
      // The .is-settled class (applied after drop) also reads --rot-end /
      // --pos-x / --pos-y — so the card rests exactly where the animation
      // landed without us ever touching card.style.transform directly.
      setRipVars({
        rotStart: `${rot * 1.5}deg`,
        rotEnd:   `${rot}deg`,
        posX:     `${posX}px`,
        posY:     `${posY}px`,
      })

      setIndex(nextIndex)

      // Two rAFs guarantee React has committed the new index + vars to the
      // DOM before we switch to "dropping", preventing the keyframe from
      // starting before its CSS variables are live.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase("dropping")

          // 3. after drop finishes (500ms) — return to idle
          setTimeout(() => {
            setPhase("idle")
            isAnimating.current = false
          }, 500)
        })
      })
    }, 600)
  }, [index, quotes.length])

  const quote = quotes[index]
  if (!quote) return null

  // The card's inline CSS custom properties carry the random offset values.
  // Keyframes read them directly — no persistent transform is ever written
  // onto the element, which is the entire bug fix.
  const cardVars = {
    "--rot-start": ripVars.rotStart,
    "--rot-end":   ripVars.rotEnd,
    "--pos-x":     ripVars.posX,
    "--pos-y":     ripVars.posY,
  } as React.CSSProperties

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap');

        /* ── paper texture noise overlay ── */
        .paper-texture { position: relative; overflow: hidden; }
        .paper-texture::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.15;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          mix-blend-mode: multiply;
        }

        /* ── torn-corner clip ── */
        .tear-corner {
          clip-path: polygon(0 0, 85% 0, 100% 15%, 100% 100%, 0 100%);
        }

        /* ── flash overlay ── */
        .flash-overlay {
          position: fixed;
          inset: 0;
          background: white;
          z-index: 50;
          opacity: 0;
          pointer-events: none;
        }
        .flash-active {
          animation: flash 0.3s ease-out forwards;
        }

        /* ── screen shake on container ── */
        .screen-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }

        /* ── card phase animations ── */
        .card-ripping {
          animation: tearApart 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .card-dropping {
          animation: dropIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        /*
         * KEY FIX — .card-idle uses the CSS custom properties for its
         * resting transform instead of an inline style.transform.
         * This means tearApart always fires from a CLEAN computed transform
         * that the keyframe can fully override on every subsequent click.
         *
         * Before the fix: card.style.transform was set persistently after
         * each dropIn, so on the next rip tearApart had to fight an inline
         * style and visually went nowhere after the first tear.
         */
        .card-idle {
          transform: translate(var(--pos-x, 0px), var(--pos-y, 0px)) rotate(var(--rot-end, 0deg));
          transition: box-shadow 300ms ease;
        }

        /* ── keyframes ── */
        @keyframes tearApart {
          0%   { transform: scale(1) rotate(0deg);
                 opacity: 1;
                 clip-path: polygon(0 0, 85% 0, 100% 15%, 100% 100%, 0 100%); }
          50%  { transform: scale(1.05) rotate(2deg);
                 opacity: 0.8;
                 clip-path: polygon(0 0, 40% 0, 50% 50%, 40% 100%, 0 100%); }
          100% { transform: scale(0.9) translate(-100px, 50px) rotate(-15deg);
                 opacity: 0;
                 clip-path: polygon(0 0, 40% 0, 50% 50%, 40% 100%, 0 100%); }
        }

        @keyframes dropIn {
          0%   { opacity: 0;
                 transform: translateY(-50px) scale(1.1) rotate(var(--rot-start, 0deg)); }
          100% { opacity: 1;
                 transform: translate(var(--pos-x, 0px), var(--pos-y, 0px)) rotate(var(--rot-end, 0deg)); }
        }

        @keyframes flash {
          0%   { opacity: 0.8; }
          100% { opacity: 0; }
        }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>

      {/* flash overlay */}
      <div ref={flashRef} className="flash-overlay" />

      {/* wrapper — receives shake animation */}
      <div
        ref={containerRef}
        style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {/* the card */}
        <article
          style={{
            ...cardVars,
            width: "100%",
            maxWidth: 480,
            height: 320,
            backgroundColor: "#FDFDFD",
            boxShadow:
              phase === "idle"
                ? "8px 8px 0px rgba(0,0,0,0.12)"
                : "10px 10px 0px rgba(0,0,0,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            cursor: "pointer",
            userSelect: "none",
          }}
          className={[
            "tear-corner",
            "paper-texture",
            phase === "idle"     ? "card-idle"     : "",
            phase === "ripping"  ? "card-ripping"  : "",
            phase === "dropping" ? "card-dropping" : "",
          ].filter(Boolean).join(" ")}
          onClick={triggerRip}
        >
          <p
            style={{
              fontFamily: "'Reenie Beanie', cursive",
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              color: "#0A0B0C",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {quote.text}
          </p>
        </article>
      </div>
    </>
  )
}