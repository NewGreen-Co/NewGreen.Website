import { Link } from 'react-router-dom'
import { i18n } from './data.js'

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  )
}

function Placeholder({ children }) {
  return (
    <span className="inline-block bg-amber-50 border border-amber-200 text-amber-700 text-xs px-2 py-0.5 rounded font-mono">
      {children}
    </span>
  )
}

export default function DatenschutzPage({ lang }) {
  const t = i18n[lang]

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-16 px-6 bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-xs text-gray-500 hover:text-gray-300 tracking-wider uppercase mb-10 transition-colors"
          >
            {t.nav.backToHome}
          </Link>
          <h1 className="text-4xl sm:text-5xl font-light text-white tracking-tight mb-3">
            Datenschutzerklärung
          </h1>
          <p className="text-gray-500 text-sm">Gemäß DSGVO (EU) 2016/679</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <div className="mb-10 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
            <strong>Hinweis:</strong> Alle <span className="font-mono bg-amber-100 px-1 rounded">▶ markierten ◀</span> Felder müssen vor dem Launch mit den tatsächlichen Angaben befüllt werden.
          </div>

          <Section title="1. Verantwortlicher">
            <p>Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
            <p>
              <Placeholder>▶ Vollständiger Firmenname ◀</Placeholder><br />
              <Placeholder>▶ Straße und Hausnummer ◀</Placeholder><br />
              <Placeholder>▶ PLZ Ort ◀</Placeholder><br />
              Deutschland<br />
              E-Mail: <a href="mailto:hello@newgreen.group" className="text-slate-600 hover:text-slate-900 transition-colors">hello@newgreen.group</a>
            </p>
          </Section>

          <Section title="2. Arten der verarbeiteten Daten">
            <p>Auf dieser Website werden folgende Kategorien personenbezogener Daten verarbeitet:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Kommunikationsdaten:</strong> Wenn Sie uns per E-Mail kontaktieren, speichern wir Ihre E-Mail-Adresse sowie die Inhalte Ihrer Nachricht zum Zweck der Bearbeitung Ihrer Anfrage.</li>
              <li><strong>Zugriffsdaten:</strong> Unser Hosting-Anbieter erhebt automatisch technische Daten (IP-Adresse, Browser-Typ, Datum und Uhrzeit des Zugriffs). Diese werden ausschließlich zur Sicherstellung des Betriebs genutzt und nicht zu Ihrer Person verknüpft.</li>
            </ul>
            <p className="text-gray-500 italic">
              Diese Website setzt keine Cookies ein und verwendet keine Tracking- oder Analyse-Tools (z.B. Google Analytics).
            </p>
          </Section>

          <Section title="3. Hosting">
            <p>Diese Website wird gehostet bei:</p>
            <p>
              <Placeholder>▶ Name des Hosting-Anbieters, z.B. Hetzner Online GmbH ◀</Placeholder><br />
              <Placeholder>▶ Adresse des Hosters ◀</Placeholder>
            </p>
            <p>
              Mit dem Hosting-Anbieter besteht ein Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO. Die Server befinden sich <Placeholder>▶ in Deutschland / innerhalb der EU ◀</Placeholder>.
            </p>
          </Section>

          <Section title="4. Kontaktaufnahme per E-Mail">
            <p>
              Wenn Sie uns per E-Mail kontaktieren, werden die von Ihnen übermittelten Daten (Ihre E-Mail-Adresse, ggf. Ihr Name und Ihre Telefonnummer sowie der Inhalt Ihrer Nachricht) zum Zweck der Bearbeitung Ihrer Anfrage und für den Fall von Anschlussfragen verarbeitet und gespeichert.
            </p>
            <p>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung bzw. vorvertragliche Maßnahmen) oder Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen).
            </p>
            <p>
              Ihre Daten werden nach abschließender Bearbeitung Ihrer Anfrage gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
            </p>
          </Section>

          <Section title="5. Keine Weitergabe an Dritte">
            <p>
              Wir geben Ihre personenbezogenen Daten nicht an Dritte weiter, es sei denn, dies ist zur Erfüllung des Vertrags erforderlich, Sie haben ausdrücklich eingewilligt oder wir sind gesetzlich dazu verpflichtet.
            </p>
          </Section>

          <Section title="6. Ihre Rechte als betroffene Person">
            <p>Sie haben nach der DSGVO folgende Rechte gegenüber uns:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO): Sie können Auskunft über die zu Ihrer Person gespeicherten Daten verlangen.</li>
              <li><strong>Berichtigungsrecht</strong> (Art. 16 DSGVO): Sie können die Berichtigung unrichtiger Daten verlangen.</li>
              <li><strong>Löschungsrecht</strong> (Art. 17 DSGVO): Sie können die Löschung Ihrer Daten verlangen, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
              <li><strong>Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO): Sie können die eingeschränkte Verarbeitung Ihrer Daten verlangen.</li>
              <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO): Sie können der Verarbeitung Ihrer Daten widersprechen.</li>
              <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO): Sie können Ihre Daten in einem strukturierten, gängigen Format erhalten.</li>
            </ul>
            <p>
              Um Ihre Rechte auszuüben, wenden Sie sich bitte an: <a href="mailto:hello@newgreen.group" className="text-slate-600 hover:text-slate-900 transition-colors">hello@newgreen.group</a>
            </p>
          </Section>

          <Section title="7. Beschwerderecht bei der Aufsichtsbehörde">
            <p>
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren. Die zuständige Aufsichtsbehörde für Bayern ist:
            </p>
            <p>
              Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)<br />
              Promenade 18<br />
              91522 Ansbach<br />
              <a href="https://www.lda.bayern.de" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 transition-colors">www.lda.bayern.de</a>
            </p>
          </Section>

          <Section title="8. Aktualität dieser Datenschutzerklärung">
            <p>
              Diese Datenschutzerklärung ist aktuell gültig und hat den Stand <Placeholder>▶ Monat Jahr, z.B. Mai 2025 ◀</Placeholder>.
              Durch die Weiterentwicklung unserer Website oder aufgrund geänderter gesetzlicher bzw. behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern.
            </p>
          </Section>

        </div>
      </section>
    </div>
  )
}
