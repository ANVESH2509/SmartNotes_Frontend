import { useEffect, useState } from 'react'
import { ArrowDownToLine, ArrowLeft, CalendarDays, FileText, UserRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import api, { getApiError } from '../api/client.js'
import LoadingState from '../components/LoadingState.jsx'
import { noteDate, noteSubject, noteUploader } from '../utils/notes.js'
import { downloadNotePdf } from '../utils/download.js'

export default function NoteDetailsPage() {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloadError, setDownloadError] = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    api.get(`/api/notes/${encodeURIComponent(id)}`)
      .then(({ data }) => { if (active) setNote(data) })
      .catch((requestError) => { if (active) setError(getApiError(requestError)) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  async function download() {
    setDownloadError('')
    setDownloading(true)
    try {
      await downloadNotePdf(note)
    } catch (requestError) {
      setDownloadError(getApiError(requestError))
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return <LoadingState label="Loading note" />
  if (error) return <div className="message-panel error-panel" role="alert"><h3>Couldn’t open this note</h3><p>{error}</p><Link to="/app" className="button button-outline">Back to discover</Link></div>
  if (!note || typeof note !== 'object') return <div className="message-panel empty-panel"><h3>Note not found</h3><p>This resource may have been removed or is no longer available.</p><Link to="/app" className="button button-outline">Back to discover</Link></div>

  return (
    <div className="detail-page">
      <Link to="/app" className="back-link"><ArrowLeft size={16} /> Back to discover</Link>
      <div className="detail-layout">
        <div className="detail-main">
          <span className="subject-tag">{noteSubject(note)}</span>
          <h1>{note.title || 'Untitled notes'}</h1>
          <p className="detail-description">{note.description || 'No description was provided for this resource.'}</p>
          <div className="detail-byline">
            <span className="uploader-avatar large">{noteUploader(note).charAt(0).toUpperCase()}</span>
            <span><small>Shared by</small><strong>{noteUploader(note)}</strong></span>
            {noteDate(note) && <span className="detail-date"><CalendarDays size={15} /> {noteDate(note)}</span>}
          </div>
          <div className="detail-preview">
            <div className="pdf-preview-icon"><FileText size={35} /></div>
            <div><strong>PDF study resource</strong><span>Download this resource to read and annotate it.</span></div>
            <button className="button button-primary detail-download" onClick={download} disabled={downloading}><ArrowDownToLine size={15} />{downloading ? 'Preparing…' : 'Download PDF'}</button>
          </div>
          {downloadError && <p className="inline-error detail-download-error" role="alert">{downloadError}</p>}
        </div>
        <aside className="detail-aside">
          <span className="detail-aside-icon"><UserRound size={19} /></span>
          <h3>Shared by students, for students.</h3>
          <p>StudyShelf is better when everyone contributes. Have notes of your own? Pass them along.</p>
          <Link to="/app/upload" className="button button-primary">Share your notes <ArrowDownToLine size={15} /></Link>
        </aside>
      </div>
    </div>
  )
}
