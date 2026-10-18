import api from '../api/client.js'

export async function downloadNotePdf(note) {
  const { data } = await api.get(`/api/notes/${encodeURIComponent(note.id)}/download`, { responseType: 'blob' })
  const objectUrl = URL.createObjectURL(data)
  const anchor = document.createElement('a')
  const safeTitle = (note.title || 'study-notes').replace(/[<>:"/\\|?*]+/g, '-').trim() || 'study-notes'
  anchor.href = objectUrl
  anchor.download = `${safeTitle}.pdf`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}
