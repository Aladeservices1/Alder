import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Users, Clock, Menu, X as XIcon } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChatWidget from '../components/ChatWidget';
import caregiverPortrait from '../assets/caregiver-portrait.png';
import seniorManPortrait from '../assets/senior-man-portrait.png';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const philosophyRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const rootsRef = useRef<HTMLElement>(null);
  const testimonialRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const defaultReveal = {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    };

    if (philosophyRef.current) {
      gsap.fromTo(philosophyRef.current.children,
        defaultReveal,
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: philosophyRef.current,
            start: "top 80%"
          }
        }
      );
    }

    if (servicesRef.current) {
      const cards = servicesRef.current.querySelectorAll('.service-card');
      gsap.fromTo(cards,
        defaultReveal,
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 75%"
          }
        }
      );
    }

    if (rootsRef.current) {
      gsap.fromTo(rootsRef.current.children,
        defaultReveal,
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: rootsRef.current,
            start: "top 75%"
          }
        }
      );
    }

    if (testimonialRef.current) {
      gsap.fromTo(testimonialRef.current.children,
        defaultReveal,
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: testimonialRef.current,
            start: "top 80%"
          }
        }
      );
    }
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, mobileMenuOpen ? 300 : 0);
  };

  return (
    <div className="w-full bg-background text-foreground overflow-x-hidden">

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 flex flex-col items-center justify-center"
            style={{ backgroundColor: '#FDFBF7', zIndex: 99990 }}
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2"
              style={{ color: '#6B6965' }}
              aria-label="Close menu"
            >
              <XIcon size={24} strokeWidth={1.5} />
            </button>
            <nav className="flex flex-col items-center gap-10">
              {[
                { label: 'Services', id: 'services' },
                { label: 'Philosophy', id: 'philosophy' },
                { label: 'Contact', id: 'contact' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="font-sans uppercase tracking-[0.2em] text-foreground"
                  style={{ fontSize: '1.125rem' }}
                >
                  {item.label}
                </button>
              ))}
              <a
                href="mailto:info@alderhomecare.org"
                className="font-sans text-muted-foreground"
                style={{ fontSize: '0.85rem', marginTop: '1rem' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                info@alderhomecare.org
              </a>
              <a
                href="tel:+19713462026"
                className="font-sans text-muted-foreground"
                style={{ fontSize: '0.85rem' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                (971) 346-2026
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 1 - NAVIGATION */}
      <nav
        className={`fixed top-0 left-0 right-0 transition-all duration-500 ${scrolled ? 'backdrop-blur-sm bg-white/80 py-4' : 'bg-transparent py-6'}`}
        style={{ zIndex: 9000 }}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="font-serif tracking-[-0.02em] text-[1.25rem] flex-shrink-0">Alder Home</div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('services')} className="font-sans text-[0.9rem] uppercase tracking-[0.2em] text-muted-foreground hover:opacity-70 transition-opacity">Services</button>
            <button onClick={() => scrollTo('philosophy')} className="font-sans text-[0.9rem] uppercase tracking-[0.2em] text-muted-foreground hover:opacity-70 transition-opacity">Philosophy</button>
            <button onClick={() => scrollTo('contact')} className="font-sans text-[0.9rem] uppercase tracking-[0.2em] text-muted-foreground hover:opacity-70 transition-opacity">Contact</button>
          </div>

          {/* Desktop email / Mobile hamburger */}
          <div className="flex items-center gap-4">
            <a href="mailto:info@alderhomecare.org" className="hidden md:block font-sans text-[0.9rem] uppercase tracking-[0.2em] text-muted-foreground hover:opacity-70 transition-opacity">
              info@alderhomecare.org
            </a>
            <button
              className="md:hidden p-1"
              style={{ color: '#6B6965' }}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION 2 - HERO */}
      <section
        className="min-h-screen flex flex-col items-center justify-center px-6 md:px-8 relative pt-20 pb-24"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1758691031798-3f14294143fd?ixlib=rb-4.1.0&fm=jpg&q=85&w=2400&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        {/* Warm overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(44,43,40,0.52) 0%, rgba(44,43,40,0.38) 60%, rgba(44,43,40,0.65) 100%)' }} />

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mb-6"
          >
            <span className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-white/70">PORTLAND, OREGON</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="font-serif tracking-[-0.02em] font-normal max-w-[900px] leading-tight mb-6 text-white"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}
          >
            Care that feels like home.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="font-sans font-light text-white/80 max-w-[600px] leading-[1.7]"
            style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}
          >
            Personalized adult home care in the comfort of where you belong.
          </motion.p>

          {/* Two portrait images */}
          <div className="grid grid-cols-2 gap-3 md:gap-5 mt-10 md:mt-14 w-full max-w-[340px] md:max-w-[440px]">
            <div className="overflow-hidden rounded-sm" style={{ aspectRatio: '3/4' }}>
              <img
                src={seniorManPortrait}
                alt="Senior man relaxing at home"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>
            <div className="overflow-hidden rounded-sm" style={{ aspectRatio: '3/4' }}>
              <img
                src={caregiverPortrait}
                alt="Caregiver gently brushing senior woman's hair"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10">
          <div className="w-[1px] h-[40px] bg-white/40 animate-scroll-pulse" />
        </div>
      </section>

      {/* SECTION 3 - PHILOSOPHY */}
      <section id="philosophy" ref={philosophyRef} className="py-16 md:py-[8rem] bg-secondary flex flex-col items-center text-center px-6 md:px-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center">
          <span className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground mb-8 block">
            — Our philosophy —
          </span>
          <h2
            className="font-serif italic max-w-[800px] leading-snug mb-6 text-foreground"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}
          >
            "The final years deserve the same dignity as the first."
          </h2>
          <p className="font-sans text-[0.9rem] text-muted-foreground">
            Alder Home — Portland
          </p>
        </div>
      </section>

      {/* SECTION 4 - SERVICES */}
      <section id="services" ref={servicesRef} className="py-16 md:py-[8rem] px-6 md:px-8 bg-background">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="text-center mb-12 md:mb-16">
            <span className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground block mb-4">
              — How we care —
            </span>
            <h2
              className="font-serif tracking-[-0.02em] font-normal text-foreground"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
            >
              Tailored support. Uncompromised dignity.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-[2.5rem]">
            {[
              {
                icon: <Heart size={32} className="text-accent opacity-80" />,
                title: "Personal Care",
                desc: "Bathing, grooming, and dressing approached with patience and dignity."
              },
              {
                icon: <Users size={32} className="text-accent opacity-80" />,
                title: "Genuine Companionship",
                desc: "Conversation, errands, and presence that make days feel whole."
              },
              {
                icon: <Clock size={32} className="text-accent opacity-80" />,
                title: "Medical Reminders",
                desc: "Medication monitoring and appointment coordination with care."
              }
            ].map((s, i) => (
              <div key={i} className="service-card p-8 md:p-[2.5rem] bg-transparent transition-transform duration-300 ease-out hover:-translate-y-[6px]">
                <div className="mb-6">{s.icon}</div>
                <h3 className="font-serif text-[1.5rem] text-foreground mb-4">{s.title}</h3>
                <p className="font-sans text-[0.95rem] text-muted-foreground leading-[1.5]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - ALDER ROOTS */}
      <section ref={rootsRef} className="py-16 md:py-[8rem] px-6 md:px-8 bg-secondary">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-center gap-12 md:gap-[4rem]">
          <div className="flex-1 max-w-[560px]">
            <h2
              className="font-serif tracking-[-0.02em] font-normal mb-8 text-foreground"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)' }}
            >
              Rooted in Portland
            </h2>
            <p className="font-sans text-[1.125rem] font-light leading-[1.7] text-foreground mb-6">
              Our caregivers are locals who know Portland, its neighborhoods, its rhythms, and its people. We believe that understanding the community is just as important as understanding the care.
            </p>
            <p className="font-sans text-[1.125rem] font-light leading-[1.7] text-foreground">
              Every caregiver is background-checked, bonded, and chosen for their warmth.
            </p>
          </div>
          <div className="flex-1 flex justify-center w-full">
            <svg viewBox="0 0 300 300" className="w-[220px] h-[220px] md:w-[300px] md:h-[300px] animate-svg-breathe">
              <g>
                <ellipse cx="150" cy="150" rx="130" ry="110" fill="hsl(124 12% 48%)" opacity="0.5" />
                <ellipse cx="140" cy="140" rx="100" ry="120" fill="hsl(40 60% 98%)" stroke="hsl(95 19% 77%)" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* SECTION 6 - TESTIMONIAL */}
      <section ref={testimonialRef} className="py-16 md:py-[8rem] bg-background flex flex-col items-center text-center px-6 md:px-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center">
          <span className="font-serif text-[5rem] text-border leading-none block mb-4">"</span>
          <p
            className="font-sans font-light italic text-foreground max-w-[750px] leading-[1.6] mb-8"
            style={{ fontSize: 'clamp(1.125rem, 3vw, 1.75rem)' }}
          >
            For the first time in years, my mother looked forward to her days. Not just cared for — truly seen.
          </p>
          <p className="font-sans text-[0.9rem] font-normal text-muted-foreground mb-2">
            — Family Member
          </p>
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-border">
            Portland, Oregon
          </p>
        </div>
      </section>

      {/* SECTION 7 - CONTACT */}
      <section id="contact" className="py-16 md:py-[8rem] bg-secondary flex flex-col items-center text-center px-6 md:px-8">
        <div className="max-w-[1200px] mx-auto w-full">
          <p className="font-sans text-[1.25rem] text-muted-foreground mb-6">
            Interested in learning more?
          </p>
          <a
            href="mailto:info@alderhomecare.org"
            className="font-serif text-foreground hover:underline decoration-primary transition-all duration-300 break-all"
            style={{ fontSize: 'clamp(1.25rem, 4vw, 2.5rem)' }}
          >
            info@alderhomecare.org
          </a>
          <a
            href="tel:+19713462026"
            className="font-serif text-foreground hover:underline decoration-primary transition-all duration-300 block mt-4"
            style={{ fontSize: 'clamp(1rem, 3vw, 1.75rem)', color: '#6B6965' }}
          >
            (971) 346-2026
          </a>
        </div>
      </section>

      {/* SECTION 8 - FOOTER */}
      <footer className="bg-[#2C2A28] py-16 px-6 md:px-8 text-[#FDFBF7]">
        <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-12">
          <div className="flex flex-col">
            <span className="font-serif text-[1.25rem] tracking-[-0.02em] mb-2">Alder Home</span>
            <span className="font-sans text-[0.85rem] text-[#B0AFA8]">Portland Adult Home Care</span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-sans text-[0.85rem] font-medium text-[#FDFBF7] mb-2">Services</span>
            <button onClick={() => scrollTo('services')} className="text-left font-sans text-[0.85rem] text-[#B0AFA8] hover:text-[#FDFBF7] transition-colors">Personal Care</button>
            <button onClick={() => scrollTo('services')} className="text-left font-sans text-[0.85rem] text-[#B0AFA8] hover:text-[#FDFBF7] transition-colors">Companionship</button>
            <button onClick={() => scrollTo('services')} className="text-left font-sans text-[0.85rem] text-[#B0AFA8] hover:text-[#FDFBF7] transition-colors">Medical Reminders</button>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-sans text-[0.85rem] font-medium text-[#FDFBF7] mb-2">Connect</span>
            <a href="mailto:info@alderhomecare.org" className="font-sans text-[0.85rem] text-[#B0AFA8] hover:text-[#FDFBF7] transition-colors break-all">info@alderhomecare.org</a>
            <a href="tel:+19713462026" className="font-sans text-[0.85rem] text-[#B0AFA8] hover:text-[#FDFBF7] transition-colors">(971) 346-2026</a>
            <a href="#" className="font-sans text-[0.85rem] text-[#B0AFA8] hover:text-[#FDFBF7] transition-colors">Instagram</a>
            <a href="#" className="font-sans text-[0.85rem] text-[#B0AFA8] hover:text-[#FDFBF7] transition-colors">LinkedIn</a>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto w-full mt-12 pt-8 border-t border-white/10 text-center">
          <p className="font-sans text-[0.7rem] text-[#6B6965]">
            Alder Home — Portland, Oregon
          </p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
