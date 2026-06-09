/**
 * Bar-Modus (nur Vorstand) – für den Einsatz direkt an der Bar.
 * Das Mitglied zeigt seinen Gutschein-Code vor, der Vorstand tippt ihn ein,
 * prüft den Rabatt und löst mit einem Klick ein. Große Schrift und wenige
 * Elemente, damit es auch im Veranstaltungstrubel schnell geht.
 */

import { useState } from 'react'
import { Beer, CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import { formatDate } from './data.js'
import { useApp } from './store.jsx'
import { PageHeader, Card, Button, Avatar, EmptyState } from './ui.jsx'

export default function BarPage() {
  const { gutscheine, mitglieder, termine, actions } = useApp()
  const [eingabe, setEingabe] = useState('')
  const [treffer, setTreffer] = useState(null)   // gefundener Gutschein
  const [meldung, setMeldung] = useState(null)   // { typ: 'ok'|'fehler', text }

  const heuteEingeloest = gutscheine.filter(
    (g) => g.status === 'eingeloest' && g.eingeloestAm === new Date().toISOString().slice(0, 10)
  )

  // Code normalisieren: Großschreibung, "KJG-" darf fehlen
  const suchen = (e) => {
    e.preventDefault()
    let code = eingabe.trim().toUpperCase()
    if (code && !code.startsWith('KJG-')) code = `KJG-${code}`

    const g = gutscheine.find((x) => x.code === code)
    if (!g) {
      setTreffer(null)
      setMeldung({ typ: 'fehler', text: 'Code nicht gefunden – bitte prüfen.' })
    } else if (g.status === 'eingeloest') {
      setTreffer(null)
      setMeldung({ typ: 'fehler', text: `Dieser Gutschein wurde bereits am ${formatDate(g.eingeloestAm)} eingelöst.` })
    } else if (g.status !== 'freigegeben') {
      setTreffer(null)
      setMeldung({ typ: 'fehler', text: 'Dieser Gutschein ist nicht einlösbar.' })
    } else {
      setTreffer(g)
      setMeldung(null)
    }
  }

  const einloesen = () => {
    actions.redeemGutschein(treffer.id)
    setMeldung({ typ: 'ok', text: `Eingelöst: ${treffer.rabatt}` })
    setTreffer(null)
    setEingabe('')
  }

  const zuruecksetzen = () => {
    setTreffer(null)
    setMeldung(null)
    setEingabe('')
  }

  const mitglied = treffer && mitglieder.find((m) => m.id === treffer.mitgliedId)
  const termin = treffer && termine.find((t) => t.id === treffer.terminId)

  return (
    <>
      <PageHeader title="Bar-Modus" subtitle="Gutschein-Code eingeben und einlösen." />

      {/* Code-Eingabe */}
      <Card className="p-6 sm:p-8 mb-6">
        <form onSubmit={suchen} className="flex flex-col sm:flex-row gap-3">
          <input
            value={eingabe}
            onChange={(e) => setEingabe(e.target.value)}
            placeholder="KJG-XXXX"
            autoFocus
            autoComplete="off"
            className="flex-1 px-5 py-4 rounded-2xl border-2 border-gray-200 font-mono voucher-code text-2xl text-center uppercase text-gray-900 focus:outline-none focus:border-green-600"
          />
          <Button type="submit" className="py-4 px-8 text-base">Prüfen</Button>
        </form>

        {/* Meldung */}
        {meldung && (
          <div
            className={`mt-4 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-medium ${
              meldung.typ === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'
            }`}
          >
            {meldung.typ === 'ok' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {meldung.text}
            <button onClick={zuruecksetzen} className="ml-auto text-gray-400 hover:text-gray-700 transition-colors" title="Zurücksetzen">
              <RotateCcw size={16} />
            </button>
          </div>
        )}

        {/* Gefundener Gutschein */}
        {treffer && (
          <div className="mt-5 bg-green-50 border-2 border-green-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Avatar mitglied={mitglied} size="w-10 h-10 text-sm" />
              <div>
                <p className="font-semibold text-gray-900">
                  {mitglied ? `${mitglied.vorname} ${mitglied.nachname}` : 'Unbekanntes Mitglied'}
                </p>
                <p className="text-xs text-gray-500">{treffer.titel} · {treffer.quelle}</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-800 flex items-center gap-2">
              <Beer size={24} /> {treffer.rabatt}
            </p>
            {termin && (
              <p className="text-xs text-amber-700 mt-2">
                Hinweis: Gutschein ist für „{termin.titel}" ({formatDate(termin.datum)}) ausgestellt.
              </p>
            )}
            <Button onClick={einloesen} className="w-full mt-4 py-4 text-base">
              <CheckCircle2 size={18} /> Jetzt einlösen
            </Button>
          </div>
        )}
      </Card>

      {/* Heute eingelöste Gutscheine */}
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Heute eingelöst ({heuteEingeloest.length})
      </h2>
      {heuteEingeloest.length === 0 ? (
        <Card><EmptyState text="Heute noch nichts eingelöst." /></Card>
      ) : (
        <Card>
          <ul className="divide-y divide-gray-100">
            {heuteEingeloest.map((g) => {
              const m = mitglieder.find((x) => x.id === g.mitgliedId)
              return (
                <li key={g.id} className="flex items-center gap-3 px-5 py-3.5">
                  <Avatar mitglied={m} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {m ? `${m.vorname} ${m.nachname}` : 'Unbekannt'}
                    </p>
                    <p className="text-xs text-gray-400">{g.rabatt}</p>
                  </div>
                  <span className="font-mono text-xs text-gray-400">{g.code}</span>
                </li>
              )
            })}
          </ul>
        </Card>
      )}
    </>
  )
}
