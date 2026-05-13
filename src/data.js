/**
 * Zentrale Datendatei – Übersetzungen & Firmendaten.
 * Neue Tochtergesellschaft: Objekt in `getSubsidiaries` eintragen.
 * Neue Seite erscheint dann automatisch im Dropdown und unter /unternehmen/:id
 */

import { Cpu, ShoppingBag, Heart, Truck, RefreshCw, Building2, TrendingUp, Trophy, Scale } from 'lucide-react'

// ─── ÜBERSETZUNGEN ────────────────────────────────────────────────────────────

export const i18n = {
  de: {
    nav: {
      about: 'Über uns',
      companies: 'Unternehmen',
      values: 'Arbeitsweise',
      contact: 'Kontakt',
      cta: 'Kontakt aufnehmen',
      backToHome: '← Zurück zur Startseite',
    },
    hero: {
      eyebrow: 'Internationale Unternehmensgruppe · Gegr. Neuengrün',
      headline: 'NewGreen Group –',
      headlineAccent: 'Die Zukunft gestalten.',
      subline:
        'Eine globale Holding von Technologieunternehmen, verwurzelt im Ort Neuengrün. Wir entwickeln Produkte, die zählen — mit der Geschwindigkeit, die die Welt verlangt.',
      cta1: 'Unsere Unternehmen entdecken',
      cta2: 'Unsere Geschichte',
      scroll: 'Scrollen',
      imageCaption: 'Neuengrün, Bayern — unser Ursprung.',
    },
    about: {
      eyebrow: 'Unsere Herkunft',
      heading: ['Von ', 'Neuengrün', ' in die Welt.'],
      p1: 'Neuengrün ist unser Ursprung — ein Ortsname, der zur Marke wurde. Die Werte dieser Region: Präzision, Verlässlichkeit und unternehmerischer Mut haben uns von Anfang an geprägt.',
      p2: 'Die Marke NewGreen überträgt dieses Erbe in internationale Märkte. Der Name ist Programm: ein klarer Anspruch, ambitioniertes Wachstum und der Mut, zu bauen, was noch nicht existiert.',
      stats: {
        founded: 'Gegründet',
        scale: 'Globaler Anspruch',
        tech: 'Kerntechnologie',
        commitment: 'Engagement',
      },
    },
    subsidiaries: {
      eyebrow: 'Unser Portfolio',
      heading: 'Die Unternehmen',
      subline:
        'Jede Tochtergesellschaft agiert eigenständig und mit klarem Fokus auf ihre Domäne — vereint durch das NewGreen-Ethos.',
      placeholder: {
        title: 'Weitere folgen',
        sub: 'Neue Ventures sind stets in Planung.',
      },
      learnMore: 'Mehr erfahren',
      comingSoon: 'Bald verfügbar',
    },
    values: {
      eyebrow: 'Unsere Arbeitsweise',
      heading: 'Agil aus Überzeugung.',
      headingAccent: 'KI als Fundament.',
      subline:
        'Unser Betriebsmodell basiert auf Prinzipien, die es modernen Technologieunternehmen ermöglichen, Etablierte zu überholen — ohne Qualitätseinbußen.',
      items: [
        {
          title: 'Radikale Agilität',
          text: 'Zweiwöchige Sprints, kontinuierliches Deployment und konsequente Priorisierung halten uns schneller als den Markt.',
        },
        {
          title: 'KI-First-Denken',
          text: 'Jede Produktentscheidung wird durch maschinelle Intelligenz unterstützt. Wir behandeln KI als Teammitglied, nicht als Werkzeug.',
        },
        {
          title: 'Global von Anfang an',
          text: 'Von der ersten Zeile Code an denken wir in internationaler Skalierung, mehreren Sprachen und diversen Märkten.',
        },
        {
          title: 'Kompromisslose Qualität',
          text: 'Geschwindigkeit ohne Disziplin ist Chaos. Unsere Engineering-Standards sichern, dass das, was wir liefern, hält.',
        },
      ],
    },
    footer: {
      heading: 'Bereit,',
      headingAccent: 'gemeinsam zu bauen?',
      subline:
        'Ob potenzieller Partner, Talent oder Investor — wir freuen uns auf Ihre Nachricht.',
      companiesLabel: 'Unternehmen',
      connectLabel: 'Verbinden',
      legalLabel: 'Rechtliches',
      impressum: 'Impressum',
      datenschutz: 'Datenschutz',
      copyright: `© ${new Date().getFullYear()} NewGreen Group of Companies. Alle Rechte vorbehalten.`,
      tagline: 'Verwurzelt in Neuengrün · Global im Einsatz',
    },
    subsidiaryPage: {
      backLabel: '← Zur Übersicht',
      contactHeading: 'Interesse geweckt?',
      contactSub: 'Sprechen Sie uns an — wir antworten innerhalb von 24 Stunden.',
      contactBtn: 'Jetzt Kontakt aufnehmen',
      servicesLabel: 'Leistungen',
      servicesHeading: 'Was wir bieten',
      whyLabel: 'Warum wir',
    },
  },

  en: {
    nav: {
      about: 'About',
      companies: 'Companies',
      values: 'Values',
      contact: 'Contact',
      cta: 'Get in Touch',
      backToHome: '← Back to Home',
    },
    hero: {
      eyebrow: 'International Holdings · Est. Neuengrün',
      headline: 'NewGreen Group –',
      headlineAccent: 'Engineering Tomorrow.',
      subline:
        'A global holding of technology companies rooted in the town of Neuengrün. We build products that matter, at the speed the world demands.',
      cta1: 'Explore Our Companies',
      cta2: 'Our Story',
      scroll: 'Scroll',
      imageCaption: 'Neuengrün, Bavaria — our origin.',
    },
    about: {
      eyebrow: 'Our Origin',
      heading: ['From ', 'Neuengrün', ' to the world.'],
      p1: 'Neuengrün is our origin — a place name that became a brand. The values of this region — precision, reliability, and entrepreneurial courage — have shaped us from the start.',
      p2: 'The brand NewGreen carries that heritage into global markets. The name is a statement: clear ambition, bold growth, and the courage to build what doesn\'t yet exist.',
      stats: {
        founded: 'Founded',
        scale: 'Global Ambition',
        tech: 'Core Technology',
        commitment: 'Commitment',
      },
    },
    subsidiaries: {
      eyebrow: 'Our Portfolio',
      heading: 'The Companies',
      subline:
        'Each subsidiary operates with full autonomy and an unwavering focus on its domain — united by the NewGreen ethos.',
      placeholder: {
        title: 'More to come',
        sub: 'New ventures are always in the pipeline.',
      },
      learnMore: 'Learn more',
      comingSoon: 'Coming Soon',
    },
    values: {
      eyebrow: 'How We Work',
      heading: 'Agile by nature.',
      headingAccent: 'AI by design.',
      subline:
        'Our operating model is built around the principles that allow modern technology companies to outpace incumbents without sacrificing quality.',
      items: [
        {
          title: 'Radical Agility',
          text: 'Two-week sprints, continuous deployment, and ruthless prioritisation keep us moving faster than the market.',
        },
        {
          title: 'AI-First Mindset',
          text: 'Every product decision is augmented by machine intelligence. We treat AI as a team member, not a tool.',
        },
        {
          title: 'Global by Default',
          text: 'From the first line of code we design for international scale, multiple languages, and diverse markets.',
        },
        {
          title: 'Uncompromising Quality',
          text: 'Speed without discipline is chaos. Our engineering standards ensure what ships stays shipped.',
        },
      ],
    },
    footer: {
      heading: 'Ready to build',
      headingAccent: 'something new?',
      subline:
        'Whether you\'re a potential partner, talent, or investor — we\'d love to hear from you.',
      companiesLabel: 'Companies',
      connectLabel: 'Connect',
      legalLabel: 'Legal',
      impressum: 'Imprint',
      datenschutz: 'Privacy Policy',
      copyright: `© ${new Date().getFullYear()} NewGreen Group of Companies. All rights reserved.`,
      tagline: 'Rooted in Neuengrün · Operating Globally',
    },
    subsidiaryPage: {
      backLabel: '← Back to Overview',
      contactHeading: 'Interested?',
      contactSub: 'Get in touch — we respond within 24 hours.',
      contactBtn: 'Contact Us Now',
      servicesLabel: 'Services',
      servicesHeading: 'What we offer',
      whyLabel: 'Why Us',
    },
  },
}

