/**
 * Gewinnspiele – Mitglieder laden ihre Gewinne hoch (z. B. Tombola-Los,
 * Gewinnbenachrichtigung als Foto). Der Vorstand prüft die Einreichung und
 * gibt sie mit einem Rabatt frei. Das Mitglied erhält einen Einlöse-Code,
 * der bei Veranstaltungen mit Bar-Aktion an der Bar vergünstigte Getränke
 * bringt (Einlösung im Bar-Modus).
 *
 * Ablauf: eingereicht → freigegeben (mit Code) → eingelöst | abgelehnt
 */

import { useState } from 'react'
import { Plus, Ticket, ImagePlus, CheckCircle2, XCircle, Trash2, Beer } from 'lucide-react'
import { GUTSCHEIN_STATUS, RABATT_VORLAGEN, formatDate } from './data.js'
import { useApp } from './store.jsx'
import { PageHeader, Card, Badge, Button, Modal, Field, Input, Textarea, Select, Avatar, EmptyState } from './ui.jsx'

// ─── BILD-UPLOAD ──────────────────────────────────────────────────────────────

/** Bild auf max. 800 px verkleinern und als Daten-URL liefern (schont localStorage) */
const resizeImage = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const max = 800
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(img.src)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })

// ─── EINREICHEN (MITGLIED) ────────────────────────────────────────────────────

