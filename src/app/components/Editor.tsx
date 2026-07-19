'use client'

/*
 eg:
 "ThermometerInventory": {
		"__type": "int",
		"value": 2
	},
*/

import { useMemo, useState } from 'react'

interface DataObject {
  __type: string
  value: any
}

interface EditorProps {
  // data is an object with keys that are strings and values that are objects with the following shape:
  data: {
    [key: string]: DataObject
  }
}

function SearchIcon() {
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

function ToggleSwitch({
  id,
  checked,
  onChange,
}: {
  id: string
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
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors ${
        checked ? 'border-signal bg-signal/90' : 'border-line bg-void'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-void shadow transition-transform ${
          checked ? 'translate-x-6 bg-panel' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

const Editor = (props: EditorProps) => {
  const [filter, setFilter] = useState('')
  // Edits mutate props.data[key].value in place (matches the original
  // design), so toggle switches need a manual re-render to reflect their
  // new state visually. Text/number inputs don't need this: they're
  // uncontrolled, so the DOM already shows what the user typed.
  const [, forceRender] = useState(0)

  const keys = useMemo(
    () =>
      Object.keys(props.data).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' }),
      ),
    [props.data],
  )

  const visibleKeys = keys.filter((key) =>
    key.toLowerCase().includes(filter.trim().toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter fields..."
          className="w-full rounded-lg border border-line bg-panel2 py-2 pl-9 pr-3 font-mono text-sm text-paper outline-none placeholder:text-mist/60 focus:border-signal"
        />
      </div>

      {visibleKeys.length === 0 ? (
        <p className="py-8 text-center font-mono text-sm text-mist">
          No fields match &quot;{filter}&quot;
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleKeys.map((key) => {
            const dataObj = props.data[key] as DataObject
            const isObjectValue =
              typeof dataObj.value === 'object' && dataObj.value !== null

            let inputElement
            if (isObjectValue) {
              const preview = JSON.stringify(dataObj.value)
              inputElement = (
                <p
                  className="truncate font-mono text-xs text-mist/80"
                  title={preview}
                >
                  {preview}
                </p>
              )
            } else {
              switch (dataObj.__type) {
                case 'int':
                  inputElement = (
                    <input
                      type="number"
                      id={key}
                      defaultValue={dataObj.value}
                      className="w-full rounded-md border border-line bg-void px-2.5 py-1.5 font-mono text-sm text-paper outline-none focus:border-signal"
                      onChange={(e) => {
                        props.data[key].value = parseInt(e.target.value)
                      }}
                    />
                  )
                  break
                case 'float':
                  inputElement = (
                    <input
                      type="number"
                      step="any"
                      id={key}
                      defaultValue={dataObj.value}
                      className="w-full rounded-md border border-line bg-void px-2.5 py-1.5 font-mono text-sm text-paper outline-none focus:border-signal"
                      onChange={(e) => {
                        props.data[key].value = parseFloat(e.target.value)
                      }}
                    />
                  )
                  break
                case 'bool':
                  inputElement = (
                    <ToggleSwitch
                      id={key}
                      checked={Boolean(dataObj.value)}
                      onChange={(next) => {
                        props.data[key].value = next
                        forceRender((n) => n + 1)
                      }}
                    />
                  )
                  break
                default:
                  inputElement = (
                    <input
                      type="text"
                      id={key}
                      defaultValue={dataObj.value}
                      className="w-full rounded-md border border-line bg-void px-2.5 py-1.5 font-mono text-sm text-paper outline-none focus:border-signal"
                      onChange={(e) => {
                        props.data[key].value = e.target.value
                      }}
                    />
                  )
                  break
              }
            }

            return (
              <div
                key={key}
                className={`flex flex-col gap-2 rounded-lg border p-3 ${
                  isObjectValue
                    ? 'border-dashed border-line/70 bg-panel2/40'
                    : 'border-line bg-panel2'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={key}
                    className="truncate font-mono text-[11px] uppercase tracking-wide text-mist"
                    title={key}
                  >
                    {key}
                  </label>
                  {isObjectValue && (
                    <span className="shrink-0 rounded-full bg-line/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-mist">
                      Read-only
                    </span>
                  )}
                </div>
                {inputElement}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Editor
