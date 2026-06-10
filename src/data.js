/**
 * Zentrale Datendatei – Konstanten, Hilfsfunktionen & Seed-Daten.
 *
 * Neue Termin-Art, Kassen-Kategorie oder Rabatt-Vorlage: einfach in die
 * jeweilige Konstante eintragen – die Oberfläche übernimmt sie automatisch.
 */

import {
  Users, Calendar, ClipboardList, Wallet,
  Ticket, Beer, LayoutDashboard, PartyPopper,
  Church, Bus, Gavel,
} from 'lucide-react'

// ─── ROLLEN & ÄMTER ───────────────────────────────────────────────────────────

export const ROLLEN = {
  vorstand: { label: 'Vorstand', badge: 'bg-green-100 text-green-800' },
  mitglied: { label: 'Mitglied', badge: 'bg-gray-100 text-gray-600' },
}

export const AEMTER = [
  '1. Vorsitz', '2. Vorsitz', 'Kassier/in', 'Schriftführer/in', 'Jugendleiter/in', 'Beisitzer/in',
]

// ─── TERMIN-ARTEN ─────────────────────────────────────────────────────────────

export const TERMIN_ARTEN = {
  gruppenstunde: { label: 'Gruppenstunde', icon: Church, color: 'bg-sky-100 text-sky-700' },
  veranstaltung: { label: 'Veranstaltung', icon: PartyPopper, color: 'bg-amber-100 text-amber-700' },
  ausflug: { label: 'Ausflug', icon: Bus, color: 'bg-violet-100 text-violet-700' },
  sitzung: { label: 'Sitzung', icon: Gavel, color: 'bg-gray-100 text-gray-600' },
}

// ─── KASSEN-KATEGORIEN ────────────────────────────────────────────────────────

export const KASSEN_KATEGORIEN = [
  'Mitgliedsbeiträge', 'Getränkeverkauf', 'Veranstaltung', 'Zuschüsse', 'Material', 'Sonstiges',
]

// ─── GEWINN-GUTSCHEINE ────────────────────────────────────────────────────────

/** Status-Lebenszyklus: eingereicht → freigegeben → eingelöst (oder abgelehnt) */
export const GUTSCHEIN_STATUS = {
  eingereicht: { label: 'Wird geprüft', badge: 'bg-amber-100 text-amber-800' },
  freigegeben: { label: 'Einlösbar', badge: 'bg-green-100 text-green-800' },
  eingeloest: { label: 'Eingelöst', badge: 'bg-gray-200 text-gray-600' },
  abgelehnt: { label: 'Abgelehnt', badge: 'bg-red-100 text-red-700' },
}

/** Vorlagen für den Vorstand bei der Freigabe eines Gewinns */
export const RABATT_VORLAGEN = [
  '1 Freigetränk',
  '2 Freigetränke',
  '50 % auf alle Getränke',
  '1 € Rabatt pro Getränk',
]

// ─── NAVIGATION ───────────────────────────────────────────────────────────────

/** Seiten der App – `vorstandOnly` blendet Einträge für Mitglieder aus */
export const NAV_ITEMS = [
  { to: '/', label: 'Übersicht', icon: LayoutDashboard },
  { to: '/termine', label: 'Termine', icon: Calendar },
  { to: '/aufgaben', label: 'Aufgaben', icon: ClipboardList },
  { to: '/gewinnspiele', label: 'Gewinnspiele', icon: Ticket },
  { to: '/mitglieder', label: 'Mitglieder', icon: Users, vorstandOnly: true },
  { to: '/kasse', label: 'Kasse', icon: Wallet, vorstandOnly: true },
  { to: '/bar', label: 'Bar-Modus', icon: Beer, vorstandOnly: true },
]

// ─── HILFSFUNKTIONEN ──────────────────────────────────────────────────────────

/** Eindeutige ID, z. B. "m1718012345678x4f2" */
export const uid = (prefix = 'id') =>
  `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 6)}`

/** Einlöse-Code im Format "KJG-7F3K" (ohne verwechselbare Zeichen) */
export const generateCode = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return `KJG-${code}`
}

/** "2026-06-09" → "09.06.2026" */
export const formatDate = (iso) => {
  if (!iso) return '–'
  const d = new Date(iso)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/** "2026-06-09" → "Di., 09. Juni" */
export const formatDateLong = (iso) => {
  if (!iso) return '–'
  const d = new Date(iso)
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'long' })
}

/** 12.5 → "12,50 €" */
export const formatEuro = (betrag) =>
  betrag.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })

