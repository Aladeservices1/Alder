import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Clock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  
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
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-background text-foreground overflow-hidden">
      {/* SECTION 1 - NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'backdrop-blur-sm bg-white/80 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1200px] mx-auto px-8 flex items-center justify-between">
          <div className="font-serif tracking-[-0.02em] text-[1.25rem]">Alder Home</div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('services')} className="font-sans text-[0.9rem] uppercase tracking-[0.2em] text-muted-foreground hover:opacity-70 transition-opacity">Services</button>
            <button onClick={() => scrollTo('philosophy')} className="font-sans text-[0.9rem] uppercase tracking-[0.2em] text-muted-foreground hover:opacity-70 transition-opacity">Philosophy</button>
            <button onClick={() => scrollTo('contact')} className="font-sans text-[0.9rem] uppercase tracking-[0.2em] text-muted-foreground hover:opacity-70 transition-opacity">Contact</button>
          </div>
          <a href="mailto:hello@alderhome.com" className="font-sans text-[0.9rem] uppercase tracking-[0.2em] text-muted-foreground hover:opacity-70 transition-opacity">
            hello@alderhome.com
          </a>
        </div>
      </nav>

      {/* SECTION 2 - HERO */}
      <section className="animate-hero-bg min-h-screen flex flex-col items-center justify-center px-8 relative pt-20">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mb-[1.5rem]"
          >
            <span className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">PORTLAND, OREGON</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="font-serif text-5xl md:text-[4.5rem] tracking-[-0.02em] font-normal max-w-[900px] leading-tight mb-[1.5rem] text-foreground"
          >
            Care that feels like home.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="font-sans text-[1.25rem] font-light text-muted-foreground max-w-[600px] leading-[1.7]"
          >
            Personalized adult home care in the comfort of where you belong.
          </motion.p>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="w-[1px] h-[40px] bg-border animate-scroll-pulse" />
        </div>
      </section>

      {/* SECTION 3 - PHILOSOPHY */}
      <section id="philosophy" ref={philosophyRef} className="py-16 md:py-[8rem] bg-secondary flex flex-col items-center text-center px-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center">
          <span className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground mb-8 block">
            — Our philosophy —
          </span>
          <h2 className="font-serif text-3xl md:text-[2.25rem] italic max-w-[800px] leading-snug mb-6 text-foreground">
            "The final years deserve the same dignity as the first."
          </h2>
          <p className="font-sans text-[0.9rem] text-muted-foreground">
            Alder Home — Portland
          </p>
        </div>
      </section>

      {/* SECTION 4 - SERVICES */}
      <section id="services" ref={servicesRef} className="py-16 md:py-[8rem] px-8 bg-background">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="text-center mb-16">
            <span className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground block mb-4">
              — How we care —
            </span>
            <h2 className="font-serif text-[3rem] tracking-[-0.02em] font-normal text-foreground">
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
              <div key={i} className="service-card p-[2.5rem] bg-transparent transition-transform duration-300 ease-out hover:-translate-y-[6px]">
                <div className="mb-6">{s.icon}</div>
                <h3 className="font-serif text-[1.5rem] text-foreground mb-4">{s.title}</h3>
                <p className="font-sans text-[0.95rem] text-muted-foreground leading-[1.5] max-w-[560px]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - ALDER ROOTS */}
      <section ref={rootsRef} className="py-16 md:py-[8rem] px-8 bg-secondary">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-center gap-[4rem]">
          <div className="flex-1 max-w-[560px]">
            <h2 className="font-serif text-[2rem] tracking-[-0.02em] font-normal mb-8 text-foreground">
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
            <svg viewBox="0 0 300 300" className="w-[300px] h-[300px] animate-svg-breathe">
              <g>
                <ellipse cx="150" cy="150" rx="130" ry="110" fill="hsl(124 12% 48%)" opacity="0.5" />
                <ellipse cx="140" cy="140" rx="100" ry="120" fill="hsl(40 60% 98%)" stroke="hsl(95 19% 77%)" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* SECTION 6 - TESTIMONIAL */}
      <section ref={testimonialRef} className="py-16 md:py-[8rem] bg-background flex flex-col items-center text-center px-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center">
          <span className="font-serif text-[5rem] text-border leading-none block mb-4">"</span>
          <p className="font-sans text-[1.75rem] font-light italic text-foreground max-w-[750px] leading-[1.6] mb-8">
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
      <section id="contact" className="py-16 md:py-[8rem] bg-secondary flex flex-col items-center text-center px-8">
        <div className="max-w-[1200px] mx-auto w-full">
          <p className="font-sans text-[1.25rem] text-muted-foreground mb-6">
            Interested in learning more?
          </p>
          <a href="mailto:hello@alderhome.com" className="font-serif text-[1.75rem] md:text-[2.5rem] text-foreground hover:underline decoration-primary transition-all duration-300">
            hello@alderhome.com
          </a>
        </div>
      </section>

      {/* SECTION 8 - FOOTER */}
      <footer className="bg-[#2C2A28] py-16 px-8 text-[#FDFBF7]">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row justify-between gap-12">
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
            <a href="mailto:hello@alderhome.com" className="font-sans text-[0.85rem] text-[#B0AFA8] hover:text-[#FDFBF7] transition-colors">hello@alderhome.com</a>
            <a href="#" className="font-sans text-[0.85rem] text-[#B0AFA8] hover:text-[#FDFBF7] transition-colors">Instagram</a>
            <a href="#" className="font-sans text-[0.85rem] text-[#B0AFA8] hover:text-[#FDFBF7] transition-colors">LinkedIn</a>
          </div>
        </div>
        
        <div className="max-w-[1200px] mx-auto w-full mt-16 pt-8 border-t border-white/10 text-center">
          <p className="font-sans text-[0.7rem] text-[#6B6965]">
            Alder Home — Portland, Oregon
          </p>
        </div>
      </footer>
    </div>
  );
}
