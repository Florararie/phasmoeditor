'use client'

import { setIn } from '../../lib/pathUtils'
import { NumberField, ToggleSwitch, humanizeKey } from './shared'

interface DataObject {
  __type: string
  value: any
}

type SaveData = { [key: string]: DataObject }

interface CommonTabProps {
  data: SaveData
  onChange: (next: SaveData) => void
}

const TIER_SUFFIXES = [
  { suffix: 'TierOneUnlockOwned', label: 'Tier One Unlocks' },
  { suffix: 'TierTwoUnlockOwned', label: 'Tier Two Unlocks' },
  { suffix: 'TierThreeUnlockOwned', label: 'Tier Three Unlocks' },
] as const

const BONE_COUNT = 13 // Bone0 - Bone12

function Section({
  title,
  description,
  children,
  action,
}: {
  title: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-line bg-panel2 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-sm font-semibold text-paper">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-mist">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-wide text-mist">{label}</span>
      {children}
    </label>
  )
}

function TierGroup({
  suffix,
  label,
  data,
  onToggle,
  action,
}: {
  suffix: string
  label: string
  data: SaveData
  onToggle: (key: string, value: boolean) => void
  action?: React.ReactNode
}) {
  const keys = Object.keys(data)
    .filter((k) => k.endsWith(suffix))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

  if (keys.length === 0) return null

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h4 className="font-mono text-[11px] uppercase tracking-wide text-mist">{label}</h4>
        {action}
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {keys.map((key) => (
          <div
            key={key}
            className="flex items-center justify-between gap-2 rounded-md border border-line bg-void px-3 py-2"
          >
            <span className="truncate text-sm text-paper" title={key}>
              {humanizeKey(key.slice(0, -suffix.length))}
            </span>
            <ToggleSwitch
              checked={Boolean(data[key].value)}
              onChange={(next) => onToggle(key, next)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const CommonTab = ({ data, onChange }: CommonTabProps) => {
  const boneKeys = Array.from({ length: BONE_COUNT }, (_, i) => `Bone${i}`).filter(
    (k) => k in data,
  )

  const setField = (key: string, value: any) => {
    onChange(setIn(data, [key, 'value'], value))
  }

  const setPrestige = (value: number) => {
    let next = setIn(data, ['Prestige', 'value'], value)
    if ('PrestigeIndex' in data) {
      next = setIn(next, ['PrestigeIndex', 'value'], value)
    }
    onChange(next)
  }

  const setAllBones = (value: number) => {
    let next = data
    for (const key of boneKeys) {
      next = setIn(next, [key, 'value'], value)
    }
    onChange(next)
  }

  const setAllTierThree = () => {
    let next = data
    for (const key of Object.keys(data)) {
      if (key.endsWith('TierThreeUnlockOwned')) {
        next = setIn(next, [key, 'value'], true)
      }
    }
    onChange(next)
  }

  const hasAnyTiers = TIER_SUFFIXES.some(({ suffix }) =>
    Object.keys(data).some((k) => k.endsWith(suffix)),
  )

  return (
    <div className="flex flex-col gap-4">
      <Section title="Player" description="Core stats shown on your profile.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          {'PlayersMoney' in data && (
            <Field label="Money">
              <NumberField value={data.PlayersMoney.value} onCommit={(v) => setField('PlayersMoney', v)} />
            </Field>
          )}
          {'NewLevel' in data && (
            <Field label="Level">
              <NumberField value={data.NewLevel.value} onCommit={(v) => setField('NewLevel', v)} />
            </Field>
          )}
          {'Experience' in data && (
            <Field label="Experience">
              <NumberField
                value={data.Experience.value}
                float={data.Experience.__type === 'float'}
                onCommit={(v) => setField('Experience', v)}
              />
            </Field>
          )}
          {'Prestige' in data && (
            <Field label="Prestige">
              <NumberField value={data.Prestige.value} onCommit={setPrestige} />
            </Field>
          )}
        </div>
      </Section>

      {hasAnyTiers && (
        <Section
          title="Equipment Unlocks"
          description="Toggle on to unlock that tier of the item automatically."
          action={
            <button
              type="button"
              onClick={setAllTierThree}
              className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-paper hover:border-signal hover:text-signal"
            >
              Unlock all Tier Three
            </button>
          }
        >
          <div className="flex flex-col gap-4">
            {TIER_SUFFIXES.map(({ suffix, label }) => (
              <TierGroup key={suffix} suffix={suffix} label={label} data={data} onToggle={setField} />
            ))}
          </div>
        </Section>
      )}

      {boneKeys.length > 0 && (
        <Section
          title="Ghost Bones"
          description="Set an entry to 3 to make that bone appear in the cabinet in the main lobby."
          action={
            <button
              type="button"
              onClick={() => setAllBones(3)}
              className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-paper hover:border-signal hover:text-signal"
            >
              Mark all found
            </button>
          }
        >
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
            {boneKeys.map((key) => (
              <Field key={key} label={key}>
                <NumberField value={data[key].value} onCommit={(v) => setField(key, v)} />
              </Field>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

export default CommonTab
