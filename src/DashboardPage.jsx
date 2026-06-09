/**
 * Übersicht (Dashboard) – Kennzahlen, nächste Termine und offene Aufgaben
 * auf einen Blick. Vorstand sieht zusätzlich Kassenstand und offene Gewinne.
 */

import { Link } from 'react-router-dom'
import { Users, Calendar, ClipboardList, Wallet, Ticket, ChevronRight, MapPin } from 'lucide-react'
import { TERMIN_ARTEN, GUTSCHEIN_STATUS, formatDateLong, formatEuro } from './data.js'
import { useApp } from './store.jsx'
import { PageHeader, Card, StatCard, Badge, EmptyState } from './ui.jsx'

export default function DashboardPage() {
  const { mitglieder, termine, aufgaben, buchungen, gutscheine, currentUser, istVorstand } = useApp()

  const heute = new Date().toISOString().slice(0, 10)
  const kommende = termine
    .filter((t) => t.datum >= heute)
    .sort((a, b) => a.datum.localeCompare(b.datum))
    .slice(0, 4)

  const meineAufgaben = aufgaben.filter((a) => !a.erledigt && a.zustaendig === currentUser.id)
  const offeneAufgaben = aufgaben.filter((a) => !a.erledigt)
  const kassenstand = buchungen.reduce((sum, b) => sum + b.betrag, 0)
  const offeneGewinne = gutscheine.filter((g) => g.status === 'eingereicht')
  const meineGutscheine = gutscheine.filter(
    (g) => g.mitgliedId === currentUser.id && g.status === 'freigegeben'
  )

  return (
    <>
      <PageHeader
        title={`Hallo, ${currentUser.vorname}!`}
        subtitle="Hier ist der aktuelle Stand im Verein."
      />

      {/* Kennzahlen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Aktive Mitglieder" value={mitglieder.filter((m) => m.aktiv).length} />
        <StatCard icon={Calendar} label="Kommende Termine" value={kommende.length} accent="bg-sky-50 text-sky-700" />
        <StatCard icon={ClipboardList} label="Offene Aufgaben" value={offeneAufgaben.length} accent="bg-amber-50 text-amber-700" />
        {istVorstand ? (
          <StatCard icon={Wallet} label="Kassenstand" value={formatEuro(kassenstand)} accent="bg-violet-50 text-violet-700" />
        ) : (
          <StatCard icon={Ticket} label="Einlösbare Gutscheine" value={meineGutscheine.length} accent="bg-violet-50 text-violet-700" />
        )}
      </div>

      {/* Hinweis für Vorstand: Gewinne warten auf Prüfung */}
      {istVorstand && offeneGewinne.length > 0 && (
        <Link
          to="/gewinnspiele"
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-8 hover:bg-amber-100 transition-colors duration-200"
        >
          <Ticket size={20} className="text-amber-700 shrink-0" />
          <p className="text-sm text-amber-900 flex-1">
            <strong>{offeneGewinne.length}</strong> eingereichte{offeneGewinne.length === 1 ? 'r Gewinn wartet' : ' Gewinne warten'} auf Prüfung.
          </p>
          <ChevronRight size={18} className="text-amber-700" />
        </Link>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Nächste Termine */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Nächste Termine</h2>
            <Link to="/termine" className="text-xs text-green-700 font-medium hover:underline">
              Alle ansehen
            </Link>
          </div>
          {kommende.length === 0 ? (
            <EmptyState text="Keine kommenden Termine." />
          ) : (
            <ul className="space-y-3">
              {kommende.map((t) => {
                const art = TERMIN_ARTEN[t.art]
                return (
                  <li key={t.id} className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${art.color}`}>
                      <art.icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{t.titel}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        {formatDateLong(t.datum)} · {t.uhrzeit} Uhr
                        <MapPin size={11} /> {t.ort}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        {/* Meine Aufgaben / Gutscheine */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Meine offenen Aufgaben</h2>
            <Link to="/aufgaben" className="text-xs text-green-700 font-medium hover:underline">
              Alle ansehen
            </Link>
          </div>
          {meineAufgaben.length === 0 ? (
            <EmptyState text="Nichts offen – stark!" />
          ) : (
            <ul className="space-y-3">
              {meineAufgaben.map((a) => (
                <li key={a.id} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{a.titel}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">bis {formatDateLong(a.faellig)}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Einlösbare Gutscheine des Mitglieds */}
          {meineGutscheine.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Deine einlösbaren Gutscheine</h3>
              {meineGutscheine.map((g) => (
                <Link
                  key={g.id}
                  to="/gewinnspiele"
                  className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3 mb-2 hover:bg-green-100 transition-colors duration-200"
                >
                  <div>
                    <p className="text-sm font-medium text-green-900">{g.rabatt}</p>
                    <p className="font-mono voucher-code text-lg font-bold text-green-800">{g.code}</p>
                  </div>
                  <Badge className={GUTSCHEIN_STATUS[g.status].badge}>{GUTSCHEIN_STATUS[g.status].label}</Badge>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  )
}
