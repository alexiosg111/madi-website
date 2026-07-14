import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  Clock,
  Compass,
  HeartPulse,
  Mail,
  MapPin,
  Menu,
  Microscope,
  Phone,
  Pill,
  ScanLine,
  Stethoscope,
  Sun,
  X,
} from "lucide-react";

type NavItem = { label: string; href: string };
const NAV: NavItem[] = [
  { label: "Praxis", href: "#praxis" },
  { label: "Leistungen", href: "#leistungen" },
  { label: "Diagnostik", href: "#diagnostik" },
  { label: "Sprechzeiten", href: "#sprechzeiten" },
  { label: "Kontakt", href: "#kontakt" },
];

const SERVICES = [
  {
    n: "01",
    title: "Gastroskopie",
    sub: "Ösophago-Gastro-Duodenoskopie (ÖGD)",
    body:
      "Diagnostische und therapeutische Spiegelung von Speiseröhre, Magen und Zwölffingerdarm — ambulant, mit schonender Sedierung und moderner HD-Technik.",
    icon: ScanLine,
  },
  {
    n: "02",
    title: "Koloskopie",
    sub: "Darmspiegelung & Vorsorge",
    body:
      "Vorsorge- und Kontroll-Koloskopie mit Polypektomie. Abklärung von Beschwerden, CED-Verlaufskontrollen und Früherkennung kolorektaler Karzinome.",
    icon: Microscope,
  },
  {
    n: "03",
    title: "Sonographie",
    sub: "Abdomen & Bauchgefäße",
    body:
      "Hochauflösender Ultraschall der Bauchgefäße, Oberbauchorgane und der Weichteile — nicht-invasiv, ohne Strahlenbelastung.",
    icon: Activity,
  },
  {
    n: "04",
    title: "Kapselendoskopie",
    sub: "Dünndarm-Diagnostik",
    body:
      "Schluckbare Miniatursonde zur ambulanten Untersuchung des Dünndarms. Sinnvoll bei unklarer Anämie, Verdacht auf Morbus Crohn oder okkulter Blutung — schmerzfrei und ohne Sedierung.",
    icon: Pill,
  },
  {
    n: "05",
    title: "Sprechstunde",
    sub: "Innere Medizin & CED",
    body:
      "Strukturierte Sprechstunden für Pankreas, CED, Reflux, Lebererkrankungen und Reizdarm.",
    icon: Stethoscope,
  },
  {
    n: "06",
    title: "Vorsorge",
    sub: "Darmkrebs & Check-up",
    body:
      "Strukturierte Vorsorgeprogramme ab dem 50. Lebensjahr, individuelle Check-up-Untersuchungen sowie Impf- und Reiseberatung.",
    icon: HeartPulse,
  },
];

const HOURS = [
  { day: "Montag", open: "08:00 – 13:00", close: "15:00 – 18:00", note: "Vormittag & Spät" },
  { day: "Dienstag", open: "08:00 – 13:00", close: "—", note: "Vormittag" },
  { day: "Mittwoch", open: "08:00 – 13:00", close: "—", note: "Vormittag" },
  { day: "Donnerstag", open: "08:00 – 13:00", close: "15:00 – 18:00", note: "Vormittag & Spät" },
  { day: "Freitag", open: "08:00 – 13:00", close: "—", note: "Vormittag" },
] as const;

const TIMELINE = [
  { year: "1998", text: "Approbation & Promotion, Universität Hamburg." },
  { year: "2004", text: "Facharztanerkennung Innere Medizin." },
  { year: "2009", text: "Schwerpunkt Gastroenterologie, Marienkrankenhaus Lübeck." },
  { year: "2015", text: "Oberärztliche Tätigkeit, Klinik für Viszeralmedizin." },
  { year: "2022", text: "Niederlassung in eigener Praxis, Bad Segeberg." },
];

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as const },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="label-eyebrow">{children}</span>;
}

function Rule({ children }: { children?: React.ReactNode }) {
  if (!children) return <Separator className="bg-border/70" />;
  return (
    <div className="rule-divider text-border">
      <span aria-hidden /><span className="label-eyebrow text-foreground/70">{children}</span><span aria-hidden />
    </div>
  );
}

