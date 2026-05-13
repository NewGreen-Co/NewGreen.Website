import { Link } from 'react-router-dom'
import { i18n } from './data.js'

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-1">{children}</div>
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

export default function ImpressumPage({ lang }) {
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
            Impressum
          </h1>
          <p className="text-gray-500 text-sm">Angaben gemäß § 5 TMG</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Hinweis auf Platzhalter */}
          <div className="mb-10 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
            <strong>Hinweis:</strong> Alle <span className="font-mono bg-amber-100 px-1 rounded">▶ markierten ◀</span> Felder müssen vor dem Launch mit den tatsächlichen Angaben befüllt werden.
          </div>

          <Section title="Angaben zum Unternehmen">
            <p><Placeholder>▶ Vollständiger Firmenname, z.B. NewGreen Group GmbH ◀</Placeholder></p>
            <p><Placeholder>▶ Straße und Hausnummer ◀</Placeholder></p>
            <p><Placeholder>▶ PLZ Ort ◀</Placeholder></p>
            <p>Deutschland</p>
          </Section>

          <Section title="Vertreten durch">
            <p><Placeholder>▶ Name des Geschäftsführers / der Geschäftsführerin ◀</Placeholder></p>
          </Section>

          <Section title="Kontakt">
            <p>E-Mail: <a href="mailto:hello@newgreen.group" className="text-slate-600 hover:text-slate-900 transition-colors">hello@newgreen.group</a></p>
            <p>Telefon: <Placeholder>▶ +49 (0) ... ◀</Placeholder></p>
          </Section>

          <Section title="Registereintrag">
            <p>Eintragung im Handelsregister.</p>
            <p>Registergericht: <Placeholder>▶ Amtsgericht ..., z.B. Amtsgericht Bayreuth ◀</Placeholder></p>
            <p>Registernummer: <Placeholder>▶ HRB ... ◀</Placeholder></p>
            <p className="mt-2 text-gray-400 text-xs italic">
              (Nur ausfüllen, wenn das Unternehmen im Handelsregister eingetragen ist. Für Einzelunternehmen/GbR entfällt dieser Abschnitt.)
            </p>
          </Section>

          <Section title="Umsatzsteuer-Identifikationsnummer">
            <p>Gemäß § 27a Umsatzsteuergesetz:</p>
            <p><Placeholder>▶ DE... ◀</Placeholder></p>
            <p className="mt-2 text-gray-400 text-xs italic">
              (Nur erforderlich, wenn das Unternehmen umsatzsteuerpflichtig ist und grenzüberschreitend tätig ist.)
            </p>
          </Section>

          <Section title="Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV">
            <p><Placeholder>▶ Vorname Nachname ◀</Placeholder></p>
            <p><Placeholder>▶ Straße und Hausnummer ◀</Placeholder></p>
            <p><Placeholder>▶ PLZ Ort ◀</Placeholder></p>
          </Section>

          <Section title="Haftungsausschluss">
            <p className="mb-3">
              <strong className="text-gray-700">Haftung für Inhalte:</strong> Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="mb-3">
              <strong className="text-gray-700">Haftung für Links:</strong> Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
            <p>
              <strong className="text-gray-700">Urheberrecht:</strong> Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </Section>

        </div>
      </section>
    </div>
  )
}
