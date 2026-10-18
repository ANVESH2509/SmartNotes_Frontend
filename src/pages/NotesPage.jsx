import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BookOpen, FilePlus2, Sparkles } from 'lucide-react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import api, { getApiError } from '../api/client.js'
import LoadingState from '../components/LoadingState.jsx'
import NoteCard from '../components/NoteCard.jsx'
import { normalizeNotes, noteSubject } from '../utils/notes.js'

export default function NotesPage() {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const query = params.get('q') || ''
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [subject, setSubject] = useState('All subjects')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    api.get('/api/notes', { params: query.trim() ? { q: query.trim() } : undefined })
      .then(({ data }) => {
        if (active) setNotes(normalizeNotes(data))
      })
      .catch((requestError) => {
        if (active) setError(getApiError(requestError))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [query, reload])

  const subjects = useMemo(() => ['All subjects', ...new Set(notes.map(noteSubject).filter((item) => item !== 'General'))], [notes])
  const visibleNotes = subject === 'All subjects' ? notes : notes.filter((note) => noteSubject(note) === subject)

  function chooseSubject(item) {
    setSubject(item)
    if (item !== 'All subjects') {
      document.getElementById('notes-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="discover-page">
      <section className="welcome-banner">
        <div className="welcome-copy">
          <div className="eyebrow"><Sparkles size={14} /> YOUR CAMPUS, IN SYNC</div>
          <h1>Good ideas are<br /><span>better shared.</span></h1>
          <p>Find the notes that make everything click.</p>
          <Link to="/app/upload" className="button button-light"><FilePlus2 size={17} /> Share your notes <ArrowRight size={16} /></Link>
        </div>
        <div className="banner-illustration" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="floating-note floating-note-back"><span /><span /><span /></div>
          <div className="floating-note floating-note-front"><span className="note-sparkle">✦</span><span /><span /><span /></div>
          <span className="banner-star banner-star-one">✦</span><span className="banner-star banner-star-two">✧</span>
        </div>
        <div className="banner-footnote"><span /> A little progress, every day</div>
      </section>

      {location.state?.notice && <div className="success-message library-notice" role="status">{location.state.notice}</div>}
      <div className="section-heading">
        <div>
          <div className="eyebrow eyebrow-soft"><BookOpen size={14} /> COMMUNITY LIBRARY</div>
          <h2>{query ? `Results for “${query}”` : 'Find your next breakthrough'}</h2>
          <p>Thoughtfully shared resources from students like you.</p>
        </div>
        <Link className="text-link" to="/app/upload">Contribute a note <ArrowRight size={16} /></Link>
      </div>

      <div className="subject-filters" role="group" aria-label="Filter notes by subject">
        {subjects.map((item) => (
          <button key={item} className={`filter-chip${subject === item ? ' selected' : ''}`} onClick={() => chooseSubject(item)} aria-pressed={subject === item}>{item}</button>
        ))}
      </div>

      {loading ? <LoadingState /> : error ? (
        <div className="message-panel error-panel" role="alert"><span className="message-icon">!</span><h3>We couldn’t load the library</h3><p>{error}</p><button className="button button-outline" onClick={() => setReload((current) => current + 1)}>Try again</button></div>
      ) : visibleNotes.length ? (
        <div className="notes-grid" id="notes-grid">
          {visibleNotes.map((note, index) => <NoteCard note={note} index={index} key={note.id ?? `${note.title}-${index}`} />)}
        </div>
      ) : (
        <div className="message-panel empty-panel">
          <span className="empty-illustration"><BookOpen size={28} /></span>
          <h3>{query || subject !== 'All subjects' ? 'No notes found just yet' : 'The library is ready for its first page'}</h3>
          <p>{query ? 'Try a different search, or clear your filters to explore all notes.' : subject !== 'All subjects' ? 'Try another subject or browse the full library.' : 'Be the first to share a resource with your campus community.'}</p>
          <div className="empty-actions">
            {(query || subject !== 'All subjects') && <button className="button button-outline" onClick={() => { setParams({}); setSubject('All subjects') }}>Clear filters</button>}
            <Link className="button button-primary" to="/app/upload"><FilePlus2 size={16} /> Share a note</Link>
          </div>
        </div>
      )}
    </div>
  )
}
