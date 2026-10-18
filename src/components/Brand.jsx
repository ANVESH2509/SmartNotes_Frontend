import { BookOpenCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Brand({ compact = false, to = '/' }) {
  return (
    <Link className={`brand${compact ? ' brand-compact' : ''}`} to={to} aria-label="StudyShelf home">
      <span className="brand-mark"><BookOpenCheck size={21} strokeWidth={2.3} /></span>
      {!compact && <span>study<span className="brand-light">shelf</span></span>}
    </Link>
  )
}
