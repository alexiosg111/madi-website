import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock,
  Compass,
  HeartPulse,
  Mail,
  MapPin,
  Menu,
  Microscope,
  Moon,
  Phone,
  Pill,
  ScanLine,
  Stethoscope,
  Sun,
  X,
} from "lucide-react";

type NavItem = { label: string; href: string };
const NAV: NavItem[] = [
  { label: "Start", href: "#top" },
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
    body: "Kapsel mit einer Miniatur-Kamera zur ambulanten Untersuchung des Dünndarms. Sinnvoll bei unklarer Anämie, Verdacht auf Morbus Crohn oder okkulter Blutung — schmerzfrei und ohne Sedierung.",
    icon: Pill,
  },
  {
    n: "05",
    title: "Sprechstunde",
    sub: "Innere Medizin & CED",
    body: "Strukturierte Sprechstunden für Pankreas, CED, Reflux und Reizdarm.",
    icon: Stethoscope,
  },
  {
    n: "06",
    title: "Vorsorge",
    sub: "Darmkrebs & Check-up",
    body: "Strukturierte Vorsorgeprogramme ab dem 50. Lebensjahr, individuelle Check-up-Untersuchungen.",
    icon: HeartPulse,
  },
];

const HOURS = [
  { day: "Montag", open: "08:30 – 11:30", close: "15:00 – 15:30", note: "Vormittag & Spät" },
  { day: "Dienstag", open: "08:30 – 11:30", close: "15:00 – 15:30", note: "Vormittag & Spät" },
  { day: "Mittwoch", open: "08:30 – 11:30", close: "15:00 – 15:30", note: "Vormittag & Spät" },
  { day: "Donnerstag", open: "08:30 – 11:30", close: "15:00 – 15:30", note: "Vormittag & Spät" },
  { day: "Freitag", open: "Nach Vereinbarung", close: "—", note: "" },
] as const;