export default function Landing() {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.85]);

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const hh = d.getHours().toString().padStart(2, "0");
      const mm = d.getMinutes().toString().padStart(2, "0");
      setNow(`${hh}:${mm}`);
    };
    fmt();
    const id = setInterval(fmt, 30_000);
    return () => clearInterval(id);
  }, []);

  // Escape-to-close + body scroll lock while mobile menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div ref={ref} className="min-h-screen bg-background text-foreground">
      {/* Hairline top border sensation — full-bleed editorial ribbon */}
      <div className="border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="flex h-14 items-center justify-between">
            <a href="#top" className="group flex items-center gap-3.5">
              <span aria-hidden className="grid h-10 w-10 place-items-center rounded-[2px] border border-foreground/80">
                <span className="font-serif text-[20px] leading-none">M</span>
              </span>
              <span className="leading-tight">
                <span className="block font-serif text-[18px] tracking-tight">Dr. med. Maher Madi</span>
                <span className="block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Gastropraxis · Bad Segeberg
                </span>
              </span>
            </a>
            <nav className="hidden md:flex items-center gap-8">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[13px] tracking-tight text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Button asChild className="hidden md:inline-flex rounded-[2px] bg-foreground text-background hover:bg-foreground/90">
                <a href="#kontakt">
                  <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" /> Zum Kontakt
                </a>
              </Button>
              <button
                aria-label="Menü öffnen"
                onClick={() => setOpen(true)}
                className="md:hidden grid h-8 w-8 place-items-center rounded-[2px] border border-border"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-background"
        >
          <div className="flex h-14 items-center justify-between px-6 border-b border-border">
            <span className="font-serif text-lg">Dr. med. Maher Madi</span>
            <button
              aria-label="Menü schließen"
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-[2px] border border-border"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-6 py-10">
            <ul className="space-y-5">
              {NAV.map((item, i) => (
                <li key={item.href} className="flex items-baseline gap-4">
                  <span className="label-eyebrow">{String(i + 1).padStart(2, "0")}</span>
                  <a
                    onClick={() => setOpen(false)}
                    href={item.href}
                    className="font-serif text-3xl"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-10 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> 04551 · 00 00 00</p>
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> praxis@gastropraxis-badsegeberg.de</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* HERO */}
      <motion.section
        id="top"
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-10 lg:pt-14 pb-16 lg:pb-24">
          {/* Editorial Cover — reception photo as the warm, inviting anchor */}
          <motion.figure
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative mb-12 lg:mb-16"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/8] lg:aspect-[16/7] overflow-hidden rounded-[2px] border border-border bg-muted">
              {/* Reception photo (uploaded asset) */}
              <img
                src="/assets/20190220203252_03.jpg"
                alt="Empfangsbereich der Gastropraxis Bad Segeberg — eine ruhige, modern gestaltete Praxis mit beleuchteter Theke und natürlichem Licht."
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                // @ts-expect-error — fetchpriority is valid in React 19+
                fetchpriority="high"
              />
              {/* Soft bottom gradient for label legibility over the bright floor */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-2/5"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in oklch, var(--background) 88%, transparent) 0%, color-mix(in oklch, var(--background) 32%, transparent) 55%, transparent 100%)",
                }}
              />
              {/* Editorial frame labels */}
              <div className="absolute inset-0 grid grid-rows-[auto_1fr_auto] p-6 lg:p-10">
                <div className="flex items-center justify-between">
                  <span className="label-eyebrow text-foreground/80">Cover · Abb. I</span>
                </div>
                <div className="flex items-end">
                  <div className="max-w-[40ch] lg:max-w-[46ch]" style={{ textShadow: "0 1px 2px rgba(247, 242, 234, 0.75), 0 0 12px rgba(247, 242, 234, 0.35)" }}>
                    <p className="font-serif italic text-[15px] lg:text-[17px] text-foreground">
                      Willkommen in einer Praxis, in der Sie als Mensch zählen.
                    </p>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-4 text-foreground/85">
                  <div>
                    <span className="label-eyebrow">Dr. med. Maher Madi</span>
                    <p className="font-serif text-[14px] mt-1">Gastropraxis · Bad Segeberg</p>
                  </div>
                  <div className="hidden lg:block text-right">
                    <span className="label-eyebrow">Innere Medizin</span>
                    <p className="font-serif text-[14px] mt-1">&amp; Gastroenterologie</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.figure>

          <div className="grid grid-cols-12 gap-x-8 gap-y-10">
            {/* Editorial metadata column */}
            <div className="col-span-12 lg:col-span-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="h-px w-8 bg-foreground/40" />
                <Eyebrow>Innere Medizin &amp; Gastroenterologie</Eyebrow>
              </div>
              <p className="mt-6 font-serif text-[15px] italic text-muted-foreground leading-relaxed">
                Eine ruhige Praxis<br />
                in Bad Segeberg —<br />
                mit Zeit für Ihre Anliegen.
              </p>
            </div>

            {/* Headline */}
            <div className="col-span-12 lg:col-span-9">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
                className="font-serif text-[44px] sm:text-[64px] lg:text-[88px] leading-[0.96] tracking-[-0.012em] text-balance"
              >
                <span className="block">Gastropraxis</span>
                <span className="block text-muted-foreground">Bad Segeberg.</span>
              </motion.h1>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
                <p className="lg:col-span-7 text-[16.5px] leading-[1.55] text-pretty text-foreground/85 max-w-[58ch]">
                  Dr.&nbsp;med.&nbsp;Maher Madi und das Praxis-Team begleiten Sie mit Ruhe, Sorgfalt
                  und moderner Diagnostik — von der ersten Sprechstunde über Vorsorge und Endoskopie
                  bis zur langfristigen Betreuung.
                </p>
                <div className="lg:col-span-5 flex flex-wrap items-center gap-3">
                  <Button asChild className="rounded-[2px] bg-foreground text-background hover:bg-foreground/90">
                    <a href="#kontakt">
                      <ArrowUpRight className="mr-1.5 h-4 w-4" /> Zum Kontakt
                    </a>
                  </Button>
                  <Button asChild variant="ghost" className="rounded-[2px] hover:bg-foreground/5">
                    <a href="#leistungen">Leistungen ansehen</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Hero lower register — three editorial cards */}
          <div className="mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-3 border-t border-border">
            {[
              {
                k: "Diagnostik",
                title: "Endoskopie mit Sorgfalt",
                body: "Gastroskopie, Koloskopie und Sonographie ambulant und mit schonender Sedierung.",
              },
              {
                k: "Sprechstunde",
                title: "Zeit für Ihre Anliegen",
                body: "Strukturierte Sprechstunden für CED, Reflux, Lebererkrankungen und Reizdarm.",
              },
              {
                k: "Vorsorge",
                title: "Früh erkannt, gut begleitet",
                body: "Darmkrebsvorsorge, Check-up und individuelle Gesundheitsprogramme.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.k}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.22, 0.61, 0.36, 1] }}
                className="relative p-8 lg:p-10 border-b md:border-b-0 md:border-r border-border last:border-r-0"
              >
                <div className="flex items-center justify-between">
                  <Eyebrow>{c.k}</Eyebrow>
                  <span className="font-serif text-muted-foreground/70 text-sm">{String(i + 1).padStart(2, "0")} / 03</span>
                </div>
                <h3 className="mt-6 font-serif text-2xl leading-tight">{c.title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground max-w-[36ch]">
                  {c.body}
                </p>
                <a href="#leistungen" className="mt-6 inline-flex items-center gap-1.5 text-[12.5px] tracking-tight text-foreground/70 hover:text-foreground">
                  Mehr erfahren <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* PRAXIS / DOCTOR */}
      <section id="praxis" className="border-t border-border bg-card">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid grid-cols-12 gap-x-8 gap-y-12">
            <div className="col-span-12 lg:col-span-5">
              <Eyebrow>Über die Praxis</Eyebrow>
              <motion.h2
                {...fadeUp}
                className="mt-5 font-serif text-[36px] lg:text-[52px] leading-[1.04] tracking-[-0.01em] text-balance"
              >
                Eine ruhige Praxis,<br />
                <span className="text-muted-foreground">in der Sie als Mensch zählen.</span>
              </motion.h2>
              <div className="mt-8 max-w-[44ch] space-y-5 text-[15.5px] leading-relaxed text-foreground/85">
                <p>
                  Dr.&nbsp;med.&nbsp;Maher Madi behandelt Patientinnen und Patienten
                  in einer neu gestalteten Praxis in Bad Segeberg. Unser Anspruch:
                  ruhige Abläufe, ausführliche Gespräche und Befunde, die verständlich bleiben.
                </p>
                <p>
                  Wir arbeiten nach den Leitlinien der Deutschen Gesellschaft für Gastroenterologie,
                  Verdauungs- und Stoffwechselkrankheiten (DGVS) und stimmen uns eng mit Hausärzten
                  und Kliniken der Region ab.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild variant="outline" className="rounded-[2px] border-foreground/70 text-foreground hover:bg-foreground hover:text-background">
                  <a href="#diagnostik">
                    Diagnostik im Überblick <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Doctor portrait card */}
            <div className="col-span-12 lg:col-span-7">
              <motion.figure
                {...fadeUp}
                className="relative"
              >
                <div className="relative aspect-[5/4] overflow-hidden rounded-[2px] border border-border bg-secondary/40">
                  {/* Editorial portrait placeholder — abstract warm composition */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(120% 80% at 50% 35%, color-mix(in oklch, var(--accent) 90%, var(--background) 10%) 0%, color-mix(in oklch, var(--accent) 50%, var(--background) 50%) 45%, color-mix(in oklch, var(--muted) 80%, var(--background) 20%) 100%)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/3"
                    style={{
                      background:
                        "linear-gradient(to top, color-mix(in oklch, var(--foreground) 12%, transparent) 0%, transparent 100%)",
                    }}
                  />
                  <div className="absolute inset-0 grid grid-rows-[auto_1fr_auto] p-6 lg:p-8">
                    <div className="flex items-center justify-between">
                      <Eyebrow>Portrait</Eyebrow>
                      <span className="label-eyebrow text-foreground/60">MM · 2024</span>
                    </div>
                    <div className="flex items-end">
                      <div className="font-serif text-[120px] lg:text-[180px] leading-[0.85] text-foreground/15 select-none">
                        M
                      </div>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <div className="font-serif text-[22px] lg:text-[26px] leading-tight text-foreground/90">
                        Dr. med.<br />Maher Madi
                      </div>
                      <div className="text-right text-[12px] leading-snug text-foreground/70 max-w-[26ch]">
                        Innere Medizin<br />
                        & Gastroenterologie
                      </div>
                    </div>
                  </div>
                </div>
                <figcaption className="mt-3 flex items-center justify-between text-[11.5px] text-muted-foreground">
                  <span className="label-eyebrow">Abb. 01</span>
                  <span>Aufnahme in der Praxis, 2024.</span>
                </figcaption>
              </motion.figure>

              {/* Credentials strip */}
              <div className="mt-8 border-t border-border pt-6 grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
                {[
                  { v: "25+", l: "Jahre klinische Erfahrung" },
                  { v: "DGIM", l: "Deutsche Gesellschaft für Innere Medizin" },
                  { v: "DGVS", l: "Gastroenterologie" },
                  { v: "DEGUM", l: "Sonographie-Zertifikat" },
                ].map((c) => (
                  <div key={c.l} className="border-l border-border pl-4">
                    <div className="font-serif text-2xl">{c.v}</div>
                    <div className="mt-1 text-[12px] leading-snug text-muted-foreground">{c.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEISTUNGEN */}
      <section id="leistungen" className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <Eyebrow>Leistungen · Kapitel I</Eyebrow>
              <motion.h2
                {...fadeUp}
                className="mt-4 font-serif text-[36px] lg:text-[52px] leading-[1.05] tracking-[-0.01em] max-w-[20ch] text-balance"
              >
                Diagnostik und Therapie,<br />
                <span className="text-muted-foreground">auf das Wesentliche gebracht.</span>
              </motion.h2>
            </div>
            <p className="text-[14.5px] leading-relaxed text-muted-foreground max-w-[42ch]">
              Sechs Schwerpunkte, in denen wir besonders erfahren sind. Alle Untersuchungen
              finden in der Praxis statt — mit kurzen Wegen, klarer Diagnostik und persönlicher Begleitung.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-border">
            {SERVICES.map((s, i) => (
              <motion.article
                key={s.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: 0.05 * i, ease: [0.22, 0.61, 0.36, 1] }}
                className="group relative border-b border-border md:border-r lg:border-r last:border-r-0 p-7 lg:p-9 hover:bg-card transition-colors duration-500"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm text-muted-foreground/80 tracking-tight">{s.n}</span>
                  <s.icon className="h-4 w-4 text-foreground/70 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <h3 className="mt-10 font-serif text-[26px] lg:text-[30px] leading-tight">{s.title}</h3>
                <p className="mt-2 text-[12.5px] uppercase tracking-[0.16em] text-muted-foreground">
                  {s.sub}
                </p>
                <p className="mt-5 text-[14px] leading-relaxed text-foreground/80 max-w-[40ch]">
                  {s.body}
                </p>
                <a href="#termin" className="mt-8 inline-flex items-center gap-1.5 text-[12.5px] tracking-tight text-foreground/70 hover:text-foreground">
                  Sprechstunde anfragen <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* DIAGNOSTIK SPREAD */}
      <section id="diagnostik" className="border-t border-border bg-card">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
          <Rule>Kapitel II · Perspektive</Rule>
          <div className="mt-10 grid grid-cols-12 gap-x-8 gap-y-10">
            <div className="col-span-12 lg:col-span-7">
              <h2 className="font-serif text-[34px] lg:text-[46px] leading-[1.06] tracking-[-0.01em] max-w-[22ch] text-balance">
                Eine Diagnostik, die Zeit lässt — und Klarheit schafft.
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <p className="text-[15px] leading-[1.7] text-foreground/85 max-w-[44ch]">
                Wir glauben, dass eine gute Diagnostik vor allem eines braucht: Zeit für das Gespräch
                und Geräte, denen man vertrauen kann. Bei uns finden Sie beides — vom hochauflösenden
                Endoskopiesystem bis zur strukturierten Vorbereitung für jeden Eingriff.
              </p>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-px bg-border">
            {/* Map / Lage card */}
            <motion.div {...fadeUp} className="bg-card p-8 lg:p-10">
              <div className="flex items-center justify-between">
                <Eyebrow>Lage · Karte</Eyebrow>
                <Compass className="h-4 w-4 text-foreground/70" />
              </div>
              <h3 className="mt-6 font-serif text-2xl">So finden Sie uns.</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground max-w-[36ch]">
                Im Ärztehaus der Innenstadt, fünf Minuten Fußweg vom Bahnhof
                und direkt an der Bushaltestelle „Marktplatz".
              </p>
              <div className="mt-8 relative aspect-[16/10] overflow-hidden rounded-[2px] border border-border">
                {/* Stylized map placeholder */}
                <div className="absolute inset-0 bg-secondary/60">
                  <svg viewBox="0 0 600 380" className="absolute inset-0 h-full w-full">
                    <defs>
                      <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-border" />
                      </pattern>
                    </defs>
                    <rect width="600" height="380" fill="url(#grid)" />
                    <path d="M0,220 C120,180 240,260 360,200 C460,150 540,180 600,160" stroke="currentColor" strokeWidth="1.2" fill="none" className="text-foreground/60" />
                    <path d="M120,0 C140,80 160,180 200,260 C240,340 280,360 320,380" stroke="currentColor" strokeWidth="1" fill="none" className="text-foreground/40" />
                    <circle cx="370" cy="200" r="7" fill="currentColor" className="text-foreground" />
                    <circle cx="370" cy="200" r="14" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-foreground/60" />
                  </svg>
                </div>
                <div className="absolute left-6 top-6">
                  <div className="font-serif text-sm">Standort</div>
                  <div className="mt-1 text-[12px] text-muted-foreground">53.94° N · 10.31° O</div>
                </div>
                <div className="absolute right-6 bottom-6 flex items-center gap-2 text-[11.5px] text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> Marktplatz, Bad Segeberg
                </div>
              </div>
            </motion.div>

            {/* Sprechzeiten */}
            <motion.div {...fadeUp} className="bg-card p-8 lg:p-10">
              <div className="flex items-center justify-between">
                <Eyebrow>Sprechzeiten</Eyebrow>
                <Clock className="h-4 w-4 text-foreground/70" />
              </div>
              <h3 className="mt-6 font-serif text-2xl">Wir sind für Sie da.</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground max-w-[36ch]">
                Wir bitten um Terminvereinbarung. In akuten Fällen erreichen Sie uns telefonisch
                während der Sprechzeiten unter{" "}
                <a href="tel:+49455100000" className="underline text-foreground/80 hover:text-foreground">04551 · 00 00 00</a>.
              </p>
              <div id="sprechzeiten" className="mt-8 divide-y divide-border border-y border-border">
                {HOURS.map((h) => (
                  <div key={h.day} className="grid grid-cols-12 gap-3 py-3.5 items-baseline">
                    <div className="col-span-4 font-serif text-[16px]">{h.day}</div>
                    <div className="col-span-6 text-[13.5px] tabular-nums text-foreground/85">
                      {h.open}{h.close !== "—" && <span className="text-muted-foreground">{" · "}</span>}
                      {h.close !== "—" && h.close}
                    </div>
                    <div className="col-span-2 text-right text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{h.note}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between text-[12px] text-muted-foreground">
                <span className="flex items-center gap-2"><Sun className="h-3.5 w-3.5" /> Jetzt: <span className="tabular-nums text-foreground">{now || "—"}</span> Uhr</span>
                <span>und nach Vereinbarung.</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WERDEGANG / Editorial narrative */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10">
            <div className="col-span-12 lg:col-span-4">
              <Eyebrow>Werdegang</Eyebrow>
              <h2 className="mt-4 font-serif text-[32px] lg:text-[42px] leading-[1.08] tracking-[-0.01em] max-w-[16ch] text-balance">
                Eine ärztliche Laufbahn in Stationen.
              </h2>
              <p className="mt-6 text-[14.5px] leading-relaxed text-foreground/80 max-w-[38ch]">
                Von Hamburg über Lübeck bis nach Bad Segeberg — Dr.&nbsp;Madi bringt über
                zwei Jahrzehnte klinische Erfahrung in die eigene Praxis mit.
              </p>
            </div>

            <ol className="col-span-12 lg:col-span-8">
              {TIMELINE.map((t, i) => (
                <motion.li
                  key={t.year}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: 0.05 * i }}
                  className="grid grid-cols-12 gap-4 border-t border-border py-6"
                >
                  <div className="col-span-3 lg:col-span-2 font-serif text-2xl tabular-nums">{t.year}</div>
                  <div className="col-span-9 lg:col-span-9 text-[15px] leading-relaxed text-foreground/85 max-w-[60ch]">
                    {t.text}
                  </div>
                </motion.li>
              ))}
              <li className="border-t border-border py-3 text-[11.5px] text-muted-foreground">
                Stand: 2024 · Auswahl; vollständiger Lebenslauf auf Anfrage.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* KONTAKT / Termin */}
      <section id="kontakt" className="border-t border-border bg-card">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
          <Rule>Kapitel III · Kontakt</Rule>
          <div className="mt-10 grid grid-cols-12 gap-x-8 gap-y-12">
            <div className="col-span-12 lg:col-span-7">
              <h2 id="termin" className="font-serif text-[40px] lg:text-[60px] leading-[1.04] tracking-[-0.01em] text-balance">
                Termin in der<br />
                <span className="text-muted-foreground">Gastropraxis.</span>
              </h2>
              <p className="mt-6 max-w-[52ch] text-[15.5px] leading-relaxed text-foreground/85">
                Wir nehmen uns Zeit für Sie. Bitte vereinbaren Sie einen Termin —
                telefonisch, per E-Mail oder über das untenstehende Formular.
                Bei akuten Beschwerden melden Sie sich bitte direkt in der Praxis.
              </p>

              <div id="kontakt-form" className="mt-10 border border-border bg-background p-6 lg:p-8 rounded-[2px]">
                <div className="flex items-center justify-between">
                  <Eyebrow>Formular</Eyebrow>
                  <span className="label-eyebrow text-muted-foreground/70">01 / 01</span>
                </div>
                <form className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="label-eyebrow" htmlFor="name">Name</label>
                    <input id="name" name="name" autoComplete="name" placeholder="Vor- und Nachname" className="h-11 border-b border-border bg-transparent px-0 text-[15px] outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/60" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="label-eyebrow" htmlFor="phone">Telefon</label>
                    <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="z. B. 04551 …" className="h-11 border-b border-border bg-transparent px-0 text-[15px] outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/60" />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="label-eyebrow" htmlFor="email">E-Mail</label>
                    <input id="email" name="email" type="email" autoComplete="email" placeholder="name@example.de" className="h-11 border-b border-border bg-transparent px-0 text-[15px] outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/60" />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="label-eyebrow" htmlFor="reason">Anliegen</label>
                    <select id="reason" name="reason" defaultValue="Sprechstunde / Erstvorstellung" className="h-11 border-b border-border bg-card px-0 text-[15px] outline-none focus:border-foreground transition-colors">
                      <option>Sprechstunde / Erstvorstellung</option>
                      <option>Vorsorge-Koloskopie</option>
                      <option>Gastroskopie</option>
                      <option>Sonographie</option>
                      <option>Atemtest</option>
                      <option>CED-Sprechstunde</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="label-eyebrow" htmlFor="message">Nachricht (optional)</label>
                    <textarea id="message" name="message" rows={3} placeholder="Beschwerden, Vorbefunde, Überweisung …" className="border-b border-border bg-transparent px-0 py-2 text-[15px] outline-none focus:border-foreground transition-colors resize-none placeholder:text-muted-foreground/60" />
                  </div>
                  <p className="sm:col-span-2 text-[11.5px] text-muted-foreground leading-relaxed">
                    Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten zur Termin­koordination zu.
                    Details in unserer Datenschutz­erklärung.
                  </p>
                  <div className="sm:col-span-2 flex items-center gap-3 pt-2">
                    <Button type="submit" className="rounded-[2px] bg-foreground text-background hover:bg-foreground/90">
                      Anfrage senden <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                    <span className="text-[12px] text-muted-foreground">Wir antworten innerhalb eines Werktages.</span>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact card */}
            <div className="col-span-12 lg:col-span-5">
              <div className="border border-border bg-background p-6 lg:p-8 rounded-[2px] h-full flex flex-col">
                <Eyebrow>Praxisadresse</Eyebrow>
                <h3 className="mt-5 font-serif text-2xl leading-tight">
                  Gastropraxis<br />Bad Segeberg
                </h3>
                <address className="mt-6 not-italic text-[14.5px] leading-relaxed text-foreground/85">
                  Dr. med. Maher Madi<br />
                  Bahnhofstraße 12<br />
                  23795 Bad Segeberg
                </address>

                <div className="mt-8 grid grid-cols-1 gap-4">
                  <a href="tel:+49455100000" className="group flex items-center justify-between border-t border-border pt-4">
                    <span className="flex items-center gap-2 text-[13.5px] text-muted-foreground"><Phone className="h-3.5 w-3.5" /> Telefon</span>
                    <span className="text-[15px] tracking-tight group-hover:text-foreground">04551 · 00 00 00</span>
                  </a>
                  <a href="fax:+49455100001" className="group flex items-center justify-between border-t border-border pt-4">
                    <span className="flex items-center gap-2 text-[13.5px] text-muted-foreground"><ClipboardList className="h-3.5 w-3.5" /> Telefax</span>
                    <span className="text-[15px] tracking-tight tabular-nums group-hover:text-foreground">04551 · 00 00 01</span>
                  </a>
                  <a href="mailto:praxis@gastropraxis-badsegeberg.de" className="group flex items-center justify-between border-t border-border pt-4">
                    <span className="flex items-center gap-2 text-[13.5px] text-muted-foreground"><Mail className="h-3.5 w-3.5" /> E-Mail</span>
                    <span className="text-[14px] tracking-tight group-hover:text-foreground truncate ml-2">praxis@gastropraxis-badsegeberg.de</span>
                  </a>
                  <a href="#sprechzeiten" className="group flex items-center justify-between border-t border-b border-border py-4">
                    <span className="flex items-center gap-2 text-[13.5px] text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" /> Sprechzeiten</span>
                    <span className="text-[13.5px] tracking-tight text-foreground/80 group-hover:text-foreground">Mo – Fr · ab 08:00</span>
                  </a>
                </div>

                <div className="mt-8 pt-4 border-t border-border">
                  <p className="text-[11.5px] uppercase tracking-[0.18em] text-muted-foreground">Anfahrt</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-foreground/85 max-w-[36ch]">
                    Mit der Bahn: 5 Min. vom Bahnhof Bad Segeberg · Mit dem Auto:
                    Parkplätze am Haus · Barrierefreier Zugang.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10 py-16 lg:py-20">
            <div className="col-span-12 lg:col-span-6">
              <div className="flex items-center gap-3">
                <span aria-hidden className="grid h-8 w-8 place-items-center rounded-[2px] border border-foreground/70">
                  <span className="font-serif text-[16px] leading-none">M</span>
                </span>
                <span>
                  <span className="block font-serif text-lg">Dr. med. Maher Madi</span>
                  <span className="block label-eyebrow">Gastropraxis Bad Segeberg</span>
                </span>
              </div>
              <p className="mt-6 text-[13.5px] leading-relaxed text-muted-foreground max-w-[44ch]">
                Facharzt für Innere Medizin und Gastroenterologie. Diagnostik, Vorsorge
                und Therapie — in einer ruhigen Praxis im Herzen Bad Segebergs.
              </p>
            </div>
            <div className="col-span-6 lg:col-span-3">
              <Eyebrow>Praxis</Eyebrow>
              <ul className="mt-5 space-y-2 text-[13.5px] text-foreground/85">
                <li><a href="#praxis" className="hover:text-foreground">Über die Praxis</a></li>
                <li><a href="#leistungen" className="hover:text-foreground">Leistungen</a></li>
                <li><a href="#diagnostik" className="hover:text-foreground">Diagnostik</a></li>
                <li><a href="#sprechzeiten" className="hover:text-foreground">Sprechzeiten</a></li>
              </ul>
            </div>
            <div className="col-span-6 lg:col-span-3">
              <Eyebrow>Patient:innen</Eyebrow>
              <ul className="mt-5 space-y-2 text-[13.5px] text-foreground/85">
                <li><a href="tel:+49455100000" className="hover:text-foreground">Anrufen: 04551 · 00 00 00</a></li>
                <li><a href="#kontakt" className="hover:text-foreground">Kontakt & Anfahrt</a></li>
                <li><a href="#impressum" className="hover:text-foreground">Impressum</a></li>
                <li><a href="#datenschutz" className="hover:text-foreground">Datenschutz</a></li>
              </ul>
            </div>
          </div>

          {/* Impressum-style detail strip */}
          <div id="impressum" className="border-t border-border py-10 grid grid-cols-12 gap-x-8 gap-y-6 text-[12px] leading-relaxed text-muted-foreground">
            <div className="col-span-12 lg:col-span-6">
              <p className="font-serif text-foreground/80 text-[15px]">Impressum</p>
              <p className="mt-2 max-w-[56ch]">
                Verantwortlich im Sinne des § 5 TMG: Dr. med. Maher Madi · Bahnhofstraße 12 ·
                23795 Bad Segeberg · Telefon 04551 · 00 00 00 · E-Mail praxis@gastropraxis-badsegeberg.de.
                Berufsbezeichnung: Arzt (verliehen in der Bundesrepublik Deutschland). Zuständige
                Ärztekammer: Ärztekammer Schleswig-Holstein.
              </p>
            </div>
            <div id="datenschutz" className="col-span-12 lg:col-span-6">
              <p className="font-serif text-foreground/80 text-[15px]">Datenschutz</p>
              <p className="mt-2 max-w-[56ch]">
                Die Verarbeitung personenbezogener Daten erfolgt ausschließlich im Rahmen der
                geltenden Datenschutzgesetze (DSGVO, BDSG) sowie der ärztlichen Schweigepflicht.
                Hinweise zum Umgang mit Ihren Daten erhalten Sie auf Anfrage in der Praxis.
              </p>
            </div>
          </div>

          <div className="border-t border-border py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11.5px] text-muted-foreground">
            <span>© {new Date().getFullYear()} Dr. med. Maher Madi · Alle Rechte vorbehalten.</span>
            <span className="label-eyebrow">Studio · Editorial Layout</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
