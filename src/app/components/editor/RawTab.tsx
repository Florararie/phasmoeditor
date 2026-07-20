'use client'

import { useState } from 'react'

interface RawTabProps {
  data: any
  onChange: (next: any) => void
}

const RawTab = ({ data, onChange }: RawTabProps) => {
  const [text, setText] = useState(() => JSON.stringify(data, null, 2))
  const [error, setError] = useState<string | null>(null)
  const [applied, setApplied] = useState(false)

  const handleApply = () => {
    try {
      const parsed = JSON.parse(text)
      onChange(parsed)
      setError(null)
      setApplied(true)
      setTimeout(() => setApplied(false), 1500)
    } catch (e: any) {
      setError(e?.message ?? 'Invalid JSON')
      setApplied(false)
    }
  }

  const handleReset = () => {
    setText(JSON.stringify(data, null, 2))
    setError(null)
    setApplied(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-mist">
          Edit the raw save data as JSON, then apply it to sync your changes to the other tabs.
          Switching tabs without applying discards unsaved edits here.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-paper hover:border-mist"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-md bg-signal px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-void hover:bg-signal/90"
          >
            {applied ? 'Applied!' : 'Apply Changes'}
          </button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setApplied(false)
        }}
        spellCheck={false}
        className="min-h-[28rem] w-full resize-y rounded-lg border border-line bg-void p-3 font-mono text-xs leading-relaxed text-paper outline-none focus:border-signal"
      />

      {error && (
        <p className="rounded-md border border-alert/40 bg-alert/10 px-3 py-2 font-mono text-xs text-alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default RawTab
