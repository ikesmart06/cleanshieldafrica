import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  Phone, MessageCircle, ShieldCheck, Droplets, Zap, Leaf, Sparkles, Truck, BadgeCheck,
  Clock, Wallet, ChevronDown, Menu, X, Check, Info, MapPin, ArrowRight, Star,
} from 'lucide-react';
import { SITE, telLink, waLink } from './config';
import { T, type Lang } from './i18n';

const B = import.meta.env.BASE_URL;

/* ---------- helpers ---------- */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), io.unobserve(e.target))),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function getInitialLang(): Lang {
  try {
    const saved = localStorage.getItem('cs-lang');
    if (saved === 'fr' || saved === 'en') return saved;
  } catch { /* storage blocked */ }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'fr';
}

const WhatsAppIcon = ({ className = 'size-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.43 9.44-9.43a9.38 9.38 0 0 1 9.43 9.44c0 5.2-4.23 9.43-9.44 9.43m8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.79.72.7 5.8.7 12.06c0 2 .52 3.95 1.52 5.67L.6 23.6l6.01-1.58a11.3 11.3 0 0 0 5.43 1.38h.01c6.25 0 11.34-5.09 11.34-11.34 0-3.03-1.18-5.88-3.32-8.02" />
  </svg>
);

function Section({ id, className = '', children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-24 px-4 sm:px-6 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] sm:text-xs sm:tracking-[0.14em] ${light ? 'bg-white/10 text-gold-300 ring-1 ring-white/15' : 'bg-violet-100 text-violet-800'}`}>
      <span className={`size-1.5 rounded-full ${light ? 'bg-gold-300' : 'bg-violet-600'}`} />
      {children}
    </span>
  );
}

/* ---------- app ---------- */

export default function App() {
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const t = T[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [pack, setPack] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);
  useReveal();

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('cs-lang', lang); } catch { /* ignore */ }
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const helloLink = waLink(t.waHello);
  const area = SITE.deliveryArea[lang];
  const navItems = [
    ['product', t.nav.product], ['benefits', t.nav.benefits], ['how', t.nav.how], ['packs', t.nav.packs], ['faq', t.nav.faq],
  ] as const;

  function choosePack(i: number) {
    setPack(i);
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => formRef.current?.querySelector<HTMLInputElement>('input[name=name]')?.focus({ preventScroll: true }), 650);
  }

  function submitOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const o = t.orderSec;
    const p = t.packs.items[pack];
    const msg = [
      o.msgHello,
      '',
      `🧴 ${o.qty} : ${p.n} (${p.q})`,
      `📏 ${o.size} : ${f.get('size')}`,
      `👤 ${o.name} : ${f.get('name')}`,
      `📞 ${o.phone} : ${f.get('phone')}`,
      `📍 ${o.city} : ${f.get('city')}`,
      f.get('note') ? `💬 ${f.get('note')}` : '',
      '',
      o.msgEnd,
    ].filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n');
    window.open(waLink(msg), '_blank', 'noopener');
  }

  const benefitIcons = [Droplets, Zap, Leaf, Sparkles];
  const trustIcons = [BadgeCheck, Clock, Wallet, Truck];

  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      {/* Announcement */}
      <div className="bg-violet-950 px-4 py-2 text-center text-[13px] font-medium text-violet-100">
        {t.announce.replace('{area}', area)}
        <a href={telLink} className="ml-2 hidden font-semibold text-gold-300 underline-offset-4 hover:underline sm:inline">
          {SITE.phoneDisplay}
        </a>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/85 shadow-[0_1px_0_rgba(46,16,101,.08),0_8px_24px_-12px_rgba(46,16,101,.18)] backdrop-blur-xl' : 'bg-cream'}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:h-[72px] sm:px-6">
          <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label="CleanShield">
            <img src={`${B}logo.svg`} alt="" width={40} height={40} className="size-9 sm:size-10" />
            <span className="font-display text-xl font-extrabold tracking-tight text-violet-950">
              Clean<span className="text-violet-600">Shield</span>
            </span>
          </a>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {navItems.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="rounded-full px-3.5 py-2 text-sm font-medium text-ink/70 transition hover:bg-violet-50 hover:text-violet-900">
                {label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex rounded-full bg-violet-100/70 p-0.5 text-xs font-bold" role="group" aria-label="Language">
              {(['fr', 'en'] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                  className={`rounded-full px-2.5 py-1.5 uppercase transition ${lang === l ? 'bg-white text-violet-900 shadow-sm' : 'text-violet-700/70 hover:text-violet-900'}`}>
                  {l}
                </button>
              ))}
            </div>
            <a href={telLink} className="btn-call hidden sm:inline-flex">
              <Phone className="size-4" /> {t.call}
            </a>
            <a href="#order" className="btn-primary hidden !py-2.5 md:inline-flex">{t.order}</a>
            <button className="grid size-10 place-items-center rounded-full text-violet-950 hover:bg-violet-100 lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu" aria-expanded={menuOpen}>
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-violet-100 bg-white px-4 pb-5 pt-2 lg:hidden">
            {navItems.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 font-medium text-ink/80 hover:bg-violet-50">
                {label}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={telLink} className="btn-call justify-center"><Phone className="size-4" /> {t.call}</a>
              <a href={helloLink} target="_blank" rel="noopener" className="btn-wa justify-center !py-3"><WhatsAppIcon /> WhatsApp</a>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10">
          <div className="hero-bg absolute inset-x-3 inset-y-0 rounded-[2rem] sm:inset-x-6 sm:rounded-[2.5rem]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-2 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[1.1fr_.9fr] lg:gap-6">
            <div className="text-center lg:text-left">
              <div data-reveal><Eyebrow light><ShieldCheck className="size-3.5" />{t.hero.badge}</Eyebrow></div>
              <h1 data-reveal className="mt-6 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[4.4rem]">
                {t.hero.title1}{' '}
                <span className="whitespace-nowrap bg-gradient-to-r from-gold-300 to-gold-400 bg-clip-text text-transparent">
                  {t.hero.title2}
                </span>
                <br />{t.hero.title3}
              </h1>
              <p data-reveal className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-violet-100/85 lg:mx-0">{t.hero.sub}</p>

              <div data-reveal className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a href="#order" className="btn-wa text-base"><WhatsAppIcon /> {t.orderWa}</a>
                <a href={telLink} className="btn-ghost-light text-base">
                  <span className="relative grid size-7 place-items-center rounded-full bg-white/15">
                    <span className="absolute inset-0 animate-ping rounded-full bg-white/25" />
                    <Phone className="relative size-3.5" />
                  </span>
                  {t.callNow}
                </a>
              </div>
              <p data-reveal className="mt-4 flex items-center justify-center gap-2 text-sm text-violet-200/80 lg:justify-start">
                <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-emerald-400" /></span>
                {t.hero.ctaHint}
              </p>
            </div>

            {/* bottle */}
            <div className="relative mx-auto flex h-[440px] w-full max-w-md items-center justify-center sm:h-[540px]" data-reveal>
              <div className="absolute size-[300px] rounded-full bg-gold-300/25 blur-3xl sm:size-[380px]" aria-hidden="true" />
              <div className="absolute size-[280px] rounded-full border border-white/15 sm:size-[380px]" aria-hidden="true" />
              <div className="absolute size-[360px] rounded-full border border-dashed border-white/10 sm:size-[480px] spin-slow" aria-hidden="true" />
              <img src={`${B}img/bottle-hero.webp`} alt="CleanShield INT Liquid Supplement" width={341} height={1106}
                className="float relative h-[400px] w-auto drop-shadow-[0_40px_40px_rgba(15,4,40,.55)] sm:h-[500px]" />
              <div className="chip left-0 top-14 sm:left-2"><Droplets className="size-4 text-sky-500" />{t.hero.chip1}</div>
              <div className="chip right-0 top-1/2 [animation-delay:-2s] sm:-right-2"><Zap className="size-4 text-gold-500" />{t.hero.chip2}</div>
              <div className="chip bottom-12 left-2 [animation-delay:-4s] sm:left-6"><ShieldCheck className="size-4 text-emerald-600" />{t.hero.chip3}</div>
            </div>
          </div>

          {/* trust bar */}
          <div className="relative mx-auto -mb-4 mt-6 max-w-5xl px-2 sm:mt-2 sm:px-8">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur md:grid-cols-4">
              {t.trust.map((x, i) => {
                const I = trustIcons[i];
                return (
                  <div key={i} className="flex items-center gap-3 bg-violet-950/40 px-4 py-4 sm:px-5">
                    <I className="size-6 shrink-0 text-gold-300" />
                    <div className="leading-tight">
                      <div className="font-display text-lg font-bold text-white">{x.k}</div>
                      <div className="text-xs text-violet-200/80 sm:text-[13px]">{x.v}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="overflow-hidden border-y border-violet-200/60 bg-white py-4" aria-hidden="true">
          <div className="marquee flex w-max gap-10">
            {[...t.marquee, ...t.marquee, ...t.marquee, ...t.marquee].map((w, i) => (
              <span key={i} className="flex items-center gap-10 font-display text-xl font-bold uppercase tracking-wide text-violet-900/80 sm:text-2xl">
                {w}<Star className="size-4 fill-gold-400 text-gold-400" />
              </span>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <Section id="product" className="py-20 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div data-reveal className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-100 via-white to-gold-100/60 p-8 ring-1 ring-violet-200/70 sm:p-12">
                <div className="dots absolute inset-0 opacity-50" aria-hidden="true" />
                <div className="relative flex items-end justify-center gap-6 sm:gap-10">
                  <img src={`${B}img/bottle-slim.png`} alt="CleanShield 8 oz" width={110} height={424} className="h-56 w-auto drop-shadow-xl sm:h-72" loading="lazy" />
                  <img src={`${B}img/bottle-tall.png`} alt="CleanShield 32 oz" width={112} height={335} className="h-48 w-auto drop-shadow-xl sm:h-60" loading="lazy" />
                </div>
                <div className="relative mt-8 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-violet-100">
                    <div className="text-xs font-medium text-ink/50">{t.about.mkt}</div>
                    <div className="mt-1 font-semibold text-violet-950">Africa Health Solution</div>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-violet-100">
                    <div className="text-xs font-medium text-ink/50">{t.about.mfg}</div>
                    <div className="mt-1 font-semibold text-violet-950">Allgone LLC · USA</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div data-reveal><Eyebrow>{t.about.eyebrow}</Eyebrow></div>
              <h2 data-reveal className="h2 mt-4">{t.about.title}</h2>
              <p data-reveal className="mt-5 text-lg leading-relaxed text-ink/70">{t.about.body}</p>
              <ul className="mt-7 space-y-3">
                {t.about.points.map((p) => (
                  <li key={p} data-reveal className="flex items-center gap-3 font-medium">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="size-4" strokeWidth={3} /></span>
                    {p}
                  </li>
                ))}
              </ul>
              <div data-reveal className="mt-9 flex flex-wrap gap-3">
                <a href="#packs" className="btn-primary">{t.order} <ArrowRight className="size-4" /></a>
                <a href={telLink} className="btn-call"><Phone className="size-4" /> {SITE.phoneDisplay}</a>
              </div>
            </div>
          </div>
        </Section>

        {/* BENEFITS */}
        <Section id="benefits" className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <div data-reveal><Eyebrow>{t.benefits.eyebrow}</Eyebrow></div>
            <h2 data-reveal className="h2 mt-4">{t.benefits.title}</h2>
            <p data-reveal className="mt-4 text-lg text-ink/65">{t.benefits.sub}</p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.benefits.items.map((b, i) => {
              const I = benefitIcons[i];
              const tones = ['bg-sky-100 text-sky-700', 'bg-gold-100 text-gold-700', 'bg-emerald-100 text-emerald-700', 'bg-violet-100 text-violet-700'];
              return (
                <div key={b.t} data-reveal style={{ transitionDelay: `${i * 80}ms` }}
                  className="group rounded-3xl bg-cream p-7 ring-1 ring-violet-100 transition duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_24px_48px_-20px_rgba(76,29,149,.35)]">
                  <div className={`grid size-14 place-items-center rounded-2xl transition group-hover:scale-110 ${tones[i]}`}><I className="size-7" /></div>
                  <h3 className="mt-6 font-display text-xl font-bold text-violet-950">{b.t}</h3>
                  <p className="mt-2 leading-relaxed text-ink/65">{b.d}</p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* HOW */}
        <Section id="how" className="py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            <div>
              <div data-reveal><Eyebrow>{t.how.eyebrow}</Eyebrow></div>
              <h2 data-reveal className="h2 mt-4">{t.how.title}</h2>
              <div data-reveal className="mt-8 rounded-3xl border border-gold-300/60 bg-gold-100/50 p-6">
                <div className="flex items-center gap-2 font-semibold text-gold-800"><Info className="size-5" />{t.how.warnTitle}</div>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{t.how.warn}</p>
              </div>
            </div>
            <ol className="relative space-y-5">
              {t.how.steps.map((s, i) => (
                <li key={s.t} data-reveal style={{ transitionDelay: `${i * 100}ms` }}
                  className="flex gap-5 rounded-3xl bg-white p-6 ring-1 ring-violet-100 sm:p-7">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-violet-700 font-display text-2xl font-extrabold text-white shadow-lg shadow-violet-700/30">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-violet-950">{s.t}</h3>
                    <p className="mt-1.5 leading-relaxed text-ink/65">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        {/* PACKS */}
        <Section id="packs" className="bg-violet-950 py-20 text-white sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <div data-reveal><Eyebrow light>{t.packs.eyebrow}</Eyebrow></div>
            <h2 data-reveal className="h2 mt-4 !text-white">{t.packs.title}</h2>
            <p data-reveal className="mt-4 text-lg text-violet-200/80">{t.packs.sub}</p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.packs.items.map((p, i) => {
              const best = i === 1;
              return (
                <div key={p.n} data-reveal style={{ transitionDelay: `${i * 80}ms` }}
                  className={`relative flex flex-col rounded-3xl p-7 transition duration-300 hover:-translate-y-1.5 ${best ? 'bg-white text-ink shadow-[0_30px_60px_-20px_rgba(250,204,21,.35)] ring-2 ring-gold-400' : 'bg-white/[.06] ring-1 ring-white/12 hover:bg-white/10'}`}>
                  {best && <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gold-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-950">⭐ {t.packs.best}</span>}
                  <div className="flex h-24 items-end gap-1">
                    {Array.from({ length: Math.min(p.q, 4) }).map((_, k) => (
                      <img key={k} src={`${B}img/bottle-slim.png`} alt="" className="h-20 w-auto drop-shadow-md" style={{ marginLeft: k ? -14 : 0, height: 80 - k * 4 }} loading="lazy" />
                    ))}
                    {p.q > 4 && <span className={`ml-2 font-display text-lg font-bold ${best ? 'text-violet-700' : 'text-gold-300'}`}>×2</span>}
                  </div>
                  <h3 className={`mt-5 font-display text-2xl font-extrabold ${best ? 'text-violet-950' : 'text-white'}`}>{p.n}</h3>
                  <p className={`mt-1 flex-1 ${best ? 'text-ink/65' : 'text-violet-200/75'}`}>{p.d}</p>
                  <button onClick={() => choosePack(i)}
                    className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${best ? 'bg-violet-700 text-white hover:bg-violet-800' : 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white hover:text-violet-950'}`}>
                    {t.packs.choose} <ArrowRight className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ORDER */}
        <Section id="order" className="py-20 sm:py-28">
          <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(46,16,101,.35)] ring-1 ring-violet-100 lg:grid-cols-[.9fr_1.1fr]">
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 to-violet-950 p-8 text-white sm:p-12">
              <div className="dots-light absolute inset-0 opacity-40" aria-hidden="true" />
              <div className="relative">
                <Eyebrow light>{t.orderSec.eyebrow}</Eyebrow>
                <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{t.orderSec.title}</h2>
                <p className="mt-4 text-violet-100/85">{t.orderSec.sub}</p>
                <ul className="mt-8 space-y-3">
                  {t.orderSec.perks.map((p) => (
                    <li key={p} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-gold-400 text-violet-950"><Check className="size-3.5" strokeWidth={3} /></span>{p}</li>
                  ))}
                </ul>
                <a href={telLink} className="mt-10 flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 transition hover:bg-white/15">
                  <span className="relative grid size-12 place-items-center rounded-full bg-gold-400 text-violet-950">
                    <span className="absolute inset-0 animate-ping rounded-full bg-gold-400/50" />
                    <Phone className="relative size-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-violet-200">{t.orderSec.orCall}</span>
                    <span className="block font-display text-xl font-bold">{SITE.phoneDisplay}</span>
                  </span>
                </a>
              </div>
            </div>

            <form ref={formRef} onSubmit={submitOrder} className="grid gap-4 p-6 sm:grid-cols-2 sm:p-10">
              <div className="sm:col-span-2">
                <span className="label">{t.orderSec.qty}</span>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {t.packs.items.map((p, i) => (
                    <button type="button" key={p.n} onClick={() => setPack(i)} aria-pressed={pack === i}
                      className={`rounded-xl px-2 py-3 text-sm font-semibold ring-1 transition ${pack === i ? 'bg-violet-700 text-white ring-violet-700' : 'bg-cream text-ink/80 ring-violet-200 hover:ring-violet-400'}`}>
                      {p.n}
                    </button>
                  ))}
                </div>
              </div>
              <label className="sm:col-span-2"><span className="label">{t.orderSec.size}</span>
                <select name="size" className="field">{t.orderSec.sizes.map((s) => <option key={s}>{s}</option>)}</select>
              </label>
              <label><span className="label">{t.orderSec.name}</span><input name="name" required autoComplete="name" className="field" /></label>
              <label><span className="label">{t.orderSec.phone}</span><input name="phone" required type="tel" autoComplete="tel" placeholder={SITE.phoneDisplay} className="field" /></label>
              <label className="sm:col-span-2"><span className="label">{t.orderSec.city}</span><input name="city" required autoComplete="address-level2" className="field" /></label>
              <label className="sm:col-span-2"><span className="label">{t.orderSec.note}</span><textarea name="note" rows={3} placeholder={t.orderSec.notePh} className="field resize-none" /></label>
              <button type="submit" className="btn-wa mt-2 w-full text-base sm:col-span-2"><WhatsAppIcon /> {t.orderSec.submit}</button>
            </form>
          </div>
        </Section>

        {/* FAQ */}
        <Section id="faq" className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <div data-reveal><Eyebrow>{t.faq.eyebrow}</Eyebrow></div>
              <h2 data-reveal className="h2 mt-4">{t.faq.title}</h2>
            </div>
            <div className="mt-12 space-y-3">
              {t.faq.items.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q} data-reveal className={`rounded-2xl ring-1 transition ${open ? 'bg-violet-50/60 ring-violet-300' : 'bg-cream ring-violet-100'}`}>
                    <button className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6" onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open}>
                      <span className="font-display text-lg font-bold text-violet-950">{f.q}</span>
                      <ChevronDown className={`size-5 shrink-0 text-violet-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden"><p className="px-5 pb-5 leading-relaxed text-ink/70 sm:px-6">{f.a}</p></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* FINAL CTA */}
        <Section className="py-16 sm:py-24">
          <div data-reveal className="hero-bg relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-20">
            <img src={`${B}img/bottle-hero.webp`} alt="" className="pointer-events-none absolute -bottom-24 -right-6 hidden h-[420px] rotate-12 opacity-90 md:block" loading="lazy" />
            <img src={`${B}img/bottle-hero.webp`} alt="" className="pointer-events-none absolute -bottom-28 -left-4 hidden h-[360px] -rotate-12 opacity-60 lg:block" loading="lazy" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">{t.final.title}</h2>
              <p className="mt-4 text-lg text-violet-100/85">{t.final.sub}</p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={telLink} className="btn-gold text-base"><Phone className="size-5" /> {t.callNow}</a>
                <a href={helloLink} target="_blank" rel="noopener" className="btn-wa text-base"><WhatsAppIcon /> WhatsApp</a>
              </div>
            </div>
          </div>
        </Section>
      </main>

      {/* FOOTER */}
      <footer className="bg-violet-950 px-4 pb-28 pt-16 text-violet-200 sm:px-6 md:pb-12">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={`${B}logo.svg`} alt="" width={40} height={40} className="size-10" />
              <span className="font-display text-xl font-extrabold text-white">Clean<span className="text-gold-300">Shield</span></span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-violet-200/75">{t.footer.tag}</p>
            <div className="mt-5 flex gap-2">
              {([['facebook', SITE.facebook, 'Facebook'], ['instagram', SITE.instagram, 'Instagram'], ['tiktok', SITE.tiktok, 'TikTok']] as const)
                .filter(([, url]) => url)
                .map(([k, url, label]) => (
                  <a key={k} href={url} target="_blank" rel="noopener" className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20">{label}</a>
                ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold text-white">{t.footer.links}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {navItems.map(([id, label]) => <li key={id}><a href={`#${id}`} className="hover:text-white">{label}</a></li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-white">{t.footer.contact}</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href={telLink} className="flex items-center gap-2 hover:text-white"><Phone className="size-4 text-gold-300" />{SITE.phoneDisplay}</a></li>
              <li><a href={helloLink} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-white"><MessageCircle className="size-4 text-gold-300" />WhatsApp</a></li>
              <li className="flex items-center gap-2"><MapPin className="size-4 text-gold-300" />{SITE.city}</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-xs leading-relaxed text-violet-300/60">
          <p>{t.footer.disclaimer}</p>
          <p className="mt-3">© {new Date().getFullYear()} CleanShield. {t.footer.rights}</p>
        </div>
      </footer>

      {/* Floating WhatsApp (desktop) */}
      <a href={helloLink} target="_blank" rel="noopener" aria-label="WhatsApp"
        className="fixed bottom-6 right-6 z-50 hidden size-16 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-6px_rgba(37,211,102,.6)] transition hover:scale-110 md:grid">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
        <WhatsAppIcon className="relative size-8" />
      </a>

      {/* Sticky action bar (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-violet-100 bg-white/95 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <a href={telLink} className="flex items-center justify-center gap-2 rounded-full bg-violet-700 py-3.5 font-bold text-white active:scale-95">
          <Phone className="size-5" /> {t.call}
        </a>
        <a href={helloLink} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 font-bold text-white active:scale-95">
          <WhatsAppIcon /> WhatsApp
        </a>
      </div>
    </div>
  );
}