// ─── FIRMENDATEN ──────────────────────────────────────────────────────────────

/**
 * Alle Tochtergesellschaften.
 * accentColor: 'green' | 'silver'
 * Die `page`-Felder werden nur auf der Detailseite genutzt.
 */
export const getSubsidiaries = (lang) => [
  {
    id: 'newgreen-software',
    name: 'NewGreen Software',
    tagline:
      lang === 'de' ? 'KI-gestützt. Menschenzentriert.' : 'AI-Driven. Human-Centred.',
    description:
      lang === 'de'
        ? 'Wir entwickeln personalisierte Anwendungen mit hoher Geschwindigkeit, angetrieben von modernster KI. Von der Idee bis zur Produktion in Rekordzeit – ohne Abstriche bei der Qualität.'
        : 'We build personalised applications at high speed, powered by cutting-edge AI. From ideation to production in record time – without compromising on quality.',
    tags:
      lang === 'de'
        ? ['Personalisierte Apps', 'KI-Entwicklung', 'High-Speed Delivery']
        : ['Personalised Apps', 'AI Development', 'High-Speed Delivery'],
    icon: Cpu,
    accentColor: 'green',
    href: '/unternehmen/newgreen-software',
    logo: '/NewGreen-Software.jpg',
    page: {
      heroTagline:
        lang === 'de'
          ? 'Software, die auf Sie zugeschnitten ist.'
          : 'Software built around you.',
      longDescription:
        lang === 'de'
          ? 'NewGreen Software ist die Technologiesparte der NewGreen Group. Wir entwickeln maßgeschneiderte Softwarelösungen, die modernste KI mit hoher Liefergeschwindigkeit verbinden. Unser Anspruch: Produkte, die echte Probleme lösen — schön, schnell und zuverlässig.'
          : 'NewGreen Software is the technology arm of the NewGreen Group. We develop bespoke software solutions that combine state-of-the-art AI with high delivery speed. Our goal: products that solve real problems — elegant, fast, and dependable.',
      services:
        lang === 'de'
          ? [
              {
                title: 'Personalisierte Apps',
                desc: 'Web- und Mobilanwendungen, die exakt auf Ihre Nutzer und Prozesse zugeschnitten sind — kein Off-the-Shelf, sondern echter Maßanzug.',
              },
              {
                title: 'KI-Integration',
                desc: 'Wir integrieren Large Language Models, Computer Vision und Predictive Analytics direkt in Ihre bestehenden Systeme oder neue Produkte.',
              },
              {
                title: 'High-Speed Delivery',
                desc: 'Vom ersten Gespräch zur produktionsfertigen Software in Wochen, nicht Monaten — durch konsequente Agilität und Automatisierung.',
              },
              {
                title: 'Technologie-Beratung',
                desc: 'Architektur-Reviews, Tech-Stack-Entscheidungen und KI-Readiness-Assessments für Ihr Unternehmen.',
              },
            ]
          : [
              {
                title: 'Personalised Apps',
                desc: 'Web and mobile applications tailored precisely to your users and processes — not off-the-shelf, but bespoke.',
              },
              {
                title: 'AI Integration',
                desc: 'We integrate large language models, computer vision, and predictive analytics directly into your existing systems or new products.',
              },
              {
                title: 'High-Speed Delivery',
                desc: 'From first conversation to production-ready software in weeks, not months — through rigorous agility and automation.',
              },
              {
                title: 'Technology Consulting',
                desc: 'Architecture reviews, tech stack decisions, and AI readiness assessments for your organisation.',
              },
            ],
      reasons:
        lang === 'de'
          ? [
              { value: '< 4 Wo.', label: 'Ø Zeit bis MVP' },
              { value: 'KI-Native', label: 'Entwicklungsansatz' },
              { value: '100%', label: 'Maßgeschneidert' },
              { value: '24h', label: 'Reaktionszeit' },
            ]
          : [
              { value: '< 4 wks', label: 'Avg. time to MVP' },
              { value: 'AI-Native', label: 'Dev approach' },
              { value: '100%', label: 'Bespoke' },
              { value: '24h', label: 'Response time' },
            ],
    },
  },

  {
    id: 'newgreen-foods',
    name: 'NewGreen Foods',
    tagline:
      lang === 'de' ? 'Frisch. Regional. Zukunftsorientiert.' : 'Fresh. Regional. Forward-thinking.',
    description:
      lang === 'de'
        ? 'NewGreen Foods steht für moderne Ernährungskonzepte — von der Produktion bis zum Regal. Wir verbinden regionale Qualität mit digitalem Vertrieb und nachhaltigen Lieferketten.'
        : 'NewGreen Foods reimagines modern food concepts — from production to shelf. We combine regional quality with digital distribution and sustainable supply chains.',
    tags:
      lang === 'de'
        ? ['Lebensmittel', 'Nachhaltigkeit', 'Digitalvertrieb']
        : ['Food & FMCG', 'Sustainability', 'Digital Distribution'],
    icon: ShoppingBag,
    accentColor: 'amber',
    href: '/unternehmen/newgreen-foods',
    logo: '/NewGreen-Foods.jpg',
    comingSoon: true,
  },

  {
    id: 'newgreen-home-care',
    name: 'NewGreen Home & Care',
    tagline:
      lang === 'de' ? 'Zuhause. Wohlbefinden. Vertrauen.' : 'Home. Wellbeing. Trust.',
    description:
      lang === 'de'
        ? 'NewGreen Home & Care entwickelt Produkte und Services rund um Haushalt, Pflege und persönliches Wohlbefinden — mit klarem Qualitätsanspruch und modernem Design.'
        : 'NewGreen Home & Care develops products and services around home, care, and personal wellbeing — with uncompromising quality and modern design.',
    tags:
      lang === 'de'
        ? ['Hauspflege', 'Wellness', 'Consumer Goods']
        : ['Home Care', 'Wellness', 'Consumer Goods'],
    icon: Heart,
    accentColor: 'terracotta',
    href: '/unternehmen/newgreen-home-care',
    logo: '/NewGreen-Home&Care.jpg',
    comingSoon: true,
  },

  {
    id: 'newgreen-mobility',
    name: 'NewGreen Mobility',
    tagline:
      lang === 'de' ? 'Mobilität neu gedacht.' : 'Redefining Mobility.',
    description:
      lang === 'de'
        ? 'NewGreen Mobility entwickelt intelligente Transportlösungen für eine vernetzte Welt. Von der letzten Meile bis zur Flottensteuerung — digital, effizient und skalierbar.'
        : 'NewGreen Mobility develops intelligent transport solutions for a connected world. From last-mile delivery to fleet management — digital, efficient, and scalable.',
    tags:
      lang === 'de'
        ? ['Transport', 'Flottenmanagement', 'Smart Logistics']
        : ['Transport', 'Fleet Management', 'Smart Logistics'],
    icon: Truck,
    accentColor: 'blue',
    href: '/unternehmen/newgreen-mobility',
    logo: '/NewGreen-Mobility.jpg',
    comingSoon: true,
  },

  {
    id: 'newgreen-circular',
    name: 'NewGreen Circular',
    tagline:
      lang === 'de' ? 'Kreislauf. Ressourcen. Zukunft.' : 'Circular. Resources. Future.',
    description:
      lang === 'de'
        ? 'NewGreen Circular entwickelt Konzepte für die Kreislaufwirtschaft — von Reparatur und Wiederverwendung bis zur nachhaltigen Materialverwertung. Wir machen aus Abfall echten Wert.'
        : 'NewGreen Circular develops circular economy concepts — from repair and reuse to sustainable material recovery. We turn waste into real value.',
    tags:
      lang === 'de'
        ? ['Kreislaufwirtschaft', 'Nachhaltigkeit', 'Reparatur']
        : ['Circular Economy', 'Sustainability', 'Repair & Reuse'],
    icon: RefreshCw,
    accentColor: 'teal',
    href: '/unternehmen/newgreen-circular',
    logo: '/NewGreen-Circular.jpg',
    comingSoon: true,
  },

  {
    id: 'newgreen-immo',
    name: 'NewGreen Immo',
    tagline:
      lang === 'de' ? 'Immobilien. Entwicklung. Wert schaffen.' : 'Property. Development. Creating Value.',
    description:
      lang === 'de'
        ? 'NewGreen Immo entwickelt, verwaltet und saniert Immobilien mit klarem Fokus auf Qualität und Werterhalt — von der Bestandssanierung bis zur Neubauentwicklung.'
        : 'NewGreen Immo develops, manages, and renovates properties with an unwavering focus on quality and value — from refurbishment projects to new builds.',
    tags:
      lang === 'de'
        ? ['Immobilien', 'Sanierung', 'Projektentwicklung']
        : ['Real Estate', 'Renovation', 'Property Development'],
    icon: Building2,
    accentColor: 'bronze',
    href: '/unternehmen/newgreen-immo',
    logo: '/NewGreen-Immo.jpg',
    comingSoon: true,
  },

  {
    id: 'newgreen-regioinvest',
    name: 'NewGreen RegioInvest',
    tagline:
      lang === 'de' ? 'Regional investieren. Nachhaltig wachsen.' : 'Invest locally. Grow sustainably.',
    description:
      lang === 'de'
        ? 'NewGreen RegioInvest bündelt Kapital für regional verwurzelte Projekte mit globalem Potenzial. Wir verbinden lokale Investitionen mit nachhaltigen Renditeerwartungen.'
        : 'NewGreen RegioInvest pools capital for regionally rooted projects with global potential. We connect local investments with sustainable return expectations.',
    tags:
      lang === 'de'
        ? ['Investment', 'Regionalfonds', 'Nachhaltigkeit']
        : ['Investment', 'Regional Fund', 'Sustainability'],
    icon: TrendingUp,
    accentColor: 'gold',
    href: '/unternehmen/newgreen-regioinvest',
    logo: '/NewGreen-RegioInvest.jpg',
    comingSoon: true,
  },

  {
    id: 'newgreen-sport',
    name: 'NewGreen Sport',
    tagline:
      lang === 'de' ? 'Performance. Leidenschaft. Erfolg.' : 'Performance. Passion. Success.',
    description:
      lang === 'de'
        ? 'NewGreen Sport gestaltet die Zukunft des Sports — von digitalen Fan-Erlebnissen bis zum Sportstätten-Management. Wir bringen Technologie und Leidenschaft zusammen.'
        : 'NewGreen Sport shapes the future of sports — from digital fan experiences to venue management. We bring technology and passion together.',
    tags:
      lang === 'de'
        ? ['Sport', 'Events', 'Sporttechnologie']
        : ['Sports', 'Events', 'Sports Technology'],
    icon: Trophy,
    accentColor: 'crimson',
    href: '/unternehmen/newgreen-sport',
    logo: '/NewGreen-Sport.jpg',
    comingSoon: true,
  },

  {
    id: 'newgreen-smartconsult-tax',
    name: 'NewGreen SmartConsult Tax',
    tagline:
      lang === 'de' ? 'Steuerberatung. Digital. Präzise.' : 'Tax Advisory. Digital. Precise.',
    description:
      lang === 'de'
        ? 'NewGreen SmartConsult Tax bietet moderne Steuer- und Unternehmensberatung — digital, schnell und auf höchstem fachlichem Niveau. Ihr Partner für komplexe Steuerfragen.'
        : 'NewGreen SmartConsult Tax provides modern tax and business consulting — digital, fast, and at the highest professional standard. Your partner for complex tax matters.',
    tags:
      lang === 'de'
        ? ['Steuerberatung', 'Unternehmensberatung', 'Digital']
        : ['Tax Advisory', 'Business Consulting', 'Digital'],
    icon: Scale,
    accentColor: 'forest',
    href: '/unternehmen/newgreen-smartconsult-tax',
    logo: '/NewGreen-Tax.jpg',
    comingSoon: true,
  },
]

