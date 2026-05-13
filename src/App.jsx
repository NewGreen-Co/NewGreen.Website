/**
 * NewGreen Group – One-Page Corporate Website
 * Stack: React + Tailwind CSS v4 + Lucide React + React Router v6
 *
 * Routing:
 *   /                          → Startseite
 *   /unternehmen/:id           → Detailseite Tochtergesellschaft
 *
 * Neue Tochtergesellschaft: Objekt in src/data.js → getSubsidiaries() eintragen.
 */

import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Globe, Cpu, Zap, ArrowRight, Mail,
  ChevronDown, Shield, Layers, Users,
  ExternalLink, Menu, X, ChevronRight,
} from 'lucide-react'
import { i18n, getSubsidiaries, accentMap } from './data.js'
import SubsidiaryPage from './SubsidiaryPage.jsx'
import ImpressumPage from './ImpressumPage.jsx'
import DatenschutzPage from './DatenschutzPage.jsx'

// ─── ROUTE-EFFEKTE ────────────────────────────────────────────────────────────

function RouteEffects({ lang }) {
  const { pathname } = useLocation()
  const base = 'NewGreen Group of Companies'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })

    const companies = getSubsidiaries(lang)
    if (pathname === '/') {
      document.title = base
    } else if (pathname === '/impressum') {
      document.title = `Impressum — ${base}`
    } else if (pathname === '/datenschutz') {
      document.title = `Datenschutzerklärung — ${base}`
    } else if (pathname.startsWith('/unternehmen/')) {
      const id = pathname.split('/').pop()
      const company = companies.find((c) => c.id === id)
      document.title = company ? `${company.name} — ${base}` : base
    } else {
      document.title = base
    }
  }, [pathname, lang])

  return null
}

// ─── GEMEINSAME KOMPONENTEN ───────────────────────────────────────────────────

