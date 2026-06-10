/**
 * Vereinskasse (nur Vorstand) – Einnahmen & Ausgaben mit Kategorien.
 * Positive Beträge = Einnahme, negative = Ausgabe.
 */

import { useState } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { KASSEN_KATEGORIEN, formatDate, formatEuro, today } from './data.js'
import { useApp } from './store.jsx'
import { PageHeader, Card, StatCard, Button, Modal, Field, Input, Select, EmptyState, Badge } from './ui.jsx'

// ─── BUCHUNGS-FORMULAR ────────────────────────────────────────────────────────

function BuchungsFormular({ onClose }) {
  const { actions } = useApp()
  const [form, setForm] = useState({
    datum: today(), beschreibung: '', kategorie: KASSEN_KATEGORIEN[0], betrag: '', typ: 'einnahme',
  })
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const speichern = (e) => {
    e.preventDefault()
    const betrag = Math.abs(parseFloat(form.betrag.replace(',', '.')))
    if (Number.isNaN(betrag) || betrag === 0) return
    actions.addBuchung({
      datum: form.datum,
      beschreibung: form.beschreibung,
      kategorie: form.kategorie,
      betrag: form.typ === 'ausgabe' ? -betrag : betrag,
    })
    onClose()
  }

  return (
    <Modal title="Neue Buchung" onClose={onClose}>
      <form onSubmit={speichern}>
        {/* Einnahme / Ausgabe */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[['einnahme', 'Einnahme', 'text-green-700 border-green-600 bg-green-50'], ['ausgabe', 'Ausgabe', 'text-red-700 border-red-500 bg-red-50']].map(
            ([typ, label, active]) => (
              <button
                key={typ}
                type="button"
                onClick={() => setForm({ ...form, typ })}
                className={`py-2.5 rounded-xl border text-sm font-medium transition-colors duration-200 ${
                  form.typ === typ ? active : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        <Field label="Beschreibung *">
          <Input value={form.beschreibung} onChange={set('beschreibung')} required placeholder="z. B. Getränkeeinkauf Sommerfest" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Betrag (€) *">
            <Input value={form.betrag} onChange={set('betrag')} required inputMode="decimal" placeholder="0,00" />
          </Field>
          <Field label="Datum">
            <Input type="date" value={form.datum} onChange={set('datum')} />
          </Field>
        </div>
        <Field label="Kategorie">
          <Select value={form.kategorie} onChange={set('kategorie')}>
            {KASSEN_KATEGORIEN.map((k) => <option key={k} value={k}>{k}</option>)}
          </Select>
        </Field>
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Abbrechen</Button>
          <Button type="submit">Buchen</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── SEITE ────────────────────────────────────────────────────────────────────

export default function KassePage() {
  const { buchungen, actions } = useApp()
  const [neu, setNeu] = useState(false)

  const einnahmen = buchungen.filter((b) => b.betrag > 0).reduce((s, b) => s + b.betrag, 0)
  const ausgaben = buchungen.filter((b) => b.betrag < 0).reduce((s, b) => s + b.betrag, 0)
  const saldo = einnahmen + ausgaben
  const sortiert = [...buchungen].sort((a, b) => b.datum.localeCompare(a.datum))

  const loeschen = (b) => {
    if (window.confirm(`Buchung „${b.beschreibung}" wirklich löschen?`)) actions.deleteBuchung(b.id)
  }

  return (
    <>
      <PageHeader title="Kasse" subtitle="Einnahmen und Ausgaben des Vereins.">
        <Button onClick={() => setNeu(true)}>
          <Plus size={16} /> Neue Buchung
        </Button>
      </PageHeader>

      {/* Kennzahlen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Wallet} label="Kassenstand" value={formatEuro(saldo)} />
        <StatCard icon={TrendingUp} label="Einnahmen gesamt" value={formatEuro(einnahmen)} accent="bg-green-50 text-green-700" />
        <StatCard icon={TrendingDown} label="Ausgaben gesamt" value={formatEuro(Math.abs(ausgaben))} accent="bg-red-50 text-red-600" />
      </div>

      {sortiert.length === 0 ? (
        <Card><EmptyState text="Noch keine Buchungen." /></Card>
      ) : (
        <Card>
          <ul className="divide-y divide-gray-100">
            {sortiert.map((b) => (
              <li key={b.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{b.beschreibung}</p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                    {formatDate(b.datum)}
                    <Badge className="bg-gray-100 text-gray-500">{b.kategorie}</Badge>
                  </p>
                </div>
                <span className={`text-sm font-semibold shrink-0 ${b.betrag >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {b.betrag >= 0 ? '+' : ''}{formatEuro(b.betrag)}
                </span>
                <button onClick={() => loeschen(b)} title="Löschen" className="p-1.5 text-gray-300 hover:text-red-600 transition-colors shrink-0">
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {neu && <BuchungsFormular onClose={() => setNeu(false)} />}
    </>
  )
}