// ─── FARB-MAPPING ─────────────────────────────────────────────────────────────

export const accentMap = {
  green: {
    bar: 'bg-green-500',
    iconBg: 'bg-green-500/10',
    iconText: 'text-green-500',
    tagline: 'text-green-600',
    tag: 'bg-green-500/10 text-green-700 border border-green-500/20',
    link: 'text-green-600',
    glow: 'bg-green-400/10',
    border: 'border-green-500/30',
    statIcon: 'text-green-400',
  },
  silver: {
    bar: 'bg-slate-400',
    iconBg: 'bg-slate-100',
    iconText: 'text-slate-500',
    tagline: 'text-slate-500',
    tag: 'bg-slate-100 text-slate-600 border border-slate-200',
    link: 'text-slate-500',
    glow: 'bg-slate-300/15',
    border: 'border-slate-400/30',
    statIcon: 'text-slate-400',
  },
  amber: {
    bar: 'bg-amber-500',
    iconBg: 'bg-amber-500/10',
    iconText: 'text-amber-600',
    tagline: 'text-amber-600',
    tag: 'bg-amber-500/10 text-amber-700 border border-amber-500/20',
    link: 'text-amber-600',
    glow: 'bg-amber-400/10',
    border: 'border-amber-500/30',
    statIcon: 'text-amber-500',
  },
  terracotta: {
    bar: 'bg-orange-700',
    iconBg: 'bg-orange-600/10',
    iconText: 'text-orange-700',
    tagline: 'text-orange-700',
    tag: 'bg-orange-600/10 text-orange-800 border border-orange-600/20',
    link: 'text-orange-700',
    glow: 'bg-orange-400/10',
    border: 'border-orange-600/30',
    statIcon: 'text-orange-500',
  },
  blue: {
    bar: 'bg-blue-600',
    iconBg: 'bg-blue-500/10',
    iconText: 'text-blue-600',
    tagline: 'text-blue-600',
    tag: 'bg-blue-500/10 text-blue-700 border border-blue-500/20',
    link: 'text-blue-600',
    glow: 'bg-blue-400/10',
    border: 'border-blue-500/30',
    statIcon: 'text-blue-500',
  },
  teal: {
    bar: 'bg-teal-600',
    iconBg: 'bg-teal-500/10',
    iconText: 'text-teal-600',
    tagline: 'text-teal-600',
    tag: 'bg-teal-500/10 text-teal-700 border border-teal-500/20',
    link: 'text-teal-600',
    glow: 'bg-teal-400/10',
    border: 'border-teal-500/30',
    statIcon: 'text-teal-500',
  },
  bronze: {
    bar: 'bg-amber-700',
    iconBg: 'bg-amber-700/10',
    iconText: 'text-amber-700',
    tagline: 'text-amber-700',
    tag: 'bg-amber-700/10 text-amber-800 border border-amber-700/20',
    link: 'text-amber-700',
    glow: 'bg-amber-600/10',
    border: 'border-amber-700/30',
    statIcon: 'text-amber-600',
  },
  gold: {
    bar: 'bg-yellow-500',
    iconBg: 'bg-yellow-500/10',
    iconText: 'text-yellow-600',
    tagline: 'text-yellow-600',
    tag: 'bg-yellow-500/10 text-yellow-700 border border-yellow-500/20',
    link: 'text-yellow-600',
    glow: 'bg-yellow-400/10',
    border: 'border-yellow-500/30',
    statIcon: 'text-yellow-500',
  },
  crimson: {
    bar: 'bg-red-700',
    iconBg: 'bg-red-600/10',
    iconText: 'text-red-700',
    tagline: 'text-red-700',
    tag: 'bg-red-600/10 text-red-800 border border-red-600/20',
    link: 'text-red-700',
    glow: 'bg-red-400/10',
    border: 'border-red-600/30',
    statIcon: 'text-red-500',
  },
  forest: {
    bar: 'bg-emerald-700',
    iconBg: 'bg-emerald-600/10',
    iconText: 'text-emerald-700',
    tagline: 'text-emerald-700',
    tag: 'bg-emerald-600/10 text-emerald-800 border border-emerald-600/20',
    link: 'text-emerald-700',
    glow: 'bg-emerald-400/10',
    border: 'border-emerald-600/30',
    statIcon: 'text-emerald-500',
  },
}
