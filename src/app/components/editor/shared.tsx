'use client'

import { useEffect, useState } from 'react'

export function SearchIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
}

export function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function ToggleSwitch({
  id,
  checked,
  onChange,
}: {
  id?: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
        checked ? 'border-signal bg-signal' : 'border-line bg-panel'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full shadow transition-transform ${
          checked ? 'translate-x-5 bg-paper' : 'translate-x-1 bg-mist'
        }`}
      />
    </button>
  )
}

/**
 * Number input that commits immediately on every change - spinbox
 * arrow clicks and typed digits both update the underlying save data
 * right away, so it's always in sync with what downloads. `value` is
 * kept in an internal text buffer so a partial/invalid state while
 * typing (e.g. a lone "-" before a negative number) doesn't get
 * clobbered, but resyncs whenever the value changes from elsewhere
 * (a bulk action, the Raw JSON tab, etc).
 */
export function NumberField({
  value,
  onCommit,
  float = false,
  className,
}: {
  value: number
  onCommit: (next: number) => void
  float?: boolean
  className?: string
}) {
  const [text, setText] = useState(String(value))

  useEffect(() => {
    setText(String(value))
  }, [value])

  return (
    <input
      type="number"
      step={float ? 'any' : '1'}
      value={text}
      onChange={(e) => {
        const raw = e.target.value
        setText(raw)
        const parsed = float ? parseFloat(raw) : parseInt(raw, 10)
        if (!Number.isNaN(parsed)) onCommit(parsed)
      }}
      className={
        className ??
        'w-full rounded-md border border-line bg-void px-2.5 py-1.5 font-mono text-sm text-paper outline-none focus:border-signal'
      }
    />
  )
}

export function TextField({
  value,
  onCommit,
  className,
}: {
  value: string
  onCommit: (next: string) => void
  className?: string
}) {
  return (
    <input
      type="text"
      defaultValue={value}
      onBlur={(e) => onCommit(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
      }}
      className={
        className ??
        'w-full rounded-md border border-line bg-void px-2.5 py-1.5 font-mono text-sm text-paper outline-none focus:border-signal'
      }
    />
  )
}

/** Splits a PascalCase/camelCase key into readable words, e.g. "EMFReader" -> "EMF Reader". */
export function humanizeKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .trim()
}