function EinreichFormular({ onClose }) {
  const { currentUser, actions } = useApp()
  const [form, setForm] = useState({ titel: '', quelle: '', beschreibung: '', bild: null })
  const [fehler, setFehler] = useState('')
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const bildWaehlen = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const bild = await resizeImage(file)
      setForm({ ...form, bild })
      setFehler('')
    } catch {
      setFehler('Bild konnte nicht gelesen werden – bitte anderes Format versuchen.')
    }
  }

  const einreichen = (e) => {
    e.preventDefault()
    actions.submitGutschein({ ...form, mitgliedId: currentUser.id })
    onClose()
  }

  return (
    <Modal title="Gewinn einreichen" onClose={onClose}>
      <form onSubmit={einreichen}>
        <Field label="Was hast du gewonnen? *">
          <Input value={form.titel} onChange={set('titel')} required placeholder="z. B. 1. Preis Tombola" />
        </Field>
        <Field label="Gewinnspiel / Quelle *">
          <Input value={form.quelle} onChange={set('quelle')} required placeholder="z. B. Tombola Dorffest" />
        </Field>
        <Field label="Details (Losnummer o. Ä.)">
          <Textarea value={form.beschreibung} onChange={set('beschreibung')} />
        </Field>

        {/* Foto als Nachweis */}
        <Field label="Foto als Nachweis (optional)">
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-green-500 hover:bg-green-50/50 transition-colors duration-200">
            {form.bild ? (
              <img src={form.bild} alt="Nachweis" className="max-h-40 rounded-xl object-contain" />
            ) : (
              <>
                <ImagePlus size={24} className="text-gray-400" />
                <span className="text-xs text-gray-500">Foto auswählen oder aufnehmen</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={bildWaehlen} className="hidden" />
          </label>
        </Field>
        {fehler && <p className="text-xs text-red-600 mb-4">{fehler}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Abbrechen</Button>
          <Button type="submit">Einreichen</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── FREIGABE (VORSTAND) ──────────────────────────────────────────────────────

function FreigabeFormular({ gutschein, onClose }) {
  const { termine, actions } = useApp()
  const [rabatt, setRabatt] = useState(RABATT_VORLAGEN[0])
  const [eigener, setEigener] = useState('')
  const [terminId, setTerminId] = useState('')
  const barTermine = termine.filter((t) => t.barAktion)

  const freigeben = (e) => {
    e.preventDefault()
    actions.approveGutschein(gutschein.id, { rabatt: eigener.trim() || rabatt, terminId })
    onClose()
  }

  return (
    <Modal title="Gewinn freigeben" onClose={onClose}>
      <form onSubmit={freigeben}>
        <p className="text-sm text-gray-600 mb-4">
          Der Gutschein erhält einen Einlöse-Code, den das Mitglied an der Bar vorzeigt.
        </p>
        <Field label="Rabatt / Gegenwert">
          <Select value={rabatt} onChange={(e) => setRabatt(e.target.value)}>
            {RABATT_VORLAGEN.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
        </Field>
        <Field label="Oder eigenen Rabatt eintragen">
          <Input value={eigener} onChange={(e) => setEigener(e.target.value)} placeholder="z. B. 3 Freigetränke" />
        </Field>
        <Field label="Gültig bei Veranstaltung (optional)">
          <Select value={terminId} onChange={(e) => setTerminId(e.target.value)}>
            <option value="">Bei jeder Bar-Aktion gültig</option>
            {barTermine.map((t) => (
              <option key={t.id} value={t.id}>{t.titel} ({formatDate(t.datum)})</option>
            ))}
          </Select>
        </Field>
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Abbrechen</Button>
          <Button type="submit"><CheckCircle2 size={16} /> Freigeben</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── GUTSCHEIN-KARTE ──────────────────────────────────────────────────────────

function GutscheinKarte({ gutschein }) {
  const { mitglieder, termine, currentUser, istVorstand, actions } = useApp()
  const [freigabe, setFreigabe] = useState(false)
  const status = GUTSCHEIN_STATUS[gutschein.status]
  const mitglied = mitglieder.find((m) => m.id === gutschein.mitgliedId)
  const termin = termine.find((t) => t.id === gutschein.terminId)
  const istEigener = gutschein.mitgliedId === currentUser.id

  const ablehnen = () => {
    const kommentar = window.prompt('Grund der Ablehnung (wird dem Mitglied angezeigt):')
    if (kommentar !== null) actions.rejectGutschein(gutschein.id, kommentar)
  }

  const loeschen = () => {
    if (window.confirm('Einreichung wirklich löschen?')) actions.deleteGutschein(gutschein.id)
  }

  return (
    <Card className="p-5">
      {/* Aktionsspalte rutscht auf schmalen Bildschirmen unter den Inhalt */}
      <div className="flex flex-wrap items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
          <Ticket size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900">{gutschein.titel}</h3>
            <Badge className={status.badge}>{status.label}</Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {gutschein.quelle} · eingereicht am {formatDate(gutschein.eingereicht)}
            {istVorstand && mitglied && <> · von {mitglied.vorname} {mitglied.nachname}</>}
          </p>
          {gutschein.beschreibung && <p className="text-sm text-gray-600 mt-2">{gutschein.beschreibung}</p>}

          {gutschein.bild && (
            <img src={gutschein.bild} alt="Nachweis" className="mt-3 max-h-36 rounded-xl border border-gray-100" />
          )}

          {/* Freigegeben: Code groß zum Vorzeigen an der Bar */}
          {gutschein.status === 'freigegeben' && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4">
              <p className="text-xs text-green-700 flex items-center gap-1.5">
                <Beer size={13} /> {gutschein.rabatt}
                {termin ? ` – gültig bei „${termin.titel}"` : ' – gültig bei jeder Bar-Aktion'}
              </p>
              <p className="font-mono voucher-code text-3xl font-bold text-green-800 mt-1">{gutschein.code}</p>
              {istEigener && <p className="text-[11px] text-green-600 mt-1">Diesen Code an der Bar vorzeigen.</p>}
            </div>
          )}

          {gutschein.status === 'eingeloest' && (
            <p className="text-xs text-gray-400 mt-3">
              Eingelöst am {formatDate(gutschein.eingeloestAm)} ({gutschein.rabatt})
            </p>
          )}

          {gutschein.status === 'abgelehnt' && gutschein.kommentar && (
            <p className="text-xs text-red-600 mt-3">Grund: {gutschein.kommentar}</p>
          )}
        </div>

        {/* Aktionen */}
        <div className="w-full sm:w-auto sm:shrink-0 flex flex-row-reverse sm:flex-col items-center sm:items-end justify-between gap-2 empty:hidden">
          {istVorstand && mitglied && <Avatar mitglied={mitglied} />}
          {istVorstand && gutschein.status === 'eingereicht' && (
            <div className="flex sm:flex-col gap-1.5">
              <Button onClick={() => setFreigabe(true)}><CheckCircle2 size={15} /> Freigeben</Button>
              <Button variant="danger" onClick={ablehnen}><XCircle size={15} /> Ablehnen</Button>
            </div>
          )}
          {istVorstand && gutschein.status !== 'eingereicht' && (
            <button onClick={loeschen} title="Löschen" className="p-2 text-gray-300 hover:text-red-600 transition-colors">
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {freigabe && <FreigabeFormular gutschein={gutschein} onClose={() => setFreigabe(false)} />}
    </Card>
  )
}

// ─── SEITE ────────────────────────────────────────────────────────────────────

export default function GewinnspielePage() {
  const { gutscheine, currentUser, istVorstand } = useApp()
  const [neu, setNeu] = useState(false)
  const [filter, setFilter] = useState('alle')

  // Mitglieder sehen nur ihre eigenen Einreichungen
  const sichtbar = istVorstand ? gutscheine : gutscheine.filter((g) => g.mitgliedId === currentUser.id)
  const gefiltert = filter === 'alle' ? sichtbar : sichtbar.filter((g) => g.status === filter)

  const filterChips = [
    ['alle', 'Alle'],
    ['eingereicht', 'Wird geprüft'],
    ['freigegeben', 'Einlösbar'],
    ['eingeloest', 'Eingelöst'],
  ]

  return (
    <>
      <PageHeader
        title="Gewinnspiele"
        subtitle={
          istVorstand
            ? 'Eingereichte Gewinne prüfen und Gutscheine freigeben.'
            : 'Reiche deinen Gewinn ein und erhalte einen Gutschein für vergünstigte Getränke an der Bar.'
        }
      >
        <Button onClick={() => setNeu(true)}>
          <Plus size={16} /> Gewinn einreichen
        </Button>
      </PageHeader>

      {/* So funktioniert's (für Mitglieder) */}
      {!istVorstand && sichtbar.length === 0 && (
        <Card className="p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">So funktioniert's</h2>
          <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
            <li>Du hast bei einem Gewinnspiel gewonnen? Reiche deinen Gewinn hier mit Foto ein.</li>
            <li>Der Vorstand prüft die Einreichung und gibt sie frei.</li>
            <li>Du bekommst einen Code – zeig ihn bei einer Veranstaltung an der Bar vor und erhalte vergünstigte Getränke.</li>
          </ol>
        </Card>
      )}

      {/* Statusfilter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterChips.map(([key, label]) => (
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
        <Card><EmptyState text="Keine Einreichungen vorhanden." /></Card>
      ) : (
        <div className="space-y-4">
          {gefiltert.map((g) => <GutscheinKarte key={g.id} gutschein={g} />)}
        </div>
      )}

      {neu && <EinreichFormular onClose={() => setNeu(false)} />}
    </>
  )
}
