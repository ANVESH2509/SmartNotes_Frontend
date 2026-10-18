export function normalizeNotes(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.content)) return payload.content
  if (Array.isArray(payload?.notes)) return payload.notes
  throw new Error('The notes service returned data in an unexpected format.')
}

export function noteUploader(note) {
  const uploader = note.uploader || note.uploadedBy || note.user || note.author
  if (typeof uploader === 'string') return uploader
  return uploader?.name || uploader?.fullName || uploader?.username || uploader?.email || 'Student contributor'
}

export function noteDate(note) {
  const value = note.uploadDate || note.uploadedAt || note.createdAt || note.date
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? String(value)
    : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export function noteSubject(note) {
  return note.subject || note.category || 'General'
}
