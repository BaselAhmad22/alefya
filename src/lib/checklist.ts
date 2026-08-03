/** Stable checklist key from item label text (browser + server safe) */
export function checklistItemKey(text: string) {
  const normalized = text.toLowerCase().replace(/\s+/g, " ").trim();
  let hash = 2166136261;
  for (let i = 0; i < normalized.length; i++) {
    hash ^= normalized.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
