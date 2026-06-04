// components/CatSwiper.tsx
"use client"

import { useState, useRef, useCallback, useEffect } from "react"

type Cat = {
    id: string
    name: string
    imageUrl: string
}

export function CatSwiper() {
    const [cats, setCats] = useState<Cat[]>([])
    const [topPtr, setTopPtr] = useState(0)
    const [loading, setLoading] = useState(true)
    const stageRef = useRef<HTMLDivElement>(null)
    const dragRef = useRef<{ el: HTMLDivElement; startX: number; startY: number; dx: number; dy: number } | null>(null)
    const THRESHOLD = 110
    const MAX_PEEK = 3

    // Fetch all cats once on mount
    useEffect(() => {
        fetch("/api/cats")
            .then((r) => r.json())
            .then(({ data }) => {
                setCats(data)
                setLoading(false)
            })
    }, [])

    const getCardEl = (index: number) =>
        stageRef.current?.querySelector<HTMLDivElement>(`[data-index="${index}"]`)

    const layoutCards = useCallback(
        (ptr: number) => {
            cats.forEach((_, i) => {
                const el = stageRef.current?.querySelector<HTMLDivElement>(`[data-index="${i}"]`)
                if (!el) return
                const depth = i - ptr
                el.classList.toggle("top-card", depth === 0)
                if (depth < 0) {
                    el.style.opacity = "0"
                    el.style.zIndex = "0"
                    el.style.pointerEvents = "none"
                    return
                }
                if (depth > MAX_PEEK - 1) {
                    el.style.opacity = "0"
                    el.style.transform = `translateY(${(MAX_PEEK - 1) * 16}px) scale(${1 - (MAX_PEEK - 1) * 0.05})`
                    el.style.zIndex = "0"
                    el.style.pointerEvents = "none"
                } else {
                    el.style.opacity = "1"
                    el.style.transform = `translateY(${depth * 16}px) scale(${1 - depth * 0.05})`
                    el.style.zIndex = `${cats.length - depth}`
                    el.style.pointerEvents = depth === 0 ? "auto" : "none"
                }
            })
        },
        [cats]
    )

    useEffect(() => {
        if (cats.length) layoutCards(topPtr)
    }, [cats, topPtr, layoutCards])

    const setVerdict = (el: HTMLDivElement, dx: number) => {
        const keep = el.querySelector<HTMLElement>(".verdict-keep")
        const skip = el.querySelector<HTMLElement>(".verdict-skip")
        if (!keep || !skip) return
        const t = Math.min(1, Math.abs(dx) / THRESHOLD)
        if (dx > 0) { keep.style.opacity = String(t); skip.style.opacity = "0" }
        else if (dx < 0) { skip.style.opacity = String(t); keep.style.opacity = "0" }
        else { keep.style.opacity = "0"; skip.style.opacity = "0" }
    }

    const fling = useCallback(
        (index: number, dir: number) => {
            const el = getCardEl(index)
            if (!el) return
            el.style.transition = "transform 420ms cubic-bezier(0.34,1.4,0.5,1), opacity 300ms ease"
            el.style.transform = `translate(${dir > 0 ? 600 : -600}px, 20px) rotate(${dir > 0 ? 24 : -24}deg)`
            el.style.opacity = "0"
            setVerdict(el, 0)
            setTimeout(() => setTopPtr((p) => p + 1), 40)
        },
        [cats]
    )

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, index: number) => {
        if (index !== topPtr) return
        const el = e.currentTarget
        el.style.transition = "none"
        el.classList.add("cursor-grabbing")
        el.setPointerCapture(e.pointerId)
        dragRef.current = { el, startX: e.clientX, startY: e.clientY, dx: 0, dy: 0 }
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragRef.current) return
        const { el, startX, startY } = dragRef.current
        const dx = e.clientX - startX
        const dy = e.clientY - startY
        dragRef.current.dx = dx
        dragRef.current.dy = dy
        const rot = Math.max(-15, Math.min(15, dx / 14))
        el.style.transform = `translate(${dx}px,${dy}px) rotate(${rot}deg)`
        setVerdict(el, dx)
    }

    const handlePointerUp = (index: number) => {
        if (!dragRef.current) return
        const { el, dx } = dragRef.current
        el.classList.remove("cursor-grabbing")
        if (Math.abs(dx) > THRESHOLD) {
            fling(index, dx > 0 ? 1 : -1)
        } else {
            el.style.transition = "transform 420ms cubic-bezier(0.34,1.4,0.5,1)"
            el.style.transform = `translateY(${0}px) scale(1)`
            setVerdict(el, 0)
        }
        dragRef.current = null
    }

    const reset = () => setTopPtr(0)

    const atEnd = topPtr >= cats.length && cats.length > 0

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <span
                    className="font-mono text-xs uppercase tracking-widest"
                    style={{ color: "rgba(40,34,28,0.4)" }}
                >
                    Loading cats...
                </span>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center w-full select-none">

            {/* Stage */}
            <div
                ref={stageRef}
                className="relative"
                style={{ width: 340, maxWidth: "86vw", height: 400, touchAction: "pan-y" }}
            >
                {/* Cards */}
                {cats.map((cat, i) => (
                    <div
                        key={cat.id}
                        data-index={i}
                        className="absolute inset-0 overflow-hidden cursor-grab"
                        style={{
                            background: "#ffffff",
                            border: "1px solid rgba(40,34,28,0.10)",
                            borderRadius: 30,
                            boxShadow: "0 1px 2px rgba(40,34,28,0.04), 0 10px 30px -8px rgba(40,34,28,0.10)",
                            transformOrigin: "center bottom",
                            willChange: "transform",
                            opacity: 0,
                            display: "flex",
                            flexDirection: "column",
                        }}
                        onPointerDown={(e) => handlePointerDown(e, i)}
                        onPointerMove={handlePointerMove}
                        onPointerUp={() => handlePointerUp(i)}
                        onPointerCancel={() => handlePointerUp(i)}
                    >
                        {/* Keep verdict */}
                        <div
                            className="verdict-keep absolute top-5 right-5 z-10 font-bold text-sm uppercase tracking-widest text-white pointer-events-none"
                            style={{
                                padding: "8px 16px",
                                borderRadius: 12,
                                background: "#221d18",
                                border: "2px solid #221d18",
                                transform: "rotate(12deg)",
                                opacity: 0,
                            }}
                        >
                            Keep
                        </div>

                        {/* Skip verdict */}
                        <div
                            className="verdict-skip absolute top-5 left-5 z-10 font-bold text-sm uppercase tracking-widest pointer-events-none"
                            style={{
                                padding: "8px 16px",
                                borderRadius: 12,
                                background: "rgba(255,255,255,0.86)",
                                border: "2px solid rgba(40,34,28,0.30)",
                                color: "#221d18",
                                transform: "rotate(-12deg)",
                                opacity: 0,
                            }}
                        >
                            Skip
                        </div>

                        {/* Preview area */}
                        <div
                            className="relative flex-1 flex items-center justify-center"
                            style={{
                                backgroundImage: `
                  radial-gradient(circle at 1px 1px, rgba(40,34,28,0.06) 1px, transparent 0),
                  none
                `,
                                backgroundSize: "20px 20px",
                                backgroundColor: "#f7f5f0",
                                paddingBottom: "100px",
                                overflow: "hidden",
                            }}
                        >
                            {/* Corner index */}
                            <span
                                className="absolute top-4 left-5 z-10 font-mono text-xs tracking-wide"
                                style={{ color: "rgba(40,34,28,0.4)" }}
                            >
                                {String(i + 1).padStart(2, "0")} / {String(cats.length).padStart(2, "0")}
                            </span>

                            {/* Cat image */}
                            <img
                                src={cat.imageUrl}
                                alt={cat.name}
                                className="absolute inset-0 w-full h-full object-cover"
                                draggable={false}
                            />

                            {/* Dark gradient overlay */}
                            <div
                                className="absolute left-0 right-0 bottom-0 z-10 pointer-events-none"
                                style={{
                                    height: "26%",
                                    background: "linear-gradient(to top, rgba(20,17,14,0.86) 0%, rgba(20,17,14,0.55) 55%, rgba(20,17,14,0) 100%)",
                                }}
                            />

                            {/* Title over image */}
                            <div
                                className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none font-bold"
                                style={{
                                    padding: "0 24px 26px",
                                    fontSize: 27,
                                    letterSpacing: "-0.01em",
                                    color: "#fff",
                                    lineHeight: 1.1,
                                    fontFamily: "'Quicksand', sans-serif",
                                }}
                            >
                                {cat.name}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Done state */}
                {atEnd && (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-8 transition-all duration-300"
                        style={{
                            border: "2px dashed rgba(40,34,28,0.30)",
                            borderRadius: 30,
                            background: "#f7f5f0",
                        }}
                    >
                        <svg
                            className="w-8 h-8"
                            style={{ color: "#221d18" }}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
                        </svg>
                        <h3
                            className="font-bold m-0"
                            style={{ fontSize: 22, color: "rgba(28,24,20,0.92)", fontFamily: "'Quicksand', sans-serif" }}
                        >
                            All caught up
                        </h3>
                        <p className="m-0 text-sm" style={{ color: "rgba(40,34,28,0.60)" }}>
                            You've swiped through the whole deck.
                        </p>
                        <button
                            onClick={reset}
                            className="font-bold text-sm text-white mt-1 cursor-pointer"
                            style={{
                                fontFamily: "'Quicksand', sans-serif",
                                background: "#221d18",
                                border: "none",
                                borderRadius: 999,
                                padding: "12px 26px",
                                boxShadow: "0 1px 2px rgba(40,34,28,0.04), 0 10px 30px -8px rgba(40,34,28,0.10)",
                                transition: "transform 220ms cubic-bezier(0.34,1.4,0.5,1)",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                        >
                            Reset deck
                        </button>
                    </div>
                )}
            </div>

            {/* Progress dots */}
            {!atEnd && (
                <div className="flex items-center gap-2 mt-16">
                    {cats.map((_, i) => (
                        <span
                            key={i}
                            className="rounded-full transition-all duration-300"
                            style={{
                                width: 8,
                                height: 8,
                                background:
                                    i < topPtr
                                        ? "#221d18"
                                        : i === topPtr
                                            ? "#221d18"
                                            : "rgba(40,34,28,0.30)",
                                transform: i === topPtr ? "scale(1.5)" : "scale(1)",
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Hint */}
            {!atEnd && (
                <p
                    className="mt-4 font-mono text-xs tracking-wider text-center"
                    style={{ color: "rgba(40,34,28,0.40)" }}
                >
                    ← skip &nbsp;·&nbsp; keep →
                </p>
            )}
        </div>
    )
}