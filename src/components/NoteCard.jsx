import { ArrowDownToLine, ArrowUpRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { noteDate, noteSubject, noteUploader } from '../utils/notes.js'
import { downloadNotePdf } from '../utils/download.js'
import { getApiError } from '../api/client.js'
import { useState } from 'react'

const palettes = [
  ['lavender', '✳'],
  ['mint', '∿'],
  ['peach', '◌'],
  ['blue', '⌁'],
]

export default function NoteCard({ note, index = 0 }) {
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [tone, motif] = palettes[index % palettes.length]

  async function download(event) {
    event.preventDefault()
    event.stopPropagation()
    setError('')
    setDownloading(true)
    try {
      await downloadNotePdf(note)
    } catch (downloadError) {
      setError(getApiError(downloadError))
    } finally {
      setDownloading(false)
    }
  }

  return (
    <article className="note-card">
      <div className={`note-cover ${tone}`}>
        <span className="cover-kicker"><FileText size={13} /> STUDY RESOURCE</span>
        <span className="cover-motif" aria-hidden="true">{motif}</span>
        <span className="cover-subject">{noteSubject(note)}</span>
      </div>
      <div className="note-card-body">
        <div className="note-card-heading">
          <span className="subject-tag">{noteSubject(note)}</span>
          <Link className="card-open" to={`/notes/${note.id}`} aria-label={`View ${note.title || 'note'}`}><ArrowUpRight size={17} /></Link>
        </div>
        <Link to={`/notes/${note.id}`} className="note-title-link"><h3>{note.title || 'Untitled notes'}</h3></Link>
        <p className="note-description">{note.description || 'A set of notes shared with the study community.'}</p>
        <div className="note-meta">
          <span className="uploader-avatar">{noteUploader(note).charAt(0).toUpperCase()}</span>
          <span className="uploader-name">{noteUploader(note)}</span>
          {noteDate(note) && <><span className="meta-dot" /><time>{noteDate(note)}</time></>}
        </div>
        <div className="note-card-footer">
          <span className="file-type"><FileText size={14} /> PDF document</span>
          <button className="download-button" onClick={download} disabled={downloading} aria-label={`Download ${note.title || 'note'} PDF`}>
            <ArrowDownToLine size={15} /> {downloading ? 'Preparing…' : 'Download'}
          </button>
        </div>
        {error && <p className="inline-error" role="alert">{error}</p>}
      </div>
    </article>
  )
}
