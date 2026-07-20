'use client'

import { useState } from 'react'
import CommonTab from './editor/CommonTab'
import TreeTab from './editor/TreeTab'
import RawTab from './editor/RawTab'

interface EditorProps {
  data: { [key: string]: { __type: string; value: any } }
  onChange: (next: any) => void
}

const TABS = [
  { id: 'common', label: 'Common' },
  { id: 'tree', label: 'Tree' },
  { id: 'raw', label: 'Raw JSON' },
] as const

type TabId = (typeof TABS)[number]['id']

const Editor = ({ data, onChange }: EditorProps) => {
  const [tab, setTab] = useState<TabId>('common')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 rounded-lg border border-line bg-panel2 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              tab === t.id ? 'bg-signal text-void' : 'text-mist hover:text-paper'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'common' && <CommonTab data={data} onChange={onChange} />}
      {tab === 'tree' && <TreeTab data={data} onChange={onChange} />}
      {tab === 'raw' && <RawTab data={data} onChange={onChange} />}
    </div>
  )
}

export default Editor