/** Initialen für Avatare: "Anna Maier" → "AM" */
export const initials = (vorname, nachname) =>
  `${(vorname || '?')[0]}${(nachname || '?')[0]}`.toUpperCase()

/** Heutiges Datum als ISO-String "YYYY-MM-DD" */
export const today = () => new Date().toISOString().slice(0, 10)

// ─── SEED-DATEN ───────────────────────────────────────────────────────────────

/** Demo-Datensatz beim ersten Start – wird danach in localStorage gepflegt */
export const seedData = () => {
  const datum = (tage) => {
    const d = new Date()
    d.setDate(d.getDate() + tage)
    return d.toISOString().slice(0, 10)
  }

  const mitglieder = [
    { id: 'm1', vorname: 'Christopher', nachname: 'Jack', email: 'christopher@online-jack.de', telefon: '', geburtsdatum: '', eintritt: '2015-01-01', rolle: 'vorstand', amt: '1. Vorsitz', aktiv: true },
    { id: 'm2', vorname: 'Anna', nachname: 'Maier', email: 'anna.maier@example.de', telefon: '', geburtsdatum: '', eintritt: '2018-09-01', rolle: 'vorstand', amt: 'Kassier/in', aktiv: true },
    { id: 'm3', vorname: 'Lukas', nachname: 'Schmidt', email: 'lukas.schmidt@example.de', telefon: '', geburtsdatum: '', eintritt: '2021-03-15', rolle: 'mitglied', amt: '', aktiv: true },
    { id: 'm4', vorname: 'Lena', nachname: 'Hofmann', email: 'lena.hofmann@example.de', telefon: '', geburtsdatum: '', eintritt: '2022-06-01', rolle: 'mitglied', amt: '', aktiv: true },
  ]

  const termine = [
    {
      id: 't1', titel: 'Gruppenstunde', art: 'gruppenstunde', datum: datum(3), uhrzeit: '18:00',
      ort: 'Jugendheim Neuengrün', beschreibung: 'Wöchentliche Gruppenstunde – Spieleabend.',
      barAktion: false, anmeldungen: ['m3', 'm4'],
    },
    {
      id: 't2', titel: 'Sommerfest mit Bar', art: 'veranstaltung', datum: datum(14), uhrzeit: '17:00',
      ort: 'Dorfplatz Neuengrün', beschreibung: 'Unser Sommerfest – Gewinnspiel-Gutscheine können an der Bar eingelöst werden!',
      barAktion: true, anmeldungen: ['m1', 'm2', 'm3'],
    },
    {
      id: 't3', titel: 'Vorstandssitzung', art: 'sitzung', datum: datum(7), uhrzeit: '19:30',
      ort: 'Pfarrheim', beschreibung: 'Planung Sommerfest, Kassenbericht.',
      barAktion: false, anmeldungen: ['m1', 'm2'],
    },
  ]

  const aufgaben = [
    { id: 'a1', titel: 'Getränke für Sommerfest bestellen', beschreibung: 'Angebot vom Getränkemarkt einholen.', zustaendig: 'm2', faellig: datum(10), erledigt: false },
    { id: 'a2', titel: 'Plakate aufhängen', beschreibung: 'Sommerfest-Plakate im Ort verteilen.', zustaendig: 'm3', faellig: datum(8), erledigt: false },
    { id: 'a3', titel: 'GEMA-Anmeldung', beschreibung: '', zustaendig: 'm1', faellig: datum(5), erledigt: true },
  ]

  const buchungen = [
    { id: 'b1', datum: datum(-30), beschreibung: 'Mitgliedsbeiträge Q2', kategorie: 'Mitgliedsbeiträge', betrag: 240 },
    { id: 'b2', datum: datum(-12), beschreibung: 'Bastelmaterial Gruppenstunde', kategorie: 'Material', betrag: -34.5 },
    { id: 'b3', datum: datum(-5), beschreibung: 'Zuschuss Kreisjugendring', kategorie: 'Zuschüsse', betrag: 150 },
  ]

  const gutscheine = [
    {
      id: 'g1', mitgliedId: 'm3', titel: 'Hauptgewinn Dorffest-Tombola', quelle: 'Tombola Dorffest Wallenfels',
      beschreibung: 'Los Nr. 112 – 1. Preis', bild: null, eingereicht: datum(-2),
      status: 'freigegeben', code: 'KJG-DEMO', rabatt: '1 Freigetränk', terminId: 't2',
      entschiedenAm: datum(-1), eingeloestAm: null, kommentar: '',
    },
  ]

  return { mitglieder, termine, aufgaben, buchungen, gutscheine }
}
