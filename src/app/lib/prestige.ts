/**
 * `Prestige` is only present in the save file once a player has prestiged
 * at least once in-game. The editor always wants it available (so the
 * Common tab has something to show/edit), so on load we add it - along
 * with the `PrestigeIndex` field the game keeps in sync with it - if it's
 * missing, defaulting both to 0 (which has no effect in-game). If
 * `Prestige` already exists, this leaves the data untouched.
 */
export function ensurePrestigeFields(data: {
  [key: string]: any
}): { [key: string]: any } {
  if ('Prestige' in data && 'PrestigeIndex' in data) return data

  const next = { ...data }
  if (!('Prestige' in next)) {
    next.Prestige = { __type: 'int', value: 0 }
  }
  if (!('PrestigeIndex' in next)) {
    next.PrestigeIndex = { __type: 'int', value: next.Prestige.value }
  }
  return next
}
