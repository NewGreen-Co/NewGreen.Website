/**
 * KJG Neuengrün – Vereins-App
 * Stack: React + Tailwind CSS v4 + Lucide React + React Router v7
 *
 * Routing:
 *   /             → Übersicht (Dashboard)
 *   /termine      → Termine & Anmeldungen
 *   /aufgaben     → Aufgabenverwaltung
 *   /gewinnspiele → Gewinne einreichen & Gutscheine (Mitglieder + Vorstand)
 *   /mitglieder   → Mitgliederverwaltung (nur Vorstand)
 *   /kasse        → Vereinskasse (nur Vorstand)
 *   /bar          → Bar-Modus: Gutschein-Codes einlösen (nur Vorstand)
 *
 * Neue Seite: Eintrag in NAV_ITEMS (src/data.js) + Route hier ergänzen.
 */

import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, Church, ShieldCheck } from 'lucide-react'
import { NAV_ITEMS, ROLLEN } from './data.js'
import { useApp } from './store.jsx'
import { Avatar, Badge } from './ui.jsx'
import DashboardPage from './DashboardPage.jsx'
import TerminePage from './TerminePage.jsx'
import AufgabenPage from './AufgabenPage.jsx'
import GewinnspielePage from './GewinnspielePage.jsx'
import MitgliederPage from './MitgliederPage.jsx'
import KassePage from './KassePage.jsx'
import BarPage from './BarPage.jsx'

// ─── ROUTE-EFFEKTE ────────────────────────────────────────────────────────────

function RouteEffects() {
  const { pathname } = useLocation()
  const base = 'KJG Neuengrün'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const item = NAV_ITEMS.find((n) => n.to === pathname)
    document.title = item && item.to !== '/' ? `${item.label} — ${base}` : `${base} – Vereins-App`
  }, [pathname])

  return null
}

// ─── ANMELDUNG ────────────────────────────────────────────────────────────────

/** Demo-Profilwahl – echte Konten erfordern ein Backend (siehe README) */
function LoginPage() {
  const { mitglieder, actions } = useApp()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-amber-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-700 text-white flex items-center justify-center shadow-lg">
            <Church size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">KJG Neuengrün</h1>
          <p className="text-sm text-gray-500 mt-1">Vereins-App – Wähle dein Profil</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 space-y-1">
          {mitglieder.filter((m) => m.aktiv).map((m) => (
            <button
              key={m.id}
              onClick={() => actions.login(m.id)}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-green-50 transition-colors duration-200 text-left"
            >
              <Avatar mitglied={m} size="w-10 h-10 text-sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {m.vorname} {m.nachname}
                </p>
                <p className="text-xs text-gray-400 truncate">{m.amt || ROLLEN[m.rolle].label}</p>
              </div>
              {m.rolle === 'vorstand' && <ShieldCheck size={16} className="text-green-600 shrink-0" />}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Demo-Anmeldung ohne Passwort – für den Produktivbetrieb siehe README.
        </p>
      </div>
    </div>
  )
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────

function Sidebar({ onNavigate }) {
  const { currentUser, istVorstand, actions } = useApp()
  const items = NAV_ITEMS.filter((n) => !n.vorstandOnly || istVorstand)

  return (
    <div className="flex flex-col h-full">
      {/* Vereinslogo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-green-700 text-white flex items-center justify-center">
          <Church size={18} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">KJG Neuengrün</p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400">Vereins-App</p>
        </div>
      </div>

      {/* Navigationspunkte */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                isActive ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Angemeldetes Profil */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar mitglied={currentUser} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUser.vorname} {currentUser.nachname}
            </p>
            <Badge className={ROLLEN[currentUser.rolle].badge}>{ROLLEN[currentUser.rolle].label}</Badge>
          </div>
          <button
            onClick={actions.logout}
            title="Abmelden"
            className="text-gray-400 hover:text-red-600 transition-colors p-1.5"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── APP-SHELL ────────────────────────────────────────────────────────────────

function AppShell() {
  const { istVorstand } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop-Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100">
        <Sidebar />
      </aside>

      {/* Mobile-Topbar */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/90 nav-blur border-b border-gray-100 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-700 text-white flex items-center justify-center">
            <Church size={16} />
          </div>
          <span className="text-sm font-bold text-gray-900">KJG Neuengrün</span>
        </div>
        <button onClick={() => setMenuOpen(true)} className="p-2 text-gray-600" aria-label="Menü öffnen">
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile-Drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onMouseDown={() => setMenuOpen(false)}>
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-gray-400 z-10"
              aria-label="Menü schließen"
            >
              <X size={20} />
            </button>
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Seiteninhalt */}
      <main className="lg:pl-64">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/termine" element={<TerminePage />} />
            <Route path="/aufgaben" element={<AufgabenPage />} />
            <Route path="/gewinnspiele" element={<GewinnspielePage />} />
            <Route path="/mitglieder" element={istVorstand ? <MitgliederPage /> : <Navigate to="/" replace />} />
            <Route path="/kasse" element={istVorstand ? <KassePage /> : <Navigate to="/" replace />} />
            <Route path="/bar" element={istVorstand ? <BarPage /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

// ─── EINSTIEG ─────────────────────────────────────────────────────────────────

export default function App() {
  const { currentUser } = useApp()

  return (
    <>
      <RouteEffects />
      {currentUser ? <AppShell /> : <LoginPage />}
    </>
  )
}
