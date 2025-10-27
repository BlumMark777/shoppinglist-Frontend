export async function fetchTobuys() {
  const res = await fetch('/tobuys')
  if (!res.ok) throw new Error('Fehler beim Laden der Daten')
  return await res.json()
}

