/**
 * SubsidiaryPage – Detailseite für jede Tochtergesellschaft.
 * Route: /unternehmen/:id
 * Die Seite liest die Firma anhand der URL-ID aus getSubsidiaries().
 */

import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowRight, Mail, CheckCircle } from 'lucide-react'
import { getSubsidiaries, accentMap, i18n } from './data.js'

export default function SubsidiaryPage({ lang }) {
  const { id } = useParams()
  const companies = getSubsidiaries(lang)
  const company = companies.find((c) => c.id === id)
  const t = i18n[lang]

  // Unbekannte ID oder noch nicht verfügbar → zurück zur Startseite
  if (!company || company.comingSoon) return <Navigate to="/" replace />

  const { name, tagline, accentColor, icon: Icon, page, tags, logo } = company
  const accent = accentMap[accentColor] ?? accentMap.silver

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-gray-950">
        {/* Glow */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full ${accent.glow} blur-[100px] pointer-events-none`}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Zurück-Link */}
          <Link
            to="/"
            className="inline-flex items-center text-xs text-gray-500 hover:text-gray-300 tracking-wider uppercase mb-10 transition-colors"
          >
            {t.subsidiaryPage.backLabel}
          </Link>

          {/* Logo / Icon */}
          {logo ? (
            <div className="w-24 h-24 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mx-auto mb-6 overflow-hidden">
              <img src={logo} alt={`${name} Logo`} className="w-20 h-20 object-contain" />
            </div>
          ) : (
            <div
              className={`w-16 h-16 rounded-2xl ${accent.iconBg} flex items-center justify-center mx-auto mb-6`}
            >
              <Icon size={28} className={accent.iconText} />
            </div>
          )}

          {/* Name */}
          <h1 className="text-5xl sm:text-6xl font-light text-white tracking-tight mb-4">
            {name}
          </h1>

          {/* Tagline */}
          <p className={`text-lg font-medium mb-6 ${accent.tagline}`}>{tagline}</p>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tags.map((tag) => (
              <span key={tag} className={`text-xs px-3 py-1.5 rounded-full ${accent.tag}`}>
                {tag}
              </span>
            ))}
          </div>

          {/* Lange Beschreibung */}
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            {page.longDescription}
          </p>
        </div>
      </section>

      {/* ── Kennzahlen ────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-gray-950 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {page.reasons.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className={`text-3xl font-semibold mb-1 ${accent.tagline}`}>{value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Leistungen ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className={`text-xs font-medium uppercase tracking-[0.2em] mb-4 ${accent.tagline}`}>
            {t.subsidiaryPage.servicesLabel}
          </p>
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight mb-12">
            {t.subsidiaryPage.servicesHeading}
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {page.services.map(({ title, desc }) => (
              <div
                key={title}
                className={`rounded-2xl border border-gray-100 p-7 hover:border-gray-200 hover:shadow-sm transition-all duration-300 group`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle size={18} className={`mt-0.5 shrink-0 ${accent.iconText}`} />
                  <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed pl-7">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kontakt-CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight mb-4">
            {t.subsidiaryPage.contactHeading}
          </h2>
          <p className="text-gray-500 text-lg mb-8">{t.subsidiaryPage.contactSub}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hello@newgreen.group"
              className={`inline-flex items-center gap-2 bg-gray-900 hover:bg-slate-700 text-white px-8 py-3.5 rounded-full text-sm font-medium transition-colors duration-300`}
            >
              <Mail size={16} />
              {t.subsidiaryPage.contactBtn}
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-500 border border-gray-200 px-8 py-3.5 rounded-full text-sm font-medium hover:border-gray-400 transition-all duration-300"
            >
              {t.nav.backToHome} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