/** Sticky Navbar mit Sprach-Toggle und Unternehmen-Dropdown */
function Navbar({ lang, setLang }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const t = i18n[lang].nav
  const companies = getSubsidiaries(lang)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Dropdown schließen bei Klick außerhalb
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 nav-blur transition-all duration-300 ${
        scrolled ? 'bg-white/90 shadow-sm border-b border-gray-100' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/NEW.png" alt="NewGreen Group" className="h-8 w-auto object-contain" />
          <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-0.5">
            Group of Companies
          </span>
        </Link>

        {/* Desktop-Links */}
        <ul className="hidden md:flex items-center gap-8">
          {/* Über uns */}
          <li>
            <a href="/#about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 tracking-wide">
              {t.about}
            </a>
          </li>

          {/* Unternehmen-Dropdown */}
          <li ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 tracking-wide"
            >
              {t.companies}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown-Panel */}
            {dropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-2">
                  {companies.map((c) => {
                    const Icon = c.icon
                    const accent = accentMap[c.accentColor] ?? accentMap.silver
                    const logoSlot = c.logo ? (
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={c.logo} alt="" className="w-6 h-6 object-contain" />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-lg ${accent.iconBg} flex items-center justify-center shrink-0`}>
                        <Icon size={15} className={accent.iconText} />
                      </div>
                    )
                    if (c.comingSoon) {
                      return (
                        <div
                          key={c.id}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl opacity-60"
                        >
                          {logoSlot}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">{c.name}</div>
                            <div className="text-xs text-gray-400 truncate">{c.tagline}</div>
                          </div>
                          <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                            {lang === 'de' ? 'Geplant' : 'Planned'}
                          </span>
                        </div>
                      )
                    }
                    return (
                      <Link
                        key={c.id}
                        to={c.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-150 group"
                      >
                        {logoSlot}
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{c.name}</div>
                          <div className="text-xs text-gray-400 truncate">{c.tagline}</div>
                        </div>
                        <ChevronRight size={14} className="text-gray-300 ml-auto shrink-0 group-hover:text-gray-500 transition-colors" />
                      </Link>
                    )
                  })}
                </div>
                {/* Link zur Übersicht */}
                <div className="border-t border-gray-100 px-4 py-3">
                  <a
                    href="/#subsidiaries"
                    onClick={() => setDropdownOpen(false)}
                    className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {lang === 'de' ? 'Alle Unternehmen ansehen →' : 'View all companies →'}
                  </a>
                </div>
              </div>
            )}
          </li>

          <li>
            <a href="/#values" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 tracking-wide">
              {t.values}
            </a>
          </li>
          <li>
            <a href="/#contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 tracking-wide">
              {t.contact}
            </a>
          </li>
        </ul>

        {/* Rechts: Sprache + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center rounded-full border border-gray-200 overflow-hidden text-xs font-medium">
            <button
              onClick={() => setLang('de')}
              className={`px-3 py-1.5 transition-colors duration-200 ${
                lang === 'de' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              DE
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 transition-colors duration-200 ${
                lang === 'en' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              EN
            </button>
          </div>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-slate-700 transition-colors duration-300"
          >
            {t.cta} <ArrowRight size={14} />
          </a>
        </div>

        {/* Mobile: Sprache + Burger */}
        <div className="md:hidden flex items-center gap-2">
          <div className="flex items-center rounded-full border border-gray-200 overflow-hidden text-xs font-medium">
            <button
              onClick={() => setLang('de')}
              className={`px-2.5 py-1 transition-colors ${lang === 'de' ? 'bg-gray-900 text-white' : 'text-gray-400'}`}
            >DE</button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 transition-colors ${lang === 'en' ? 'bg-gray-900 text-white' : 'text-gray-400'}`}
            >EN</button>
          </div>
          <button
            className="p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 pb-6">
          <ul className="flex flex-col gap-1 pt-4">
            <li>
              <a href="/#about" className="block py-2 text-sm text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(false)}>{t.about}</a>
            </li>
            {/* Mobile Unternehmen-Liste */}
            <li>
              <p className="py-2 text-sm text-gray-400 font-medium">{t.companies}</p>
              <ul className="pl-3 flex flex-col gap-1">
                {getSubsidiaries(lang).map((c) => (
                  <li key={c.id}>
                    {c.comingSoon ? (
                      <span className="flex items-center gap-2 py-1.5 text-sm text-gray-400">
                        {c.name}
                        <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                          {lang === 'de' ? 'Geplant' : 'Planned'}
                        </span>
                      </span>
                    ) : (
                      <Link
                        to={c.href}
                        className="block py-1.5 text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => setMenuOpen(false)}
                      >
                        {c.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <a href="/#values" className="block py-2 text-sm text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(false)}>{t.values}</a>
            </li>
            <li>
              <a href="/#contact" className="block py-2 text-sm text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(false)}>{t.contact}</a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

/** Footer – auf allen Seiten sichtbar */
function Footer({ lang }) {
  const t = i18n[lang].footer
  const companies = getSubsidiaries(lang)

  return (
    <footer id="contact" className="bg-gray-950 border-t border-white/8 px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          <div>
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight leading-tight mb-4">
              {t.heading}{' '}
              <span className="font-semibold text-slate-300">{t.headingAccent}</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-md">{t.subline}</p>
            <a
              href="mailto:hello@newgreen.group"
              className="inline-flex items-center gap-3 bg-slate-700 hover:bg-slate-600 text-white px-7 py-3.5 rounded-full text-sm font-medium transition-colors duration-300 shadow-lg shadow-black/30"
            >
              <Mail size={16} /> hello@newgreen.group
            </a>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">{t.companiesLabel}</p>
              <ul className="flex flex-col gap-2">
                {companies.map((s) => (
                  <li key={s.id}>
                    {s.comingSoon ? (
                      <span className="flex items-center gap-2 text-gray-600 text-sm">
                        {s.name}
                        <span className="text-[10px] text-amber-600/80">
                          {lang === 'de' ? 'Geplant' : 'Planned'}
                        </span>
                      </span>
                    ) : (
                      <Link to={s.href} className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                        {s.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">{t.legalLabel}</p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to="/impressum" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                    {t.impressum}
                  </Link>
                </li>
                <li>
                  <Link to="/datenschutz" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                    {t.datenschutz}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-gray-600 text-sm">{t.copyright}</span>
          <div className="flex items-center gap-4">
            <Link to="/impressum" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">{t.impressum}</Link>
            <Link to="/datenschutz" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">{t.datenschutz}</Link>
            <span className="text-gray-700 text-xs tracking-wide">{t.tagline}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── STARTSEITEN-SEKTIONEN ────────────────────────────────────────────────────

function Hero({ lang }) {
  const t = i18n[lang].hero

  return (
    <section id="hero" className="relative pt-24 pb-0 px-6 bg-white overflow-hidden">
      {/* Dezentes Raster */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Silber-Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-slate-300/15 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Zweispaltig: Text + Bild */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-6rem)] pb-12">
          {/* Linke Spalte – Text */}
          <div className="flex flex-col justify-center py-12">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium px-4 py-1.5 rounded-full mb-8 w-fit tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
              {t.eyebrow}
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight leading-[1.08] mb-6">
              {t.headline}{' '}
              <br className="hidden sm:block" />
              <span className="font-semibold text-slate-700">{t.headlineAccent}</span>
            </h1>

            {/* Subline */}
            <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg">
              {t.subline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#subsidiaries"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-slate-700 transition-all duration-300 shadow-lg shadow-gray-900/10"
              >
                {t.cta1} <ArrowRight size={16} />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 text-gray-600 border border-gray-200 px-7 py-3.5 rounded-full text-sm font-medium hover:border-slate-400 transition-all duration-300"
              >
                {t.cta2}
              </a>
            </div>
          </div>

          {/* Rechte Spalte – Neuengrün-Foto */}
          <div className="relative flex items-center justify-center py-8 lg:py-12">
            {/* Äußerer Rahmen / Hintergrund */}
            <div className="relative w-full max-w-lg lg:max-w-none rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/15 ring-1 ring-gray-900/5">
              <img
                src="/neuengruen.jpg"
                alt="Neuengrün, Dorfplatz"
                className="w-full h-72 sm:h-80 lg:h-[480px] object-cover"
                onError={(e) => {
                  // Platzhalter falls Bild noch nicht vorhanden
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              {/* Fallback-Platzhalter */}
              <div
                className="hidden w-full h-72 sm:h-80 lg:h-[480px] bg-slate-100 flex-col items-center justify-center gap-3 text-slate-400"
                style={{ display: 'none' }}
              >
                <div className="text-4xl">🏘️</div>
                <p className="text-sm text-center max-w-[200px]">
                  Bild speichern als:<br />
                  <code className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600">
                    public/neuengruen.jpg
                  </code>
                </p>
              </div>

              {/* Bild-Caption-Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-900/80 to-transparent px-6 py-5">
                <p className="text-white text-sm font-medium">{t.imageCaption}</p>
              </div>
            </div>

            {/* Dekoratives Badge */}
            <div className="absolute -bottom-3 -left-3 lg:-left-6 bg-white rounded-2xl px-4 py-3 shadow-lg border border-gray-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-xs font-medium text-gray-700">Est. Neuengrün</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-Indikator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 text-gray-400 animate-bounce">
        <span className="text-xs tracking-widest uppercase">{t.scroll}</span>
        <ChevronDown size={16} />
      </div>
    </section>
  )
}

function About({ lang }) {
  const t = i18n[lang].about
  const stats = [
    { value: '2025', label: t.stats.founded, icon: Layers },
    { value: '∞', label: t.stats.scale, icon: Globe },
    { value: 'AI', label: t.stats.tech, icon: Cpu },
    { value: '100%', label: t.stats.commitment, icon: Users },
  ]

  return (
    <section id="about" className="py-28 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 mb-4">{t.eyebrow}</p>
          <h2 className="text-4xl sm:text-5xl font-light text-gray-900 tracking-tight leading-tight mb-6">
            {t.heading[0]}<span className="font-semibold">{t.heading[1]}</span>{t.heading[2]}
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-6">{t.p1}</p>
          <p className="text-gray-500 text-lg leading-relaxed">{t.p2}</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl p-8 border border-gray-100 flex flex-col gap-3">
              <Icon size={20} className="text-slate-400" />
              <span className="text-3xl font-semibold text-gray-900 tracking-tight">{value}</span>
              <span className="text-sm text-gray-400 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SubsidiaryCard({ company, learnMore, comingSoonLabel }) {
  const { name, tagline, description, tags, icon: Icon, accentColor, href, logo, comingSoon } = company
  const accent = accentMap[accentColor] ?? accentMap.silver
  const navigate = useNavigate()

  return (
    <article
      className={`card-hover group relative bg-white rounded-3xl border border-gray-100 p-8 flex flex-col gap-6 overflow-hidden ${comingSoon ? 'cursor-default' : 'cursor-pointer'}`}
      onClick={comingSoon ? undefined : () => navigate(href)}
    >
      <div className={`absolute top-0 inset-x-0 h-0.5 ${accent.bar}`} />

      {comingSoon && (
        <div className="absolute top-4 right-4 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
          {comingSoonLabel}
        </div>
      )}

      {logo ? (
        <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden">
          <img src={logo} alt={`${name} Logo`} className="w-14 h-14 object-contain" />
        </div>
      ) : (
        <div className={`w-12 h-12 rounded-xl ${accent.iconBg} flex items-center justify-center`}>
          <Icon size={22} className={accent.iconText} />
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{name}</h3>
        <p className={`text-sm font-medium ${accent.tagline}`}>{tagline}</p>
      </div>
      <p className="text-gray-500 text-sm leading-relaxed flex-1">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className={`text-xs px-3 py-1 rounded-full ${accent.tag}`}>{tag}</span>
        ))}
      </div>
      {!comingSoon && (
        <Link
          to={href}
          onClick={(e) => e.stopPropagation()}
          className={`inline-flex items-center gap-1.5 text-sm font-medium ${accent.link} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        >
          {learnMore} <ExternalLink size={13} />
        </Link>
      )}
    </article>
  )
}

function Subsidiaries({ lang }) {
  const t = i18n[lang].subsidiaries
  const companies = getSubsidiaries(lang)

  return (
    <section id="subsidiaries" className="py-28 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-xl mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 mb-4">{t.eyebrow}</p>
          <h2 className="text-4xl sm:text-5xl font-light text-gray-900 tracking-tight leading-tight mb-4">{t.heading}</h2>
          <p className="text-gray-500 text-lg leading-relaxed">{t.subline}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <SubsidiaryCard key={company.id} company={company} learnMore={t.learnMore} comingSoonLabel={t.comingSoon} />
          ))}
          <div className="rounded-3xl border border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[280px]">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-xl font-light">+</span>
            </div>
            <p className="text-sm font-medium text-gray-400">{t.placeholder.title}</p>
            <p className="text-xs text-gray-300 max-w-[160px]">{t.placeholder.sub}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Values({ lang }) {
  const t = i18n[lang].values
  const icons = [Zap, Cpu, Globe, Shield]

  return (
    <section id="values" className="py-28 px-6 bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-xl mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 mb-4">{t.eyebrow}</p>
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight leading-tight mb-4">
            {t.heading}{' '}
            <span className="font-semibold text-slate-300">{t.headingAccent}</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">{t.subline}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {icons.map((Icon, i) => (
            <div
              key={i}
              className="group bg-white/5 border border-white/8 rounded-2xl p-6 hover:bg-white/10 hover:border-slate-500/40 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-400/10 flex items-center justify-center mb-4 group-hover:bg-slate-400/20 transition-colors duration-300">
                <Icon size={18} className="text-slate-300" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{t.items[i].title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{t.items[i].text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Komplette Startseite */
function HomePage({ lang }) {
  return (
    <>
      <Hero lang={lang} />
      <About lang={lang} />
      <Subsidiaries lang={lang} />
      <Values lang={lang} />
    </>
  )
}

// ─── EINSTIEGSPUNKT ───────────────────────────────────────────────────────────

export default function App() {
  const [lang, setLang] = useState('de')

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <>
      <RouteEffects lang={lang} />
      <Navbar lang={lang} setLang={setLang} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage lang={lang} />} />
          <Route path="/unternehmen/:id" element={<SubsidiaryPage lang={lang} />} />
          <Route path="/impressum" element={<ImpressumPage lang={lang} />} />
          <Route path="/datenschutz" element={<DatenschutzPage lang={lang} />} />
          {/* Fallback */}
          <Route path="*" element={<HomePage lang={lang} />} />
        </Routes>
      </main>
      <Footer lang={lang} />
    </>
  )
}