const TIMELINE = [
  { year: "1999", text: "Abschluss Studium der Humanmedizin, Universität Latakia." },
  { year: "2000 – 2004", text: "Facharzt-Weiterbildung Innere Medizin, Universitätsklinikum Damaskus." },
  { year: "2005 – 2011", text: "Weiterbildung Gastroenterologie, Charité Berlin & Altmark Klinikum Salzwedel." },
  { year: "Seit 05/2011", text: "Facharzt für Innere Medizin und Gastroenterologie." },
  { year: "05/2011 – 02/2013", text: "Oberarzt für Innere Medizin und Gastroenterologie." },
  { year: "03/2013 – 06/2014", text: "Chefarzt der gastroenterologischen Klinik, Bathildis Krankenhaus Bad Pyrmont & Median Kliniken Bad Mergentheim." },
  { year: "08/2014 – 01/2022", text: "Leitender Arzt der Funktionsdiagnostik, Tichreen Universitätsklinikum, Latakia (Syrien)." },
  { year: "03/2022 – 09/2025", text: "Oberarzt / Chefarzt, Abteilung Innere Medizin mit Schwerpunkt Gastroenterologie, KH Land Hadeln, Otterndorf." },
  { year: "aktuell", text: "Niederlassung in eigener Praxis, Bad Segeberg." },
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

const CHAPTER_COUNT = NAV.length;

export default function Landing() {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState<string>("");
  const [active, setActive] = useState("#top");
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(SERVICES.length);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("gastro-theme", next);
    } catch {
      /* Storage nicht verfügbar */
    }
    setTheme(next);
  };
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

  // Scroll-Spy: aktive Sektion im Menü hervorheben
  useEffect(() => {
    const ids = ["top", "praxis", "leistungen", "diagnostik", "sprechzeiten", "kontakt"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Carousel: Slide-Zähler + Pfeil-Zustände am Leben halten
  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setCount(api.scrollSnapList().length);
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    // Erstwert direkt nach Init setzen (Embla-Muster, vgl. ui/carousel.tsx)
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  // Aktuelle Sektion (Scroll-Spy) als Kapitel-Indikator — geteilt mit dem
  // Sidebar-Drawer, dem Header-Ticker und der Kapitel-Leiste im Hero.
  const activeIndex = Math.max(0, NAV.findIndex((n) => n.href === active));
  const activeLabel = NAV[activeIndex]?.label ?? "Start";

  const scrollToSection = (href: string) => {
    setActive(href);
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
  };

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
              <span className="min-w-0 leading-tight">
                <span className="block truncate font-serif text-[18px] tracking-tight">Dr. med. Maher Madi</span>
                <span className="hidden sm:block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Gastropraxis · Bad Segeberg
                </span>
              </span>
            </a>
            <div className="flex items-center gap-2.5">
              <button
                aria-label={theme === "dark" ? "Hellen Modus aktivieren" : "Dunklen Modus aktivieren"}
                onClick={toggleTheme}
                className="hidden sm:grid h-9 w-9 place-items-center rounded-[2px] border border-border hover:bg-foreground/5 transition-colors"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <a
                href="#kontakt"
                aria-label="Zum Kontakt"
                className="grid h-10 w-10 place-items-center rounded-[2px] border border-border text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground sm:hidden"
              >
                <Phone className="h-4 w-4" />
              </a>
              <Button asChild className="hidden sm:inline-flex rounded-[2px] bg-foreground text-background hover:bg-foreground/90">
                <a href="#kontakt">
                  <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" /> Zum Kontakt
                </a>
              </Button>
              <button
                aria-label="Menü öffnen"
                onClick={() => setOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-[2px] border border-border hover:bg-foreground/5 transition-colors"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Location ticker — „Sie sind hier", synchron mit dem Hamburger-Menü */}
        <div className="border-t border-border/60">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="flex h-8 items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="label-eyebrow tabular-nums">{String(activeIndex + 1).padStart(2, "0")}</span>
                <span aria-hidden className="h-px w-4 shrink-0 bg-foreground/30" />
                <span className="relative block h-[14px] min-w-[7ch] overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={active}
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
                      className="absolute left-0 top-0 block whitespace-nowrap text-[10.5px] uppercase tracking-[0.18em] text-foreground/90"
                    >
                      {activeLabel}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="shrink-0 text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground/60">
                  Sie sind hier
                </span>
              </div>
              <span className="hidden text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60 md:inline">
                Gastropraxis · Bad Segeberg
              </span>
            </div>
            {/* Scroll-Fortschritt als Haarlinie */}
            <div aria-hidden className="relative h-[2px] w-full overflow-hidden bg-foreground/10">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="absolute inset-0 origin-left bg-foreground/70"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar drawer — navigation on all devices */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-background/70 backdrop-blur-[2px]"
            />
            <motion.aside
              key="drawer-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className="fixed inset-y-0 right-0 z-50 flex w-[320px] max-w-[86vw] flex-col border-l border-border bg-background"
            >
              <div className="flex h-14 items-center justify-between border-b border-border px-5">
                <span className="flex items-center gap-2.5">
                  <span aria-hidden className="grid h-8 w-8 place-items-center rounded-[2px] border border-foreground/80">
                    <span className="font-serif text-[16px] leading-none">M</span>
                  </span>
                  <span className="font-serif text-[17px] tracking-tight">Dr. med. Maher Madi</span>
                </span>
                <button
                  aria-label="Menü schließen"
                  onClick={() => setOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-[2px] border border-border"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-5 py-6">
                <p className="label-eyebrow">Navigation</p>
                {/* Positions-Anzeige — synchron mit Hero & Header („double clutch") */}
                <div className="mt-3 flex items-center gap-2.5 rounded-[2px] border border-border px-3 py-2.5">
                  <span className="label-eyebrow tabular-nums">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(CHAPTER_COUNT).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="h-px w-4 bg-foreground/30" />
                  <span className="relative block h-[16px] min-w-[6ch] overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={active}
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -12, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
                        className="absolute left-0 top-0 block whitespace-nowrap font-serif italic text-[15px] leading-none"
                      >
                        {activeLabel}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="ml-auto hidden min-[380px]:inline label-eyebrow">Sie sind hier</span>
                </div>
                <ul className="mt-3">
                  {NAV.map((item, i) => {
                    const isActive = active === item.href;
                    return (
                      <li key={item.href} className="border-b border-border">
                        <a
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`group flex items-center justify-between py-4 transition-colors ${
                            isActive ? "text-foreground" : "text-foreground/55 hover:text-foreground"
                          }`}
                        >
                          <span className="flex items-baseline gap-4">
                            <span className="label-eyebrow">{String(i + 1).padStart(2, "0")}</span>
                            <span className={`font-serif text-[22px] leading-none ${isActive ? "italic" : ""}`}>
                              {item.label}
                            </span>
                          </span>
                          {isActive && <ArrowUpRight className="h-4 w-4" />}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="border-t border-border px-5 py-5 space-y-4">
                <div className="space-y-2.5 text-[13px] leading-relaxed text-muted-foreground">
                  <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0" /> 04551-882977</p>
                  <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 shrink-0" /> Gastroenterologie-Segeberg@web.de</p>
                  <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0" /> Dahlienstr. 19b, 23795 Bad Segeberg</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button asChild className="flex-1 rounded-[2px] bg-foreground text-background hover:bg-foreground/90">
                    <a href="#kontakt" onClick={() => setOpen(false)}>
                      <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" /> Zum Kontakt
                    </a>
                  </Button>
                  <button
                    aria-label={theme === "dark" ? "Hellen Modus aktivieren" : "Dunklen Modus aktivieren"}
                    onClick={toggleTheme}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-[2px] border border-border hover:bg-foreground/5 transition-colors"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* HERO */}
      <motion.section
        id="top"
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-8 lg:pt-12 pb-16 lg:pb-24">
          {/* Kapitel-Leiste — animierte „Sie sind hier"-Anzeige, synchron mit dem
              Hamburger-Menü (Scroll-Spy), dem Ticker im Header und dem Drawer */}
          <div className="border-y border-border">
            <div className="flex items-center justify-between gap-4 py-3 sm:gap-6">
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <span className="label-eyebrow tabular-nums">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(CHAPTER_COUNT).padStart(2, "0")}
                </span>
                <span aria-hidden className="hidden h-px w-5 shrink-0 bg-foreground/30 sm:block" />
                <span className="relative block h-[18px] min-w-[6ch] shrink-0 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={active}
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -16, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                      className="absolute left-0 top-0 block whitespace-nowrap font-serif italic text-[16px] leading-none text-foreground"
                    >
                      {activeLabel}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="hidden min-[370px]:inline label-eyebrow">Sie sind hier</span>
              </div>

              {/* Kapitel-Segmente — durchklicken springt zur Sektion */}
              <nav aria-label="Kapitel" className="flex items-center gap-1 sm:gap-2">
                {NAV.map((item, i) => (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    aria-label={`Zu ${item.label}`}
                    className="group flex h-10 items-end pb-3 sm:h-8 sm:pb-2"
                  >
                    <span
                      className={`block h-[3px] rounded-full transition-all duration-500 ${
                        i === activeIndex
                          ? "w-5 bg-foreground sm:w-8"
                          : "w-2 bg-foreground/25 group-hover:bg-foreground/50 sm:w-3"
                      }`}
                    />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Editorialer Doppelspalt — Text links, Cover rechts */}
          <div className="mt-10 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12">
            {/* Textspalte */}
            <div className="lg:col-span-6 flex flex-col justify-end">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="h-px w-8 bg-foreground/40" />
                <Eyebrow>Innere Medizin &amp; Gastroenterologie</Eyebrow>
              </div>

              {/* Headline — der Markenname, mit Luft zum Atmen */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
                className="mt-7 lg:mt-9 font-serif text-[44px] min-[420px]:text-[52px] sm:text-[68px] lg:text-[84px] xl:text-[96px] leading-[1.03] sm:leading-[0.98] tracking-[-0.015em] text-balance"
              >
                <span className="block">Gastropraxis</span>
                <span className="block">Bad Segeberg.</span>
              </motion.h1>

              {/* Subline — gleiche Worte, ruhige Serifen-Kursive */}
              <p className="mt-7 lg:mt-8 font-serif italic text-[17px] lg:text-[19px] leading-relaxed text-foreground/75 max-w-[36ch]">
                Eine ruhige Praxis<br />
                in Bad Segeberg —<br />
                mit Zeit für Ihre Anliegen.
              </p>

              {/* Intro */}
              <p className="mt-6 max-w-[52ch] text-[16px] leading-[1.65] text-pretty text-foreground/85">
                Dr.&nbsp;med.&nbsp;Maher Madi und das Praxis-Team begleiten Sie mit Ruhe,
                Sorgfalt und moderner Diagnostik — von der ersten Sprechstunde über Vorsorge
                und Endoskopie bis zur langfristigen Betreuung.
              </p>

              {/* CTAs */}
              <div className="mt-9 lg:mt-10 flex flex-wrap items-center gap-3">
                <Button asChild className="w-full sm:w-auto rounded-[2px] bg-foreground text-background hover:bg-foreground/90">
                  <a href="#kontakt">
                    <ArrowUpRight className="mr-1.5 h-4 w-4" /> Zum Kontakt
                  </a>
                </Button>
                <Button asChild variant="ghost" className="rounded-[2px] hover:bg-foreground/5">
                  <a href="#leistungen">Leistungen ansehen</a>
                </Button>
              </div>
            </div>

            {/* Cover-Spalte — Empfangsfoto als gerahmter Anker */}
            <div className="lg:col-span-6">
              <motion.figure
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
                className="relative"
              >
                <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[5/6] overflow-hidden rounded-[2px] border border-border bg-muted">
                  {/* Empfangsbereich (hochgeladenes Bild) */}
                  <img
                    src="/assets/20190220203252_03.jpg"
                    alt="Empfangsbereich der Gastropraxis Bad Segeberg — eine ruhige, modern gestaltete Praxis mit beleuchteter Theke und natürlichem Licht."
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                    // @ts-expect-error — fetchpriority is valid in React 19+
                    fetchpriority="high"
                  />
                  {/* Weicher Verlauf unten für gut lesbare Beschriftung */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-2/5"
                    style={{
                      background:
                        "linear-gradient(to top, var(--background) 0%, color-mix(in oklch, var(--background) 80%, transparent) 25%, transparent 100%)",
                    }}
                  />
                  {/* Editoriale Rahmenbeschriftung */}
                  <div className="absolute inset-0 grid grid-rows-[auto_1fr_auto] p-6 lg:p-8">
                    <div className="flex items-center justify-between">
                      <span className="label-eyebrow text-foreground/80">Cover · Abb. I</span>
                      <span className="label-eyebrow text-foreground/60">Rezeption</span>
                    </div>
                    <div />
                    <div className="flex items-end justify-between gap-4 text-foreground/90">
                      <div>
                        <span className="label-eyebrow">Dr. med. Maher Madi</span>
                        <p
                          className="font-serif text-[15px] mt-1"
                          style={{ textShadow: "0 1px 3px rgba(15, 20, 35, 0.6)" }}
                        >
                          Gastropraxis · Bad Segeberg
                        </p>
                      </div>
                      <div className="hidden min-[430px]:block text-right">
                        <span className="label-eyebrow">Innere Medizin</span>
                        <p className="font-serif text-[15px] mt-1">&amp; Gastroenterologie</p>
                      </div>
                    </div>
                  </div>
                </div>
                <figcaption className="mt-3 flex items-center justify-between text-[11.5px] text-muted-foreground">
                  <span className="label-eyebrow">Abb. 01 · Empfang</span>
                  <span className="label-eyebrow">2024</span>
                </figcaption>
              </motion.figure>
            </div>
          </div>

          {/* Einstiegs-Blöcke — wischbar auf Touch, ruhige Dreierreihe auf Desktop */}
          <div className="mt-16 lg:mt-24">
            <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
              <div className="flex items-center gap-3">
                <span className="label-eyebrow">Einstieg</span>
                <span aria-hidden className="h-px w-6 bg-foreground/30" />
                <span className="label-eyebrow md:hidden">Zum Wischen</span>
              </div>
              <span className="hidden md:inline-flex items-center gap-2 label-eyebrow">
                <ArrowLeft className="h-3.5 w-3.5" /> <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="no-scrollbar -mx-6 lg:mx-0 mt-4 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] lg:snap-none">
              {[
                {
                  k: "Diagnostik",
                  href: "#diagnostik",
                  title: "Endoskopie mit Sorgfalt",
                  body: "Gastroskopie, Koloskopie, Kapselendoskopie und Sonographie ambulant und mit schonender Sedierung.",
                },
                {
                  k: "Sprechstunde",
                  href: "#sprechzeiten",
                  title: "Zeit für Ihre Anliegen",
                  body: "Strukturierte Sprechstunden für Pankreas, CED, Reflux, Lebererkrankungen und Reizdarm.",
                },
                {
                  k: "Vorsorge",
                  href: "#leistungen",
                  title: "Früh erkannt, gut begleitet",
                  body: "Darmkrebsvorsorge, Check-up und individuelle Gesundheitsprogramme.",
                },
              ].map((c, i) => (
                <motion.a
                  key={c.k}
                  href={c.href}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.22, 0.61, 0.36, 1] }}
                  className="group relative w-[82vw] max-w-[360px] snap-start shrink-0 border-r border-b border-border p-7 lg:p-10 lg:w-1/3 lg:max-w-none lg:border-b-0 last:border-r-0 transition-colors duration-500 hover:bg-card/60"
                >
                  <div className="flex items-center justify-between">
                    <Eyebrow>{c.k}</Eyebrow>
                    <span className="font-serif text-muted-foreground/70 text-sm">{String(i + 1).padStart(2, "0")} / 03</span>
                  </div>
                  <h3 className="mt-6 font-serif text-2xl leading-tight transition-colors group-hover:text-foreground/80">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground max-w-[36ch]">
                    {c.body}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-1.5 text-foreground/70 group-hover:text-foreground">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </motion.a>
              ))}
              {/* Wisch-Hinweis — nur sichtbar, solange die Reihe scrollbar ist */}
              <div
                className="flex w-20 shrink-0 flex-col items-center justify-center gap-1.5 border-b border-border text-muted-foreground lg:hidden"
                aria-hidden
              >
                <span className="flex items-center gap-1">
                  <ArrowLeft className="h-3.5 w-3.5 opacity-50" />
                  <ArrowRight className="h-3.5 w-3.5 animate-pulse" />
                </span>
                <span className="label-eyebrow">Wischen</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* PRAXIS / DOCTOR */}
      <section id="praxis" className="border-t border-border bg-card">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-12 gap-x-8 gap-y-12">
            <div className="col-span-12 lg:col-span-5">
              <Eyebrow>Über die Praxis</Eyebrow>
              <motion.h2
                {...fadeUp}
                className="mt-5 font-serif text-[36px] lg:text-[52px] leading-[1.04] tracking-[-0.01em] text-balance"
              >
                Eine ruhige Praxis,<br />
                in der Sie als Mensch zählen.
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
                    "radial-gradient(120% 80% at 50% 35%, color-mix(in oklch, var(--accent) 55%, transparent) 0%, color-mix(in oklch, var(--muted) 45%, var(--background) 55%) 45%, var(--background) 100%)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/3"
                    style={{
                  background:
                    "linear-gradient(to top, var(--background) 0%, color-mix(in oklch, var(--background) 20%, transparent) 60%, transparent 100%)",
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
                </figcaption>
              </motion.figure>

              {/* Credentials strip */}
              <div className="mt-8 border-t border-border pt-6 grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
                {[
                  { v: "25+", l: "Jahre klinische Erfahrung" },
                  { v: "DGIM", l: "Deutsche Gesellschaft für Innere Medizin" },
                  { v: "DGVS", l: "Gastroenterologie" },
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
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 sm:py-24 lg:py-32">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <Eyebrow>Leistungen · Kapitel I</Eyebrow>
              <motion.h2
                {...fadeUp}
                className="mt-4 font-serif text-[36px] lg:text-[52px] leading-[1.05] tracking-[-0.01em] max-w-[20ch] text-balance"
              >
                Diagnostik und Therapie,<br />
                auf das Wesentliche gebracht.
              </motion.h2>
            </div>
            <p className="text-[14.5px] leading-relaxed text-muted-foreground max-w-[42ch]">
              Sechs Schwerpunkte, in denen wir besonders erfahren sind. Alle Untersuchungen
              finden in der Praxis statt — mit kurzen Wegen, klarer Diagnostik und persönlicher Begleitung.
            </p>
          </div>

          <Carousel
            className="mt-14"
            opts={{
              align: "start",
              containScroll: "trimSnaps",
              watchDrag: true,
              dragFree: false,
            }}
            setApi={setApi}
          >
            <CarouselContent className="-ml-3 md:-ml-4 cursor-grab active:cursor-grabbing">
              {SERVICES.map((s) => (
                <CarouselItem key={s.title} className="pl-3 md:pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
                  <article className="group relative flex h-full flex-col border border-border bg-card p-7 lg:p-9 transition-colors duration-500 hover:bg-card/70">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm text-muted-foreground/80 tracking-tight">{s.n}</span>
                      <s.icon className="h-4 w-4 text-foreground/70 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                    <h3 className="mt-6 font-serif text-[26px] lg:text-[30px] leading-tight">{s.title}</h3>
                    <p className="mt-2 text-[12.5px] uppercase tracking-[0.16em] text-muted-foreground">
                      {s.sub}
                    </p>
                    <p className="mt-5 text-[14px] leading-relaxed text-foreground/80 max-w-[40ch]">
                      {s.body}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-6">
                      <span className="label-eyebrow">Kapitel I</span>
                      <a href="#termin" className="inline-flex items-center gap-1.5 text-[12.5px] tracking-tight text-foreground/70 hover:text-foreground transition-colors">
                        Sprechstunde anfragen <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Carousel controls — slide counter, snap dots + prev/next */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <div className="flex items-center gap-5">
              <span className="label-eyebrow tabular-nums">
                {String(current).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              {/* Snap-Dots — durchklicken oder wischen */}
              <div className="flex items-center gap-1.5" aria-hidden>
                {Array.from({ length: count }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    aria-label={`Leistung ${i + 1} von ${count}`}
                    className={`h-[3px] rounded-full transition-all duration-500 ${
                      i === current - 1
                        ? "w-8 bg-foreground"
                        : "w-4 bg-foreground/20 hover:bg-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => api?.scrollPrev()}
                disabled={!canPrev}
                aria-label="Vorherige Leistung"
                className="grid h-10 w-10 place-items-center rounded-[2px] border border-border text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => api?.scrollNext()}
                disabled={!canNext}
                aria-label="Nächste Leistung"
                className="grid h-10 w-10 place-items-center rounded-[2px] border border-border text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DIAGNOSTIK SPREAD */}
      <section id="diagnostik" className="border-t border-border bg-card">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 sm:py-24 lg:py-32">
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
                Wir bitten um Terminvereinbarung. Praxisanschrift: Dahlienstr. 19b, 23795 Bad Segeberg.
                In akuten Fällen erreichen Sie uns telefonisch
                während der Sprechzeiten unter{" "}
                <a href="tel:+494551882977" className="underline text-foreground/80 hover:text-foreground">04551-882977</a>
                {" "}oder per E-Mail unter{" "}
                <a href="mailto:Gastroenterologie-Segeberg@web.de" className="underline text-foreground/80 hover:text-foreground">Gastroenterologie-Segeberg@web.de</a>.
              </p>
              <div id="sprechzeiten" className="mt-8 divide-y divide-border border-y border-border">
                {HOURS.map((h) => (
                  <div key={h.day} className="grid grid-cols-12 gap-x-3 gap-y-1 py-3.5 items-baseline">
                    <div className="col-span-5 sm:col-span-4 font-serif text-[16px]">{h.day}</div>
                    <div className="col-span-7 sm:col-span-6 text-[13.5px] tabular-nums text-foreground/85">
                      {h.open}{h.close !== "—" && <span className="text-muted-foreground">{" · "}</span>}
                      {h.close !== "—" && h.close}
                    </div>
                    <div className="col-span-12 sm:col-span-2 text-left sm:text-right text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{h.note}</div>
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
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10">
            <div className="col-span-12 lg:col-span-4">
              <Eyebrow>Werdegang</Eyebrow>
              <h2 className="mt-4 font-serif text-[32px] lg:text-[42px] leading-[1.08] tracking-[-0.01em] max-w-[16ch] text-balance">
                Eine ärztliche Laufbahn in Stationen.
              </h2>
              <p className="mt-6 text-[14.5px] leading-relaxed text-foreground/80 max-w-[38ch]">
                Von Damaskus über Berlin, Bad Pyrmont und Otterndorf bis nach Bad Segeberg — Dr.&nbsp;Madi bringt über
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
                  <div className="col-span-4 lg:col-span-3 font-serif text-base lg:text-2xl tabular-nums leading-tight">{t.year}</div>
                  <div className="col-span-8 lg:col-span-9 text-[14.5px] lg:text-[15px] leading-relaxed text-foreground/85 max-w-[60ch]">
                    {t.text}
                  </div>
                </motion.li>
              ))}
              <li className="border-t border-border py-3 text-[11.5px] text-muted-foreground">
                Stand: 2025 · Auswahl; vollständiger Lebenslauf auf Anfrage.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* KONTAKT / Termin */}
      <section id="kontakt" className="border-t border-border bg-card">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 sm:py-24 lg:py-32">
          <Rule>Kapitel III · Kontakt</Rule>
          <div className="mt-10 grid grid-cols-12 gap-x-8 gap-y-12">
            <div className="col-span-12 lg:col-span-7">
              <h2 id="termin" className="font-serif text-[40px] lg:text-[60px] leading-[1.04] tracking-[-0.01em] text-balance">
                Termin in der<br />
                Gastropraxis.
              </h2>
              <p className="mt-6 max-w-[52ch] text-[15.5px] leading-relaxed text-foreground/85">
                Wir nehmen uns Zeit für Sie. Bitte vereinbaren Sie einen Termin —
                telefonisch oder per E-Mail.
              </p>


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
                  Dahlienstr. 19b<br />
                  23795 Bad Segeberg
                </address>

                <div className="mt-8 grid grid-cols-1 gap-4">
                  <a href="tel:+494551882977" className="group flex items-center justify-between border-t border-border pt-4">
                    <span className="flex items-center gap-2 text-[13.5px] text-muted-foreground"><Phone className="h-3.5 w-3.5" /> Telefon</span>
                    <span className="text-[15px] tracking-tight group-hover:text-foreground">04551-882977</span>
                  </a>
                  <a href="mailto:Gastroenterologie-Segeberg@web.de" className="group flex items-center justify-between border-t border-border pt-4">
                    <span className="flex items-center gap-2 text-[13.5px] text-muted-foreground"><Mail className="h-3.5 w-3.5" /> E-Mail</span>
                    <span className="text-[14px] tracking-tight group-hover:text-foreground truncate ml-2">Gastroenterologie-Segeberg@web.de</span>
                  </a>
                  <a href="#sprechzeiten" className="group flex items-center justify-between border-t border-b border-border py-4">
                    <span className="flex items-center gap-2 text-[13.5px] text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" /> Sprechzeiten</span>
                    <span className="text-[13.5px] tracking-tight text-foreground/80 group-hover:text-foreground">Mo – Fr · ab 08:00</span>
                  </a>
                </div>

                <div className="mt-8 pt-4 border-t border-border">
                  <p className="text-[11.5px] uppercase tracking-[0.18em] text-muted-foreground">Anfahrt</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-foreground/85 max-w-[36ch]">
                    Mit dem Bus: 9-11 Min · Barrierefreier Zugang.
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
            <div className="col-span-12 min-[430px]:col-span-6 lg:col-span-3">
              <Eyebrow>Praxis</Eyebrow>
              <ul className="mt-5 space-y-2 text-[13.5px] text-foreground/85">
                <li><a href="#praxis" className="hover:text-foreground">Über die Praxis</a></li>
                <li><a href="#leistungen" className="hover:text-foreground">Leistungen</a></li>
                <li><a href="#diagnostik" className="hover:text-foreground">Diagnostik</a></li>
                <li><a href="#sprechzeiten" className="hover:text-foreground">Sprechzeiten</a></li>
              </ul>
            </div>
            <div className="col-span-12 min-[430px]:col-span-6 lg:col-span-3">
              <Eyebrow>Patient:innen</Eyebrow>
              <ul className="mt-5 space-y-2 text-[13.5px] text-foreground/85">
                <li><a href="tel:+494551882977" className="hover:text-foreground">Anrufen: 04551-882977</a></li>
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
                Verantwortlich im Sinne des § 5 TMG: Dr. med. Maher Madi · Dahlienstr. 19b ·
                23795 Bad Segeberg · Telefon 04551-882977 · E-Mail Gastroenterologie-Segeberg@web.de.
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
