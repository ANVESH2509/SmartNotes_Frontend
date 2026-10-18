import { useState } from 'react'
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpenCheck,
  Bookmark,
  Check,
  ChevronDown,
  Compass,
  FileText,
  GraduationCap,
  Menu,
  Share2,
  Sparkles,
  UploadCloud,
  UsersRound,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand.jsx'

const features = [
  {
    icon: Compass,
    title: 'Find your subject',
    text: 'Explore resources by the classes and topics you care about. Spend less time searching, more time learning.',
    color: 'violet',
  },
  {
    icon: Share2,
    title: 'Learn from each other',
    text: 'Turn your class notes into a helping hand for another student. Good work deserves to travel.',
    color: 'peach',
  },
  {
    icon: ArrowDownToLine,
    title: 'Take it with you',
    text: 'Download shared PDFs when you are ready to study offline, annotate, or make them your own.',
    color: 'mint',
  },
  {
    icon: Bookmark,
    title: 'A library built for students',
    text: 'A focused space for useful study materials, contributed by people who know the course.',
    color: 'blue',
  },
]

const steps = [
  { number: '01', icon: GraduationCap, title: 'Join your study circle', text: 'Create your free account and step into a student-powered learning community.' },
  { number: '02', icon: Compass, title: 'Discover what you need', text: 'Search the library and browse resources by subject to find a helpful new perspective.' },
  { number: '03', icon: UploadCloud, title: 'Share the good stuff', text: 'Upload a PDF of your own notes and help the next student get one step further.' },
]

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <main className="landing-page">
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <Brand />
          <button className="landing-menu-button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <nav className={`landing-links${menuOpen ? ' landing-links-open' : ''}`} aria-label="Main navigation">
            <a href="#features" onClick={closeMenu}>Why StudyShelf</a>
            <a href="#how-it-works" onClick={closeMenu}>How it works</a>
            <Link to="/login" className="landing-nav-signin" onClick={closeMenu}>Sign in</Link>
            <Link to="/register" className="button button-primary landing-nav-cta" onClick={closeMenu}>Get started <ArrowRight size={15} /></Link>
          </nav>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-glow" aria-hidden="true" />
        <div className="landing-hero-inner">
          <div className="landing-hero-copy">
            <div className="landing-eyebrow"><span className="eyebrow-spark"><Sparkles size={13} /></span> THE STUDENT-POWERED STUDY SPACE</div>
            <h1>Make learning<br />a <span>shared thing.</span></h1>
            <p>StudyShelf brings student-made notes and useful course resources together, so finding your next study breakthrough feels a little easier.</p>
            <div className="landing-hero-actions">
              <Link to="/register" className="button button-primary landing-primary-cta">Get started <ArrowRight size={17} /></Link>
              <Link to="/login" className="landing-secondary-cta">Sign in <span><ArrowRight size={15} /></span></Link>
            </div>
            <div className="hero-trust"><span className="trust-avatars"><i>✦</i><i>✳</i><i>⌁</i></span><span>Better notes. Brighter study sessions.</span></div>
          </div>

          <div className="landing-visual" aria-label="Illustration of a subject-focused study resources workspace">
            <div className="visual-orbit visual-orbit-a" />
            <div className="visual-orbit visual-orbit-b" />
            <div className="visual-spark visual-spark-a">✦</div>
            <div className="visual-spark visual-spark-b">✧</div>
            <div className="visual-window">
              <div className="visual-window-bar"><span /><span /><span /><div className="visual-bar-title">your study space</div></div>
              <div className="visual-window-content">
                <div className="visual-welcome"><span>YOUR NEXT STUDY SESSION</span><strong>Start with a little curiosity.</strong></div>
                <div className="visual-search"><Compass size={14} /><span>Explore by subject</span><ChevronDown size={13} /></div>
                <div className="visual-subjects"><i>Biology</i><i>History</i><i>Physics</i></div>
                <div className="visual-resource-label"><span>STUDENT-SHARED RESOURCES</span><span>•••</span></div>
                <div className="visual-resource-row">
                  <div className="visual-resource visual-resource-purple"><FileText size={18} /><span /><i /></div>
                  <div className="visual-resource visual-resource-orange"><BookOpenCheck size={18} /><span /><i /></div>
                  <div className="visual-resource visual-resource-green"><Bookmark size={18} /><span /><i /></div>
                </div>
              </div>
            </div>
            <div className="visual-note visual-note-share"><span className="visual-float-icon"><Share2 size={16} /></span><span><b>Share what you know</b><small>Make someone’s day</small></span><Check size={15} /></div>
            <div className="visual-note visual-note-download"><span className="visual-download-icon"><ArrowDownToLine size={17} /></span><span><b>Ready when you are</b><small>PDF resources</small></span></div>
          </div>
        </div>
        <div className="hero-bottom-rule"><span>LEARN TOGETHER, GO FURTHER</span><span /></div>
      </section>

      <section className="landing-intro" aria-label="About StudyShelf">
        <div className="landing-intro-mark"><BookOpenCheck size={21} /></div>
        <p>StudyShelf is a shared study library for college life — made for students who want to <strong>find helpful materials, learn from their peers, and pass their own knowledge forward.</strong></p>
        <span className="intro-decoration" aria-hidden="true">✳</span>
      </section>

      <section className="landing-features section-wrap" id="features">
        <div className="section-overline"><span /> A BETTER WAY TO STUDY <span /></div>
        <div className="landing-section-heading">
          <div><h2>Good resources.<br /><span>Right when you need them.</span></h2></div>
          <p>Less digging through old chats. More learning together. StudyShelf helps make sharing and finding study materials feel natural.</p>
        </div>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, text, color }, index) => (
            <article className={`feature-card feature-${color}`} key={title} style={{ '--card-index': index }}>
              <span className="feature-icon"><Icon size={20} strokeWidth={1.9} /></span>
              <span className="feature-index">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="feature-line" />
            </article>
          ))}
        </div>
      </section>

      <section className="landing-how" id="how-it-works">
        <div className="section-wrap how-inner">
          <div className="how-heading">
            <div className="section-overline section-overline-light"><span /> SIMPLE BY DESIGN <span /></div>
            <h2>From “I’m stuck”<br />to <span>“I’ve got this.”</span></h2>
            <p>Great study habits don’t have to happen alone. Start with the community and take it one useful resource at a time.</p>
            <Link to="/register" className="how-cta">Join StudyShelf <ArrowRight size={16} /></Link>
          </div>
          <div className="how-steps">
            {steps.map(({ number, icon: Icon, title, text }) => (
              <article className="how-step" key={number}>
                <span className="step-number">{number}</span>
                <span className="step-icon"><Icon size={18} /></span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
          <div className="how-decoration" aria-hidden="true"><span /><span /><span /></div>
        </div>
      </section>

      <section className="landing-final-cta">
        <div className="final-cta-decoration" aria-hidden="true"><span>✦</span><span>✳</span></div>
        <div className="final-cta-copy"><span className="landing-eyebrow"><span className="eyebrow-spark"><Sparkles size={13} /></span> YOUR NEXT STUDY SESSION STARTS HERE</span><h2>There’s room for you<br />on the study team.</h2><p>Join students sharing what they know — and discovering what’s next.</p></div>
        <Link to="/register" className="button button-primary final-cta-button">Get started for free <ArrowRight size={17} /></Link>
      </section>

      <footer className="landing-footer">
        <div className="footer-main">
          <div className="footer-brand-block"><Brand /><p>A student-powered home for sharing what you know and finding what helps.</p></div>
          <div className="footer-links-group"><strong>Explore</strong><a href="#features">Why StudyShelf</a><a href="#how-it-works">How it works</a></div>
          <div className="footer-links-group"><strong>Your account</strong><Link to="/login">Sign in</Link><Link to="/register">Get started</Link></div>
          <div className="footer-note"><span className="footer-note-icon"><UsersRound size={16} /></span><p>Good notes travel.<br /><strong>Pass something on.</strong></p></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} StudyShelf</span><span>Made for the curious, by the curious.</span><Link to="/register">Start learning together <ArrowRight size={13} /></Link></div>
      </footer>
    </main>
  )
}
