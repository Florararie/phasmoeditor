'use client'

import { useMemo, useState } from 'react'
import { setIn, PathSegment } from '../../lib/pathUtils'
import { ChevronIcon, NumberField, SearchIcon, TextField, ToggleSwitch } from './shared'

interface TreeTabProps {
  data: { [key: string]: any }
  onChange: (next: any) => void
}

function isContainer(value: any): value is object {
  return value !== null && typeof value === 'object'
}

/** Does this node - or anything under it - match the filter text? */
function matchesFilter(value: any, label: string, filterLower: string): boolean {
  if (label.toLowerCase().includes(filterLower)) return true
  if (isContainer(value)) {
    const entries = Array.isArray(value) ? value.map((v, i) => [String(i), v] as const) : Object.entries(value)
    return entries.some(([k, v]) => matchesFilter(v, k, filterLower))
  }
  return String(value).toLowerCase().includes(filterLower)
}

function LeafInput({
  value,
  onCommit,
}: {
  value: any
  onCommit: (next: any) => void
}) {
  if (typeof value === 'boolean') {
    return <ToggleSwitch checked={value} onChange={onCommit} />
  }
  if (typeof value === 'number') {
    return (
      <NumberField
        value={value}
        float={!Number.isInteger(value)}
        onCommit={onCommit}
        className="w-40 rounded-md border border-line bg-void px-2 py-1 font-mono text-xs text-paper outline-none focus:border-signal"
      />
    )
  }
  if (typeof value === 'string') {
    return (
      <TextField
        key={value}
        value={value}
        onCommit={onCommit}
        className="w-56 rounded-md border border-line bg-void px-2 py-1 font-mono text-xs text-paper outline-none focus:border-signal"
      />
    )
  }
  // null / undefined / anything else - not directly editable here
  return <span className="font-mono text-xs text-mist/70">{String(value)}</span>
}

function TreeNode({
  label,
  value,
  path,
  depth,
  expanded,
  toggleExpand,
  filterLower,
  showAll,
  onLeafChange,
}: {
  label: string
  value: any
  path: PathSegment[]
  depth: number
  expanded: Set<string>
  toggleExpand: (key: string) => void
  filterLower: string
  showAll: boolean
  onLeafChange: (path: PathSegment[], value: any) => void
}) {
  const pathKey = path.join('\u0001')
  const indent = { paddingLeft: depth * 18 }
  const ownLabelMatches = filterLower ? label.toLowerCase().includes(filterLower) : false
  const showAllChildren = showAll || ownLabelMatches

  if (!isContainer(value)) {
    return (
      <div style={indent} className="flex items-center gap-3 py-1 pr-2">
        <span className="w-3.5 shrink-0" />
        <span className="truncate font-mono text-xs text-mist" title={label}>
          {label}
        </span>
        <span className="ml-auto shrink-0">
          <LeafInput value={value} onCommit={(v) => onLeafChange(path, v)} />
        </span>
      </div>
    )
  }

  const isArray = Array.isArray(value)
  const entries = isArray
    ? value.map((v, i) => [String(i), v] as const)
    : Object.entries(value)
  const visibleEntries =
    filterLower && !showAllChildren
      ? entries.filter(([k, v]) => matchesFilter(v, k, filterLower))
      : entries
  const isExpanded = filterLower ? true : expanded.has(pathKey)

  return (
    <div>
      <button
        type="button"
        onClick={() => toggleExpand(pathKey)}
        style={indent}
        className="flex w-full items-center gap-2 py-1 pr-2 text-left hover:bg-void/40"
      >
        <ChevronIcon expanded={isExpanded} />
        <span className="truncate font-mono text-xs text-paper" title={label}>
          {label}
        </span>
        <span className="shrink-0 font-mono text-[10px] text-mist">
          {isArray ? `[${entries.length}]` : `{${entries.length}}`}
        </span>
      </button>
      {isExpanded &&
        visibleEntries.map(([k, v]) => (
          <TreeNode
            key={k}
            label={k}
            value={v}
            path={[...path, isArray ? Number(k) : k]}
            depth={depth + 1}
            expanded={expanded}
            toggleExpand={toggleExpand}
            filterLower={filterLower}
            showAll={showAllChildren}
            onLeafChange={onLeafChange}
          />
        ))}
    </div>
  )
}

const TreeTab = ({ data, onChange }: TreeTabProps) => {
  const [filter, setFilter] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const filterLower = filter.trim().toLowerCase()

  const toggleExpand = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const onLeafChange = (path: PathSegment[], value: any) => {
    onChange(setIn(data, path, value))
  }

  const rootEntries = useMemo(() => {
    const entries = Object.entries(data)
    if (!filterLower) return entries
    return entries.filter(([k, v]) => matchesFilter(v, k, filterLower))
  }, [data, filterLower])

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search fields..."
          className="w-full rounded-lg border border-line bg-panel2 py-2 pl-9 pr-3 font-mono text-sm text-paper outline-none placeholder:text-mist/60 focus:border-signal"
        />
      </div>

      <div className="max-h-[28rem] overflow-y-auto rounded-lg border border-line bg-panel2 p-2">
        {rootEntries.length === 0 ? (
          <p className="py-8 text-center font-mono text-sm text-mist">
            No fields match &quot;{filter}&quot;
          </p>
        ) : (
          rootEntries.map(([k, v]) => (
            <TreeNode
              key={k}
              label={k}
              value={v}
              path={[k]}
              depth={0}
              expanded={expanded}
              toggleExpand={toggleExpand}
              filterLower={filterLower}
              showAll={false}
              onLeafChange={onLeafChange}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default TreeTab
