import { useRef, useState } from 'react'
import { ArrowLeft, Check, FileUp, FileText, UploadCloud, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import api, { getApiError } from '../api/client.js'

export default function UploadPage() {
  const [form, setForm] = useState({ title: '', subject: '', description: '' })
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  function selectFile(selected) {
    setError('')
    if (!selected) return
    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF file.')
      return
    }
    setFile(selected)
  }

  function changeField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!form.title.trim() || !form.subject.trim()) {
      setError('Add a title and subject so students can find your notes.')
      return
    }
    if (!file) {
      setError('Choose a PDF file before sharing your notes.')
      return
    }
    const payload = new FormData()
    payload.append('title', form.title.trim())
    payload.append('subject', form.subject.trim())
    payload.append('description', form.description.trim())
    payload.append('file', file)
    setLoading(true)
    try {
      await api.post('/api/notes', payload)
      navigate('/app', { state: { notice: 'Your notes have been shared with the community.' } })
    } catch (uploadError) {
      setError(getApiError(uploadError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-page">
      <Link to="/app" className="back-link"><ArrowLeft size={16} /> Back to discover</Link>
      <div className="upload-heading">
        <span className="eyebrow eyebrow-soft"><FileUp size={14} /> GIVE KNOWLEDGE A SECOND LIFE</span>
        <h1>Share what you’ve learned.</h1>
        <p>Your class notes could be the thing that helps someone else finally get it.</p>
      </div>
      <form className="upload-form-card" onSubmit={submit} noValidate>
        <div className="form-section-title"><span className="section-number">01</span><div><h2>About your resource</h2><p>Help classmates find the right notes.</p></div></div>
        <div className="form-grid">
          <label className="field-wrap">Note title <span className="required">*</span>
            <input name="title" value={form.title} onChange={changeField} placeholder="e.g. Week 4 — Cell Biology" required maxLength={120} />
          </label>
          <label className="field-wrap">Subject <span className="required">*</span>
            <input name="subject" value={form.subject} onChange={changeField} placeholder="e.g. Biology" required maxLength={80} />
          </label>
          <label className="field-wrap full-field">Description
            <textarea name="description" value={form.description} onChange={changeField} placeholder="What will students learn from this resource?" rows="4" maxLength={1000} />
            <span className="field-hint">{form.description.length}/1000</span>
          </label>
        </div>
        <div className="form-divider" />
        <div className="form-section-title"><span className="section-number">02</span><div><h2>Add your PDF</h2><p>PDF format only.</p></div></div>
        <input ref={inputRef} className="sr-only" type="file" accept="application/pdf,.pdf" aria-label="Choose a PDF file" onChange={(event) => selectFile(event.target.files?.[0])} />
        {file ? (
          <div className="selected-file"><span className="selected-file-icon"><FileText size={20} /></span><span className="selected-file-info"><strong>{file.name}</strong><small>{(file.size / (1024 * 1024)).toFixed(2)} MB · PDF document</small></span><button type="button" className="icon-button" aria-label="Remove selected file" onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = '' }}><X size={17} /></button></div>
        ) : (
          <button type="button" className={`dropzone${dragging ? ' dragging' : ''}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files?.[0]) }}>
            <span className="dropzone-icon"><UploadCloud size={23} /></span><strong>Drop your PDF here, or <span>browse files</span></strong><small>PDF document</small>
          </button>
        )}
        {error && <div className="form-error" role="alert"><span>!</span>{error}</div>}
        <div className="upload-submit-row"><p><span className="privacy-dot" /> Your resource will be available to the student community.</p><button className="button button-primary" type="submit" disabled={loading}>{loading ? <><span className="button-spinner" /> Sharing…</> : <><Check size={16} /> Share notes</>}</button></div>
      </form>
      <p className="upload-footnote">Only upload materials you have permission to share.</p>
    </div>
  )
}
