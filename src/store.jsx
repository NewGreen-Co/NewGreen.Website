/**
 * Zentraler App-Store – React-Context mit localStorage-Persistenz.
 *
 * Alle Vereinsdaten (Mitglieder, Termine, Aufgaben, Kasse, Gutscheine) liegen
 * in einem State-Objekt und werden bei jeder Änderung automatisch gespeichert.
 * Zugriff in Komponenten über `useApp()`.
 *
 * Hinweis: Die Anmeldung ist eine Demo-Profilwahl ohne Passwort. Für den
 * Produktivbetrieb mit echten Nutzerkonten wird ein Backend benötigt
 * (siehe README – z. B. Supabase oder Netlify Identity).
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { seedData, uid, generateCode, today } from './data.js'

const STORAGE_KEY = 'kjg-neuengruen-data'
const USER_KEY = 'kjg-neuengruen-user'

const AppContext = createContext(null)

/** Zugriff auf Daten & Aktionen, z. B. `const { mitglieder, actions } = useApp()` */
// eslint-disable-next-line react-refresh/only-export-components -- Hook & Provider gehören hier bewusst zusammen
export const useApp = () => useContext(AppContext)

// ─── PERSISTENZ ───────────────────────────────────────────────────────────────

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // Beschädigte Daten → mit Seed neu starten
  }
  return seedData()
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem(USER_KEY))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (currentUserId) localStorage.setItem(USER_KEY, currentUserId)
    else localStorage.removeItem(USER_KEY)
  }, [currentUserId])

  const currentUser = state.mitglieder.find((m) => m.id === currentUserId) || null
  const istVorstand = currentUser?.rolle === 'vorstand'

  /** Eine Collection (z. B. 'termine') per Funktion aktualisieren */
  const update = (key, fn) => setState((s) => ({ ...s, [key]: fn(s[key]) }))

  const actions = {
    // ── Anmeldung ──
    login: (id) => setCurrentUserId(id),
    logout: () => setCurrentUserId(null),

    // ── Mitglieder ──
    addMitglied: (data) => update('mitglieder', (l) => [...l, { ...data, id: uid('m') }]),
    updateMitglied: (id, data) =>
      update('mitglieder', (l) => l.map((m) => (m.id === id ? { ...m, ...data } : m))),
    deleteMitglied: (id) => update('mitglieder', (l) => l.filter((m) => m.id !== id)),

    // ── Termine ──
    addTermin: (data) =>
      update('termine', (l) => [...l, { ...data, id: uid('t'), anmeldungen: [] }]),
    updateTermin: (id, data) =>
      update('termine', (l) => l.map((t) => (t.id === id ? { ...t, ...data } : t))),
    deleteTermin: (id) => update('termine', (l) => l.filter((t) => t.id !== id)),
    toggleAnmeldung: (terminId, mitgliedId) =>
      update('termine', (l) =>
        l.map((t) => {
          if (t.id !== terminId) return t
          const dabei = t.anmeldungen.includes(mitgliedId)
          return {
            ...t,
            anmeldungen: dabei
              ? t.anmeldungen.filter((id) => id !== mitgliedId)
              : [...t.anmeldungen, mitgliedId],
          }
        })),

    // ── Aufgaben ──
    addAufgabe: (data) =>
      update('aufgaben', (l) => [...l, { ...data, id: uid('a'), erledigt: false }]),
    updateAufgabe: (id, data) =>
      update('aufgaben', (l) => l.map((a) => (a.id === id ? { ...a, ...data } : a))),
    deleteAufgabe: (id) => update('aufgaben', (l) => l.filter((a) => a.id !== id)),
    toggleAufgabe: (id) =>
      update('aufgaben', (l) => l.map((a) => (a.id === id ? { ...a, erledigt: !a.erledigt } : a))),

    // ── Kasse ──
    addBuchung: (data) => update('buchungen', (l) => [{ ...data, id: uid('b') }, ...l]),
    deleteBuchung: (id) => update('buchungen', (l) => l.filter((b) => b.id !== id)),

    // ── Gewinn-Gutscheine ──
    /** Mitglied reicht einen Gewinn ein (Status: eingereicht) */
    submitGutschein: (data) =>
      update('gutscheine', (l) => [
        {
          ...data, id: uid('g'), eingereicht: today(), status: 'eingereicht',
          code: null, rabatt: null, entschiedenAm: null, eingeloestAm: null, kommentar: '',
        },
        ...l,
      ]),
    /** Vorstand gibt frei – erzeugt Einlöse-Code */
    approveGutschein: (id, { rabatt, terminId }) =>
      update('gutscheine', (l) =>
        l.map((g) =>
          g.id === id
            ? { ...g, status: 'freigegeben', code: generateCode(), rabatt, terminId: terminId || null, entschiedenAm: today() }
            : g
        )),
    rejectGutschein: (id, kommentar) =>
      update('gutscheine', (l) =>
        l.map((g) =>
          g.id === id ? { ...g, status: 'abgelehnt', kommentar, entschiedenAm: today() } : g
        )),
    /** An der Bar: Code einlösen */
    redeemGutschein: (id) =>
      update('gutscheine', (l) =>
        l.map((g) =>
          g.id === id ? { ...g, status: 'eingeloest', eingeloestAm: today() } : g
        )),
    deleteGutschein: (id) => update('gutscheine', (l) => l.filter((g) => g.id !== id)),

    // ── Verwaltung ──
    /** Alle Daten auf den Demo-Stand zurücksetzen */
    resetData: () => {
      setState(seedData())
      setCurrentUserId(null)
    },
  }

  return (
    <AppContext.Provider value={{ ...state, currentUser, istVorstand, actions }}>
      {children}
    </AppContext.Provider>
  )
}
