import { useEffect, useRef, useState } from 'react'
import { BookOpen, ChevronDown, CircleHelp, Compass, FilePlus2, LogOut, Menu, Search, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Brand from './Brand.jsx'

function displayName(user) {
  return user?.name || user?.fullName || user?.username || user?.email?.split('@')[0] || 'Student'
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const searchInputRef = useRef(null)
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '')
  const name = displayName(user)
  const initials = name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  useEffect(() => {
    setSearchValue(searchParams.get('q') || '')
  }, [searchParams])

  function submitSearch(event) {
    event.preventDefault()
    const query = searchValue.trim()
    navigate(query ? `/app?q=${encodeURIComponent(query)}` : '/app')
    setMenuOpen(false)
    setSearchOpen(false)
  }

  function openSearch() {
    setSearchOpen(true)
    requestAnimationFrame(() => searchInputRef.current?.focus())
  }

  function signOut() {
    logout()
    setProfileOpen(false)
    navigate('/login', { replace: true })
  }

  const onBrowse = location.pathname === '/app' || location.pathname.startsWith('/app/notes/')

  return (
    <div className="app-shell">
      <aside className={`sidebar${menuOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-brand"><Brand to="/app" /></div>
        <div className="nav-caption">Workspace</div>
        <nav className="side-nav" aria-label="Main navigation">
          <NavLink to="/app" end className={() => `side-link${onBrowse ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>
            <Compass size={18} /><span>Discover notes</span>
          </NavLink>
          <NavLink to="/app/upload" className={({ isActive }) => `side-link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>
            <FilePlus2 size={18} /><span>Share your notes</span>
          </NavLink>
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-tip">
          <span className="tip-icon"><BookOpen size={17} /></span>
          <strong>Knowledge grows when shared.</strong>
          <span>Help someone ace their next class.</span>
          <Link to="/app/upload" onClick={() => setMenuOpen(false)}>Upload a resource <span aria-hidden="true">↗</span></Link>
        </div>
        <a className="side-help" href="mailto:support@studyshelf.example"><CircleHelp size={17} /> Help & feedback</a>
        <div className="sidebar-footer">
          <span className="avatar avatar-small">{initials}</span>
          <span className="user-details"><strong>{name}</strong><small>{user?.email || (user ? 'Student account' : 'Guest explorer')}</small></span>
          {user && <button className="icon-button logout-button" title="Log out" aria-label="Log out" onClick={signOut}><LogOut size={17} /></button>}
        </div>
      </aside>

      {menuOpen && <button aria-label="Close navigation" className="mobile-scrim" onClick={() => setMenuOpen(false)} />}
      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-divider">/</span><strong>{onBrowse ? 'Discover' : location.pathname === '/upload' ? 'Share notes' : 'Account'}</strong></div>
          <form className={`top-search${searchOpen ? ' search-open' : ''}`} onSubmit={submitSearch} onKeyDown={(event) => { if (event.key === 'Escape') setSearchOpen(false) }} role="search">
            <button type="button" className="search-trigger" aria-label="Search notes" onClick={openSearch}><Search size={17} aria-hidden="true" /></button>
            <label className="sr-only" htmlFor="global-search">Search notes</label>
            <input ref={searchInputRef} id="global-search" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search notes, subjects..." />
            <kbd>↵</kbd>
          </form>
          <div className="topbar-actions">
            {user ? (
              <div className="profile-wrap">
                <button className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen} aria-label="Open account menu">
                  <span className="avatar">{initials}</span><ChevronDown size={15} />
                </button>
                {profileOpen && <div className="profile-menu"><span className="profile-menu-name">{name}</span><button onClick={signOut}><LogOut size={15} /> Log out</button></div>}
              </div>
            ) : (
              <Link to="/login" className="button button-primary button-small">Sign in</Link>
            )}
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  )
}
