/**
 * Gemeinsame UI-Bausteine – Modal, Badges, Formularfelder, Karten.
 * Bewusst klein gehalten: nur was mehrfach gebraucht wird, landet hier.
 */

import { useEffect } from 'react'
import { X, Inbox } from 'lucide-react'
import { initials } from './data.js'

// ─── SEITENKOPF ───────────────────────────────────────────────────────────────

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  )
}

// ─── KARTEN & BADGES ──────────────────────────────────────────────────────────

export function Card({ className = '', children }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, accent = 'bg-green-50 text-green-700' }) {
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-gray-900 truncate">{value}</p>
        <p className="text-xs text-gray-500 truncate">{label}</p>
      </div>
    </Card>
  )
}

export function Badge({ className = '', children }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}

/** Kreis mit Initialen, z. B. für Teilnehmerlisten */
export function Avatar({ mitglied, size = 'w-8 h-8 text-xs' }) {
  return (
    <span
      title={mitglied ? `${mitglied.vorname} ${mitglied.nachname}` : 'Unbekannt'}
      className={`${size} rounded-full bg-green-100 text-green-800 font-semibold flex items-center justify-center shrink-0`}
    >
      {mitglied ? initials(mitglied.vorname, mitglied.nachname) : '?'}
    </span>
  )
}

export function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-gray-400">
      <Inbox size={32} strokeWidth={1.5} />
      <p className="text-sm">{text}</p>
    </div>
  )
}

// ─── BUTTONS ──────────────────────────────────────────────────────────────────

export function Button({ variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-green-700 text-white hover:bg-green-800',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
    danger: 'bg-red-50 text-red-700 hover:bg-red-100',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    />
  )
}

// ─── MODAL ────────────────────────────────────────────────────────────────────

export function Modal({ title, onClose, children }) {
  // Schließen mit Escape
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors" aria-label="Schließen">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ─── FORMULARFELDER ───────────────────────────────────────────────────────────

// text-base auf Mobilgeräten: unter 16 px zoomt iOS beim Fokussieren in das Feld
const fieldClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-base sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600 bg-white'

export function Field({ label, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-medium text-gray-600 mb-1.5">{label}</span>
      {children}
    </label>
  )
}

export function Input(props) {
  return <input className={fieldClass} {...props} />
}

export function Textarea(props) {
  return <textarea rows={3} className={fieldClass} {...props} />
}

export function Select({ children, ...props }) {
  return (
    <select className={fieldClass} {...props}>
      {children}
    </select>
  )
}
