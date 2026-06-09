/**
 * Mitgliederverwaltung (nur Vorstand) – Stammdaten, Rollen und Ämter.
 */

import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, Mail, Phone, ShieldCheck } from 'lucide-react'
import { ROLLEN, AEMTER, formatDate } from './data.js'
import { useApp } from './store.jsx'
import { PageHeader, Card, Badge, Button, Modal, Field, Input, Select, Avatar, EmptyState } from './ui.jsx'

// ─── MITGLIEDS-FORMULAR ───────────────────────────────────────────────────────

const leeresMitglied = {
  vorname: '', nachname: '', email: '', telefon: '',
  geburtsdatum: '', eintritt: '', rolle: 'mitglied', amt: '', aktiv: true,
}

function MitgliedsFormular({ mitglied, onClose }) {
  const { actions } = useApp()
  const [form, setForm] = useState(mitglied || leeresMitglied)
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const speichern = (e) => {
    e.preventDefault()
    if (mitglied) actions.updateMitglied(mitglied.id, form)
    else actions.addMitglied(form)
    onClose()
  }

  return (
    <Modal title={mitglied ? 'Mitglied bearbeiten' : 'Neues Mitglied'} onClose={onClose}>
      <form onSubmit={speichern}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Vorname *">
            <Input value={form.vorname} onChange={set('vorname')} required />
          </Field>
          <Field label="Nachname *">
            <Input value={form.nachname} onChange={set('nachname')} required />
          </Field>
        </div>
        <Field label="E-Mail">
          <Input type="email" value={form.email} onChange={set('email')} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Telefon">
            <Input value={form.telefon} onChange={set('telefon')} />
          </Field>
          <Field label="Geburtsdatum">
            <Input type="date" value={form.geburtsdatum} onChange={set('geburtsdatum')} />
          </Field>
          <Field label="Eintrittsdatum">
            <Input type="date" value={form.eintritt} onChange={set('eintritt')} />
          </Field>
          <Field label="Rolle">
            <Select value={form.rolle} onChange={set('rolle')}>
              {Object.entries(ROLLEN).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
          </Field>
        </div>
        {form.rolle === 'vorstand' && (
          <Field label="Amt">
            <Select value={form.amt} onChange={set('amt')}>
              <option value="">– Kein Amt –</option>
              {AEMTER.map((amt) => <option key={amt} value={amt}>{amt}</option>)}
            </Select>
          </Field>
        )}
        <label className="flex items-center gap-3 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.aktiv}
            onChange={(e) => setForm({ ...form, aktiv: e.target.checked })}
            className="w-4 h-4 accent-green-700"
          />
          <span className="text-sm text-gray-700">Aktives Mitglied</span>
        </label>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Abbrechen</Button>
          <Button type="submit">Speichern</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── SEITE ────────────────────────────────────────────────────────────────────

export default function MitgliederPage() {
  const { mitglieder, currentUser, actions } = useApp()
  const [neu, setNeu] = useState(false)
  const [bearbeite, setBearbeite] = useState(null)
  const [suche, setSuche] = useState('')

  const gefiltert = mitglieder
    .filter((m) =>
      `${m.vorname} ${m.nachname} ${m.email}`.toLowerCase().includes(suche.toLowerCase())
    )
    .sort((a, b) => a.nachname.localeCompare(b.nachname))

  const loeschen = (m) => {
    if (m.id === currentUser.id) {
      window.alert('Du kannst dich nicht selbst löschen.')
      return
    }
    if (window.confirm(`${m.vorname} ${m.nachname} wirklich aus dem Verein entfernen?`)) {
      actions.deleteMitglied(m.id)
    }
  }

  return (
    <>
      <PageHeader title="Mitglieder" subtitle={`${mitglieder.filter((m) => m.aktiv).length} aktive Mitglieder im Verein.`}>
        <Button onClick={() => setNeu(true)}>
          <Plus size={16} /> Neues Mitglied
        </Button>
      </PageHeader>

      {/* Suche */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={suche}
          onChange={(e) => setSuche(e.target.value)}
          placeholder="Mitglied suchen …"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600"
        />
      </div>

      {gefiltert.length === 0 ? (
        <Card><EmptyState text="Keine Mitglieder gefunden." /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {gefiltert.map((m) => (
            <Card key={m.id} className={`p-5 ${m.aktiv ? '' : 'opacity-60'}`}>
              <div className="flex items-start gap-3">
                <Avatar mitglied={m} size="w-11 h-11 text-sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="font-semibold text-gray-900">{m.vorname} {m.nachname}</p>
                    {m.rolle === 'vorstand' && <ShieldCheck size={15} className="text-green-600" />}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <Badge className={ROLLEN[m.rolle].badge}>{m.amt || ROLLEN[m.rolle].label}</Badge>
                    {!m.aktiv && <Badge className="bg-gray-100 text-gray-500">Inaktiv</Badge>}
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    {m.email && <p className="flex items-center gap-1.5 truncate"><Mail size={12} /> {m.email}</p>}
                    {m.telefon && <p className="flex items-center gap-1.5"><Phone size={12} /> {m.telefon}</p>}
                    {m.eintritt && <p>Mitglied seit {formatDate(m.eintritt)}</p>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setBearbeite(m)} title="Bearbeiten" className="p-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => loeschen(m)} title="Löschen" className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {neu && <MitgliedsFormular onClose={() => setNeu(false)} />}
      {bearbeite && <MitgliedsFormular mitglied={bearbeite} onClose={() => setBearbeite(null)} />}
    </>
  )
}
