/**
 * Aufgaben – To-dos im Verein mit Zuständigkeit und Fälligkeit.
 * Der Vorstand legt Aufgaben an und verteilt sie; jeder kann abhaken.
 */

import { useState } from 'react'
import { Plus, Trash2, Pencil, CircleCheck, Circle } from 'lucide-react'
import { formatDateLong, today } from './data.js'
import { useApp } from './store.jsx'
import { PageHeader, Card, Button, Modal, Field, Input, Textarea, Select, Avatar, EmptyState } from './ui.jsx'

// ─── AUFGABEN-FORMULAR ────────────────────────────────────────────────────────

const leereAufgabe = { titel: '', beschreibung: '', zustaendig: '', faellig: '' }

function AufgabenFormular({ aufgabe, onClose }) {
  const { mitglieder, actions } = useApp()
  const [form, setForm] = useState(aufgabe || leereAufgabe)
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const speichern = (e) => {
    e.preventDefault()
    if (aufgabe) actions.updateAufgabe(aufgabe.id, form)
    else actions.addAufgabe(form)
    onClose()
  }

  return (
    <Modal title={aufgabe ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'} onClose={onClose}>
      <form onSubmit={speichern}>
        <Field label="Titel *">
          <Input value={form.titel} onChange={set('titel')} required placeholder="z. B. Getränke bestellen" />
        </Field>
        <Field label="Beschreibung">
          <Textarea value={form.beschreibung} onChange={set('beschreibung')} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Zuständig">
            <Select value={form.zustaendig} onChange={set('zustaendig')}>
              <option value="">– Niemand –</option>
              {mitglieder.filter((m) => m.aktiv).map((m) => (
                <option key={m.id} value={m.id}>{m.vorname} {m.nachname}</option>
              ))}
            </Select>
          </Field>
          <Field label="Fällig bis">
            <Input type="date" value={form.faellig} onChange={set('faellig')} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Abbrechen</Button>
          <Button type="submit">Speichern</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── SEITE ────────────────────────────────────────────────────────────────────

export default function AufgabenPage() {
  const { aufgaben, mitglieder, istVorstand, actions } = useApp()
  const [neu, setNeu] = useState(false)
  const [bearbeite, setBearbeite] = useState(null)
  const [filter, setFilter] = useState('offen')

  const gefiltert = aufgaben
    .filter((a) => (filter === 'offen' ? !a.erledigt : a.erledigt))
    .sort((a, b) => (a.faellig || '9999').localeCompare(b.faellig || '9999'))

  const loeschen = (a) => {
    if (window.confirm(`Aufgabe „${a.titel}" wirklich löschen?`)) actions.deleteAufgabe(a.id)
  }

  return (
    <>
      <PageHeader title="Aufgaben" subtitle="Wer macht was bis wann.">
        {istVorstand && (
          <Button onClick={() => setNeu(true)}>
            <Plus size={16} /> Neue Aufgabe
          </Button>
        )}
      </PageHeader>

      {/* Filter offen / erledigt */}
      <div className="flex gap-2 mb-6">
        {[['offen', 'Offen'], ['erledigt', 'Erledigt']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
              filter === key ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {gefiltert.length === 0 ? (
        <Card><EmptyState text={filter === 'offen' ? 'Keine offenen Aufgaben.' : 'Noch nichts erledigt.'} /></Card>
      ) : (
        <div className="space-y-3">
          {gefiltert.map((a) => {
            const person = mitglieder.find((m) => m.id === a.zustaendig)
            const ueberfaellig = !a.erledigt && a.faellig && a.faellig < today()
            return (
              <Card key={a.id} className="p-4 flex items-center gap-4">
                <button
                  onClick={() => actions.toggleAufgabe(a.id)}
                  title={a.erledigt ? 'Als offen markieren' : 'Als erledigt markieren'}
                  className={`shrink-0 transition-colors ${a.erledigt ? 'text-green-600' : 'text-gray-300 hover:text-green-600'}`}
                >
                  {a.erledigt ? <CircleCheck size={24} /> : <Circle size={24} />}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${a.erledigt ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {a.titel}
                  </p>
                  {a.beschreibung && <p className="text-xs text-gray-500 truncate">{a.beschreibung}</p>}
                  {a.faellig && (
                    <p className={`text-xs mt-0.5 ${ueberfaellig ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                      fällig {formatDateLong(a.faellig)}{ueberfaellig && ' – überfällig!'}
                    </p>
                  )}
                </div>

                {person && <Avatar mitglied={person} />}

                {istVorstand && (
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => setBearbeite(a)} title="Bearbeiten" className="p-2 text-gray-400 hover:text-gray-700 transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => loeschen(a)} title="Löschen" className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {neu && <AufgabenFormular onClose={() => setNeu(false)} />}
      {bearbeite && <AufgabenFormular aufgabe={bearbeite} onClose={() => setBearbeite(null)} />}
    </>
  )
}
