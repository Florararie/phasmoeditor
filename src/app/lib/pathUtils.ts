/**
 * Small helpers for reading/writing a value at an arbitrary path inside a
 * plain JS object/array tree without mutating the original - each editor
 * tab (Common fields, Tree, Raw JSON) shares the same save-data object, so
 * edits always go through setIn to produce a new root object and trigger a
 * React re-render everywhere that root is used.
 */

export type PathSegment = string | number

export function getIn(obj: any, path: PathSegment[]): any {
  let cur = obj
  for (const key of path) {
    if (cur == null) return undefined
    cur = cur[key as any]
  }
  return cur
}

export function setIn(obj: any, path: PathSegment[], value: any): any {
  if (path.length === 0) return value
  const [head, ...rest] = path

  if (Array.isArray(obj)) {
    const copy = obj.slice()
    copy[head as number] = setIn(obj[head as number], rest, value)
    return copy
  }

  const copy = { ...(obj ?? {}) }
  copy[head as string] = setIn(obj ? obj[head as any] : undefined, rest, value)
  return copy
}
