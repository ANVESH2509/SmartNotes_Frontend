import { useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpenCheck, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import api, { getApiError } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import Brand from '../components/Brand.jsx'

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register'
  const { token, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (token) return <Navigate to="/app" replace />

  function changeField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Enter a valid email address.')
      return
    }
    if (form.password.length < 8) {
      setError('Your password must be at least 8 characters.')
      return
    }
    if (isRegister && !form.fullName.trim()) {
      setError('Enter your name to create an account.')
      return
    }
    if (isRegister && form.password !== form.confirmPassword) {
      setError('Those passwords don’t match.')
      return
    }
    setLoading(true)
    try {
      if (isRegister) {
        await api.post('/api/auth/register', {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
        })
        navigate('/login', { replace: true, state: { message: 'Account created. Sign in to start exploring.' } })
      } else {
        await login({ email: form.email.trim(), password: form.password })
        const requestedPath = location.state?.from
        const destination = typeof requestedPath === 'string'
          ? requestedPath
          : `${requestedPath?.pathname || ''}${requestedPath?.search || ''}${requestedPath?.hash || ''}`
        navigate(destination.startsWith('/app') ? destination : '/app', { replace: true })
      }
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-top"><Brand /><Link className="auth-back" to="/"><ArrowLeft size={15} /> Back to StudyShelf</Link></div>
      <div className="auth-layout">
        <section className="auth-panel">
          <div className="auth-heading">
            <span className="auth-icon"><BookOpenCheck size={22} /></span>
            <span className="eyebrow eyebrow-soft">{isRegister ? 'JOIN THE STUDY CIRCLE' : 'WELCOME BACK'}</span>
            <h1>{isRegister ? <>Make room for<br /><span>better learning.</span></> : <>Good to have<br /><span>you back.</span></>}</h1>
            <p>{isRegister ? 'Create an account and make your study resources go further.' : 'Sign in to pick up where your curiosity left off.'}</p>
          </div>
          <form className="auth-form" onSubmit={submit} noValidate>
            {location.state?.message && !isRegister && <div className="success-message" role="status">{location.state.message}</div>}
            {location.state?.sessionExpired && !isRegister && <div className="session-message" role="status">Your session expired. Sign in again to continue.</div>}
            {isRegister && <label className="auth-field"><span>Full name</span><span className="auth-input"><UserRound size={17} /><input name="fullName" value={form.fullName} onChange={changeField} placeholder="Jamie Taylor" autoComplete="name" maxLength={100} required /></span></label>}
            <label className="auth-field"><span>Email address</span><span className="auth-input"><Mail size={17} /><input name="email" type="email" value={form.email} onChange={changeField} placeholder="you@university.edu" autoComplete="email" required /></span></label>
            <label className="auth-field"><span>Password</span><span className="auth-input"><LockKeyhole size={17} /><input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={changeField} placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'} autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={8} /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
            {isRegister && <label className="auth-field"><span>Confirm password</span><span className="auth-input"><LockKeyhole size={17} /><input name="confirmPassword" type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={changeField} placeholder="Enter your password again" autoComplete="new-password" required /></span></label>}
            {error && <div className="form-error" role="alert"><span>!</span>{error}</div>}
            <button type="submit" className="button button-primary auth-submit" disabled={loading}>{loading ? <><span className="button-spinner" /> {isRegister ? 'Creating account…' : 'Signing in…'}</> : <>{isRegister ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></>}</button>
          </form>
          <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to StudyShelf?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p>
          <p className="auth-legal">By continuing, you agree to use shared materials responsibly.</p>
        </section>
        <aside className="auth-art">
          <div className="auth-art-orbit" /><div className="auth-book-stack"><span /><span /><span /><span /></div>
          <div className="auth-quote"><span className="quote-mark">“</span><p>Learning isn’t a solo act. Find your people, share what you know, and make the hard stuff feel a little lighter.</p><span className="quote-author">THE STUDYSHELF COMMUNITY</span></div>
          <div className="auth-art-footer"><span>01</span><span className="art-line" /><span>GOOD NOTES. GOOD PEOPLE.</span></div>
        </aside>
      </div>
    </div>
  )
}
