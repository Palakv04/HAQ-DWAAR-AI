import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Fingerprint,
  Mic,
  ShieldCheck,
} from 'lucide-react';

const slides = [
  {
    id: 'voice',
    eyebrow: 'BHASHINI VOICE-FIRST ASSISTANCE',
    title: 'Speak naturally. Discover the right welfare support.',
    description: 'Speak in your local dialect and let AI Mitra help you find schemes that may fit your real-life situation.',
    action: 'Talk to AI Mitra',
    icon: Mic,
    gradient: 'from-[#1e0a3c] via-[#351065] to-[#591d8f]',
    accent: 'bg-orange-500',
  },
  {
    id: 'digilocker',
    eyebrow: 'SECURE DOCUMENT READINESS',
    title: 'Fetch verified documents in one secure click.',
    description: 'Connect DigiLocker to check document readiness, find missing items, and prepare your application with confidence.',
    action: 'Check documents',
    icon: FileCheck2,
    gradient: 'from-[#123b35] via-[#075e54] to-[#059669]',
    accent: 'bg-emerald-500',
  },
  {
    id: 'passport',
    eyebrow: 'BENEFIT PASSPORT & READINESS',
    title: 'Know your next step before you apply.',
    description: 'Track your application readiness score, manage your profile, and move from a potential match to a clear action plan.',
    action: 'Open Benefit Passport',
    icon: Fingerprint,
    gradient: 'from-[#240b49] via-[#591d8f] to-[#9b3f9b]',
    accent: 'bg-amber-400',
  },
];

export const HeroCarousel = ({ onOpenVoice, onOpenDigiLocker, onOpenPassport }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];
  const ActiveIcon = activeSlide.icon;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [activeIndex]);

  const goToSlide = (index) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  const handleAction = () => {
    if (activeSlide.id === 'voice') onOpenVoice?.();
    if (activeSlide.id === 'digilocker') onOpenDigiLocker?.();
    if (activeSlide.id === 'passport') onOpenPassport?.();
  };

  return (
    <section
      className="relative w-full h-[300px] md:h-[380px] overflow-hidden rounded-3xl shadow-haq-lg"
      aria-roledescription="carousel"
      aria-label="HaqDwaar AI platform highlights"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${activeSlide.gradient} transition-colors duration-700`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_35%)]" />
      <div className="absolute -right-24 -bottom-40 h-96 w-96 rounded-full border border-white/10" />
      <div className="absolute right-10 top-8 hidden h-44 w-44 rounded-full border border-white/10 md:block" />

      <div className="relative z-10 flex h-full items-center px-6 py-8 sm:px-10 md:px-16">
        <div className="max-w-2xl text-white">
          <div className="mb-4 flex items-center gap-2 text-xs font-extrabold tracking-[0.16em] text-white/75 sm:text-sm">
            <span className={`grid h-8 w-8 place-items-center rounded-xl ${activeSlide.accent} text-white shadow-lg`}>
              <ActiveIcon className="h-4 w-4" />
            </span>
            <span>{activeSlide.eyebrow}</span>
          </div>
          <h2 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {activeSlide.title}
          </h2>
          <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-white/80 sm:text-base md:text-lg">
            {activeSlide.description}
          </p>
          <button
            type="button"
            onClick={handleAction}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#240b49] shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-50"
          >
            {activeSlide.action}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute right-10 hidden h-48 w-48 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm lg:flex">
          <div className="grid h-28 w-28 place-items-center rounded-full border border-white/20 bg-white/10">
            <ActiveIcon className="h-14 w-14 text-white/90" strokeWidth={1.4} />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => goToSlide(activeIndex - 1)}
        className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/40 sm:left-5"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => goToSlide(activeIndex + 1)}
        className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/40 sm:right-5"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2" role="tablist" aria-label="Carousel slides">
        {slides.map((slide, index) => (
          <button
            type="button"
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/75'}`}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === activeIndex}
            role="tab"
          />
        ))}
      </div>

      <div className="absolute bottom-5 right-6 hidden items-center gap-1.5 text-[11px] font-bold text-white/65 sm:flex">
        <ShieldCheck className="h-3.5 w-3.5" /> Verified citizen assistance
      </div>
    </section>
  );
};
