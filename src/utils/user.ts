const MAX_SLUG_LENGTH = 40

/** Trims the name and collapses inner whitespace, so "  Jane   Doe " becomes "Jane Doe". */
export function normalizeName(name: string): string {
  return name.normalize('NFKC').trim().replace(/\s+/g, ' ')
}

/**
 * Builds the id sent as the X-User-Id header from a normalized name.
 *
 * Names that differ only in case or spacing map to the same id on purpose, so
 * "Jane Doe" and "jane  doe" open the same feed. The hash keeps ids unique for
 * names whose readable part is the same or empty (non-Latin names), and the
 * result is always short, ASCII-only and safe to put in a header.
 */
export function toUserId(normalizedName: string): string {
  const key = normalizedName.toLowerCase()
  const slug = key
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH)
  const hash = fnv1a64(key)
  return slug ? `${slug}-${hash}` : hash
}

function fnv1a64(text: string): string {
  let hash = 0xcbf29ce484222325n
  for (const byte of new TextEncoder().encode(text)) {
    hash ^= BigInt(byte)
    hash = (hash * 0x100000001b3n) & 0xffffffffffffffffn
  }
  return hash.toString(16).padStart(16, '0')
}
