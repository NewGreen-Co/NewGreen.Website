/**
 * Termine – Veranstaltungen, Gruppenstunden, Sitzungen & Ausflüge.
 * Alle Mitglieder können sich an-/abmelden, der Vorstand legt Termine an.
 * Termine mit "Bar-Aktion" erlauben das Einlösen von Gewinn-Gutscheinen.
 */

import { useState } from 'react'
import { Plus, MapPin, Clock, Pencil, Trash2, Beer, Check } from 'lucide-react'
import { TERMIN_ARTEN, formatDateLong, today } from './data.js'
import { useApp } from './store.jsx'
import { PageHeader, Card, Badge, Button, Modal, Field, Input, Textarea, Select, Avatar, EmptyState } from './ui.jsx'

// ─── TERMIN-FORMULAR ──────────────────────────────────────────────────────────

const leererTermin = {
  titel: '', art: 'veranstaltung', datum: '', uhrzeit: '18:00',
  ort: '', beschreibung: '', barAktion: false,
}

function TerminFormular({ termin, onClose }) {
  const { actions } = useApp()
  const [form, setForm] = useState(termin || leererTermin)
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const speichern = (e) => {
    e.preventDefault()
    if (termin) actions.updateTermin(termin.id, form)
    else actions.addTermin(form)
    onClose()
  }

  return (
    <Modal title={termin ? 'Termin bearbeiten' : 'Neuer Termin'} onClose={onClose}>
      <form onSubmit={speichern}>
        <Field label="Titel *">
          <Input value={form.titel} onChange={set('titel')} required placeholder="z. B. Sommerfest" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Art">
            <Select value={form.art} onChange={set('art')}>
              {Object.entries(TERMIN_ARTEN).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Ort">
            <Input value={form.ort} onChange={set('ort')} placeholder="Jugendheim" />
          </Field>
          <Field label="Datum *">
            <Input type="date" value={form.datum} onChange={set('datum')} required />
          </Field>
          <Field label="Uhrzeit">
            <Input type="time" value={form.uhrzeit} onChange={set('uhrzeit')} />
          </Field>
        </div>
        <Field label="Beschreibung">
          <Textarea value={form.beschreibung} onChange={set('beschreibung')} />
        </Field>

        {/* Bar-Aktion: Gutscheine einlösbar */}
        <label className="flex items-center gap-3 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.barAktion}
            onChange={(e) => setForm({ ...form, barAktion: e.target.checked })}
            className="w-4 h-4 accent-green-700"
          />
          <span className="text-sm text-gray-700 flex items-center gap-1.5">
            <Beer size={15} className="text-amber-600" />
            Bar-Aktion – Gewinn-Gutscheine können eingelöst werden
          </span>
        </label>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Abbrechen</Button>
          <Button type="submit">Speichern</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── TERMIN-KARTE ─────────────────────────────────────────────────────────────

function TerminKarte({ termin, vergangen }) {
  const { mitglieder, currentUser, istVorstand, actions } = useApp()
  const [bearbeiten, setBearbeiten] = useState(false)
  const art = TERMIN_ARTEN[termin.art]
  const angemeldet = termin.anmeldungen.includes(currentUser.id)
  const teilnehmer = termin.anmeldungen
    .map((id) => mitglieder.find((m) => m.id === id))
    .filter(Boolean)

  const loeschen = () => {
    if (window.confirm(`Termin „${termin.titel}" wirklich löschen?`)) {
      actions.deleteTermin(termin.id)
    }
  }

  return (
    <Card className={`p-5 ${vergangen ? 'opacity-60' : ''}`}>
      {/* Aktionsspalte rutscht auf schmalen Bildschirmen unter den Inhalt */}
      <div className="flex flex-wrap items-start gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${art.color}`}>
          <art.icon size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900">{termin.titel}</h3>
            <Badge className={art.color}>{art.label}</Badge>
            {termin.barAktion && (
              <Badge className="bg-amber-100 text-amber-800">
                <Beer size={11} className="mr-1" /> Bar-Aktion
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1"><Clock size={13} /> {formatDateLong(termin.datum)} · {termin.uhrzeit} Uhr</span>
            {termin.ort && <span className="flex items-center gap-1"><MapPin size={13} /> {termin.ort}</span>}
          </p>
          {termin.beschreibung && <p className="text-sm text-gray-600 mt-2">{termin.beschreibung}</p>}

          {/* Teilnehmer */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex -space-x-2">
              {teilnehmer.slice(0, 5).map((m) => <Avatar key={m.id} mitglied={m} />)}
            </div>
            <span className="text-xs text-gray-400">
              {teilnehmer.length} {teilnehmer.length === 1 ? 'Anmeldung' : 'Anmeldungen'}
            </span>
          </div>
        </div>

        {/* Aktionen */}
        <div className="w-full sm:w-auto sm:shrink-0 flex flex-row-reverse sm:flex-col items-center sm:items-end justify-between gap-2">
          {!vergangen && (
            <Button
              variant={angemeldet ? 'secondary' : 'primary'}
              onClick={() => actions.toggleAnmeldung(termin.id, currentUser.id)}
            >
              {angemeldet ? <><Check size={15} /> Angemeldet</> : 'Anmelden'}
            </Button>
          )}
          {istVorstand && (
            <div className="flex gap-1">
              <button onClick={() => setBearbeiten(true)} title="Bearbeiten" className="p-2 text-gray-400 hover:text-gray-700 transition-colors">
                <Pencil size={16} />
              </button>
              <button onClick={loeschen} title="Löschen" className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {bearbeiten && <TerminFormular termin={termin} onClose={() => setBearbeiten(false)} />}
    </Card>
  )
}

// ─── SEITE ────────────────────────────────────────────────────────────────────

export default function TerminePage() {
  const { termine, istVorstand } = useApp()
  const [neu, setNeu] = useState(false)

  const heute = today()
  const kommende = termine.filter((t) => t.datum >= heute).sort((a, b) => a.datum.localeCompare(b.datum))
  const vergangene = termine.filter((t) => t.datum < heute).sort((a, b) => b.datum.localeCompare(a.datum))

  return (
    <>
      <PageHeader title="Termine" subtitle="Veranstaltungen, Gruppenstunden und Sitzungen.">
        {istVorstand && (
          <Button onClick={() => setNeu(true)}>
            <Plus size={16} /> Neuer Termin
          </Button>
        )}
      </PageHeader>

      {kommende.length === 0 && vergangene.length === 0 && (
        <Card><EmptyState text="Noch keine Termine angelegt." /></Card>
      )}

      <div className="space-y-4">
        {kommende.map((t) => <TerminKarte key={t.id} termin={t} />)}
      </div>

      {vergangene.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-10 mb-4">
            Vergangene Termine
          </h2>
          <div className="space-y-4">
            {vergangene.map((t) => <TerminKarte key={t.id} termin={t} vergangen />)}
          </div>
        </>
      )}

      {neu && <TerminFormular onClose={() => setNeu(false)} />}
    </>
  )
}
