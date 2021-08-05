// returns newest first
export function sortByCreatedAt(a: { createdAt: number }, b: { createdAt: number }) {
  return b.createdAt - a.createdAt;
}
