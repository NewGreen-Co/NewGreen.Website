# KJG Neuengrün – Vereins-App

Web-App für die Organisation der **Katholischen Jugend Neuengrün**: Mitglieder,
Termine, Aufgaben und Vereinskasse an einem Ort – plus Gewinnspiel-Gutscheine,
die Mitglieder hochladen und bei Veranstaltungen an der Bar gegen vergünstigte
Getränke einlösen können.

## Funktionen

| Bereich | Beschreibung | Zugriff |
| --- | --- | --- |
| **Übersicht** | Kennzahlen, nächste Termine, offene Aufgaben & Gutscheine | Alle |
| **Termine** | Veranstaltungen, Gruppenstunden, Sitzungen – mit An-/Abmeldung. Termine können als „Bar-Aktion" markiert werden | Alle (Anlegen: Vorstand) |
| **Aufgaben** | To-dos mit Zuständigkeit & Fälligkeit | Alle (Anlegen: Vorstand) |
| **Gewinnspiele** | Mitglieder reichen Gewinne mit Foto ein, der Vorstand gibt sie mit Rabatt frei und es wird ein Einlöse-Code erzeugt | Alle |
| **Mitglieder** | Stammdaten, Rollen (Vorstand/Mitglied) & Ämter | Nur Vorstand |
| **Kasse** | Einnahmen/Ausgaben mit Kategorien & Kassenstand | Nur Vorstand |
| **Bar-Modus** | Code-Eingabe direkt an der Bar: prüfen → einlösen, mit Tagesliste | Nur Vorstand |

### Gutschein-Ablauf

```
Mitglied reicht Gewinn ein  →  Vorstand prüft  →  Code KJG-XXXX wird erzeugt
        (eingereicht)            (freigegeben)
                                                  →  Bar-Modus: Code eingeben
                                                          (eingelöst)
```

## Stack

- [React 19](https://react.dev) + [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Lucide React](https://lucide.dev) (Icons)
- [React Router v7](https://reactrouter.com)

## Entwicklung

```bash
npm install
npm run dev      # Entwicklungsserver
npm run lint     # ESLint
npm run build    # Produktions-Build nach dist/
```

## Deployment auf Netlify

Das Repository ist Netlify-ready (`netlify.toml` + SPA-Redirect):

1. Auf [netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
2. Repository auswählen – Build-Befehl (`npm run build`) und Publish-Ordner (`dist`)
   werden automatisch aus `netlify.toml` übernommen
3. **Deploy** – fertig

## Daten & Anmeldung (wichtig)

Die App speichert alle Daten **lokal im Browser** (`localStorage`) und nutzt
eine **Demo-Profilwahl ohne Passwort**. Das ist ideal zum Ausprobieren und für
den Einsatz auf einem einzelnen Geräte (z. B. Vereins-Tablet an der Bar).

Für den Mehrbenutzer-Produktivbetrieb (jedes Mitglied mit eigenem Konto auf dem
eigenen Handy) wird ein Backend benötigt. Empfehlung: [Supabase](https://supabase.com)
(Auth + Postgres + Storage für die Gewinn-Fotos) – die Store-Schicht in
`src/store.jsx` ist bewusst so geschnitten, dass die Aktionen 1:1 auf
API-Aufrufe umgestellt werden können.

## Projektstruktur

```
src/
├── main.jsx              # Einstieg (Router + AppProvider)
├── App.jsx               # Layout, Navigation, Login, Routing
├── store.jsx             # Zentraler State + localStorage-Persistenz
├── data.js               # Konstanten, Hilfsfunktionen, Seed-Daten
├── ui.jsx                # Wiederverwendbare UI-Bausteine
├── DashboardPage.jsx     # Übersicht
├── TerminePage.jsx       # Termine & Anmeldungen
├── AufgabenPage.jsx      # Aufgabenverwaltung
├── GewinnspielePage.jsx  # Gewinne einreichen & freigeben
├── MitgliederPage.jsx    # Mitgliederverwaltung (Vorstand)
├── KassePage.jsx         # Vereinskasse (Vorstand)
└── BarPage.jsx           # Bar-Modus: Codes einlösen (Vorstand)
```
