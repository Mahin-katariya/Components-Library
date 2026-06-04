"use client"

import { useActionState } from "react"
import { submitRequest } from "@/actions/requests"
import { ComponentType } from "@/lib/generated/prisma/enums"

const COMPONENT_TYPES = Object.values(ComponentType)

const label: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-dm-mono), monospace",
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  color: "rgba(40, 34, 28, 0.50)",
  marginBottom: 8,
}

const input: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-quicksand), sans-serif",
  fontSize: 14,
  fontWeight: 500,
  color: "rgba(28, 24, 20, 0.92)",
  background: "#faf9f6",
  border: "1px solid rgba(40, 34, 28, 0.12)",
  borderRadius: 12,
  padding: "12px 16px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 180ms ease, box-shadow 180ms ease",
}

export function RequestForm() {
  const [state, action, pending] = useActionState(submitRequest, null)

  if (state?.success) {
    return (
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "rgba(40, 34, 28, 0.40)",
            marginBottom: 12,
          }}
        >
          Request received
        </p>
        <p
          style={{
            fontFamily: "var(--font-quicksand), sans-serif",
            fontWeight: 600,
            fontSize: 20,
            color: "rgba(28, 24, 20, 0.92)",
            margin: 0,
          }}
        >
          We'll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "64px 24px" }}>
      {/* heading */}
      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "rgba(40, 34, 28, 0.40)",
            marginBottom: 12,
          }}
        >
          Component request
        </p>
        <h1
          style={{
            fontFamily: "var(--font-quicksand), sans-serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 5vw, 40px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "rgba(28, 24, 20, 0.92)",
            margin: 0,
          }}
        >
          Request a component
        </h1>
      </div>

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* email */}
        <div>
          <label htmlFor="email" style={label}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            style={input}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(40, 34, 28, 0.35)"
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(40,34,28,0.06)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(40, 34, 28, 0.12)"
              e.currentTarget.style.boxShadow = "none"
            }}
          />
        </div>

        {/* component type */}
        <div>
          <label htmlFor="componentType" style={label}>Component type</label>
          <select
            id="componentType"
            name="componentType"
            required
            defaultValue=""
            style={{
              ...input,
              appearance: "none",
              WebkitAppearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(40,34,28,0.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 14px center",
              paddingRight: 36,
              cursor: "pointer",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(40, 34, 28, 0.35)"
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(40,34,28,0.06)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(40, 34, 28, 0.12)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            <option value="" disabled>Select a type…</option>
            {COMPONENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* description */}
        <div>
          <label htmlFor="description" style={label}>Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Describe what you'd like built…"
            required
            style={{
              ...input,
              resize: "vertical",
              lineHeight: 1.6,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(40, 34, 28, 0.35)"
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(40,34,28,0.06)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(40, 34, 28, 0.12)"
              e.currentTarget.style.boxShadow = "none"
            }}
          />
        </div>

        {/* error */}
        {state?.error && (
          <p
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 11,
              color: "rgba(180, 60, 40, 0.80)",
              margin: 0,
            }}
          >
            {state.error}
          </p>
        )}

        {/* submit */}
        <button
          type="submit"
          disabled={pending}
          style={{
            fontFamily: "var(--font-quicksand), sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.04em",
            color: pending ? "rgba(40, 34, 28, 0.40)" : "#faf9f6",
            background: pending ? "#e8e5de" : "rgba(28, 24, 20, 0.92)",
            border: "none",
            borderRadius: 999,
            padding: "14px 32px",
            cursor: pending ? "not-allowed" : "pointer",
            transition: "background 200ms ease, color 200ms ease",
            alignSelf: "flex-start",
          }}
        >
          {pending ? "Submitting…" : "Submit request"}
        </button>
      </form>
    </div>
  )
}
