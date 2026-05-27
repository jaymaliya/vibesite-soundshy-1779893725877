"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";

const products = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "Bose QuietComfort Earbuds II",
    description: "Premium wireless earbuds with world-class noise cancellation and secure fit.",
    price: 24999,
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "White Wired Apple EarPods",
    description: "White, wired Apple EarPods meticulously nestled within their original retail packaging.",
    price: 300,
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "AKG Wired In-Ear Earphones",
    description: "Sleek AKG black wired in-ear earphones offer dependable performance and a sophisticated aesthetic.",
    price: 400,
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "SONY In-Ear Wired Earphones",
    description: "Sleek SONY in-ear wired earphones in charcoal black with ergonomic design for reliable audio.",
    price: 500,
  },
];

const features = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 4C11.163 4 4 11.163 4 20s7.163 16 16 16 16-7.163 16-16S28.837 4 20 4zm0 2c7.732 0 14 6.268 14 14S27.732 34 20 34 6 27.732 6 20 12.268 6 20 6zm0 4a2 2 0 100 4 2 2 0 000-4zm-1 7v10h2V17h-2z" fill="#C69957"/>
      </svg>
    ),
    title: "30-Hour Battery",
    body: "Up to 6 hours on a single charge, plus 24 more from the charging case. Your music never stops.",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 6C12.268 6 6 12.268 6 20s6.268 14 14 14 14-6.268 14-14S27.732 6 20 6zM9.757 17H13a1 1 0 010 2H9.757A10.008 10.008 0 0117 27.243V31a1 1 0 01-2 0v-3.757A10.008 10.008 0 019 20c0-.342.018-.679.051-1.012L9 19a1 1 0 010-2zM20 10a1 1 0 011 1v3.757A10.008 10.008 0 0129 21.757V25a1 1 0 01-2 0v-3.243A8.008 8.008 0 0020 14a8 8 0 00-8 8 1 1 0 01-2 0 10 10 0 0110-10zm0 6a4 4 0 110 8 4 4 0 010-8z" fill="#C69957"/>
      </svg>
    ),
    title: "Crystal Call Clarity",
    body: "Four-microphone array with beamforming technology isolates your voice in any environment.",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 4c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16S28.837 4 20 4zm-3 8h6a1 1 0 011 1v14a1 1 0 01-1 1h-6a1 1 0 01-1-1V13a1 1 0 011-1zm1 2v12h4V14h-4zm-8 5h3v2h-3v-2zm15 0h3v2h-3v-2z" fill="#C69957"/>
      </svg>
    ),
    title: "Instant Pairing",
    body: "Bluetooth 5.3 with multipoint connection. Switch between two devices seamlessly, without re-pairing.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => {
      (el as HTMLElement).style.cssText +=
        "opacity:0;transform:translateY(28px);transition:opacity 0.6s ease,transform 0.6s ease;";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    scrollLeft.current = carouselRef.current?.scrollLeft ?? 0;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current.offsetLeft ?? 0);
    carouselRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  };
  const handleMouseUp = () => { isDragging.current = false; };

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'Manrope', sans-serif", overflowX: "hidden" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap');
        :root { --bg:#FAF9F7; --surface:#A87E42; --primary:#C69957; --accent:#2B2C2D; --text:#1A1A1A; --muted:#9E8B72; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .nav-link:hover { color: var(--primary) !important; }
        .carousel-track { cursor: grab; user-select: none; }
        .carousel-track:active { cursor: grabbing; }
        .stagger-1 { transition-delay: 0.08s !important; }
        .stagger-2 { transition-delay: 0.16s !important; }
        .stagger-3 { transition-delay: 0.24s !important; }
      `}</style>

      {/* ─── NAVIGATION ─────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(250,249,247,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(43,44,45,0.1)" : "none",
        transition: "background 0.3s ease, border-color 0.3s ease",
        padding: "0 40px",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ padding: "4px 8px", borderRadius: "8px", background: scrolled ? "transparent" : "rgba(250,249,247,0.12)" }}>
            <img src="/logo.png" alt="Soundshy logo" style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} />
          </div>

          {/* Desktop nav links */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }} className="desktop-nav">
            {["Earbuds", "Headphones", "Accessories"].map((item) => (
              <button key={item} className="nav-link" onClick={() => router.push("/shop")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px", fontFamily: "'Manrope', sans-serif", fontWeight: 500, color: "var(--text)", padding: "8px 16px", transition: "color 0.15s ease" }}>{item}</button>
            ))}
            <button className="nav-link" onClick={() => document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px", fontFamily: "'Manrope', sans-serif", fontWeight: 500, color: "var(--text)", padding: "8px 16px", transition: "color 0.15s ease" }}>Our Story</button>
            <button className="nav-link" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px", fontFamily: "'Manrope', sans-serif", fontWeight: 500, color: "var(--text)", padding: "8px 16px", transition: "color 0.15s ease" }}>Support</button>
          </div>

          {/* Cart */}
          <button onClick={() => router.push("/checkout")} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", alignItems: "center", position: "relative", transition: "transform 0.15s ease" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileMenuOpen(true)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "8px" }} className="hamburger-btn" aria-label="Open menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "var(--accent)", display: "flex", flexDirection: "column", padding: "32px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FAF9F7" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div style={{ marginTop: "48px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {[["Shop", "/shop"], ["Our Story", "#our-story"], ["Support", "#contact"]].map(([label, path]) => (
              <button key={label} onClick={() => { setMobileMenuOpen(false); if (path.startsWith("#")) { document.getElementById(path.slice(1))?.scrollIntoView({ behavior: "smooth" }); } else { router.push(path); } }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "22px", fontFamily: "'Syne', sans-serif", fontWeight: 600, color: "#FAF9F7", padding: "16px 0", textAlign: "left", borderBottom: "1px solid rgba(250,249,247,0.1)" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── HERO ───────────────────────────────────────────────── */}
      <section style={{ width: "100%", minHeight: "85vh", background: "var(--accent)", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: "72px" }}>
        {/* Radial gradient background */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, #3D3E3F 0%, #2B2C2D 50%, #1A1A1B 100%)", zIndex: 0 }} />

        {/* Subtle gold ring decoration */}
        <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", border: "1px solid rgba(198,153,87,0.15)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 0 }} />
        <div style={{ position: "absolute", width: "800px", height: "800px", borderRadius: "50%", border: "1px solid rgba(198,153,87,0.08)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 0 }} />

        {/* Trust bar */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", gap: "32px", flexWrap: "wrap", justifyContent: "center", marginBottom: "32px", padding: "0 24px" }}>
          {[
            { icon: "★", text: "4.8 / 5 from 12,000+ reviews" },
            { icon: "✦", text: "Free delivery above ₹499" },
            { icon: "◆", text: "Trusted by 50,000+ listeners" },
          ].map((t) => (
            <span key={t.text} style={{ fontSize: "13px", fontFamily: "'Manrope', sans-serif", color: "rgba(198,153,87,0.9)", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "var(--primary)" }}>{t.icon}</span>{t.text}
            </span>
          ))}
        </div>

        {/* Eyebrow */}
        <p style={{ position: "relative", zIndex: 2, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: "var(--primary)", marginBottom: "16px" }}>
          Premium Audio — Soundshy
        </p>

        {/* Headline */}
        <h1 style={{ position: "relative", zIndex: 2, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(3rem, 6vw, 5.5rem)", letterSpacing: "-0.04em", lineHeight: 1.05, color: "#FAF9F7", textAlign: "center", maxWidth: "840px", padding: "0 24px", marginBottom: "40px" }}>
          Sound that<br />
          <span style={{ color: "var(--primary)" }}>moves you.</span>
        </h1>

        {/* Product image */}
        <div style={{ position: "relative", zIndex: 2, width: "clamp(280px, 45vw, 560px)", filter: "drop-shadow(0 24px 80px rgba(0,0,0,0.6))", marginBottom: "48px" }}>
          <img src="/product-1.jpg" alt="Bose QuietComfort Earbuds II — premium wireless earbuds" style={{ width: "100%", objectFit: "contain", transition: "transform 0.7s ease" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04) translateY(-4px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1) translateY(0)")} />
        </div>

        {/* CTA */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <button onClick={() => router.push("/shop")}
            style={{ height: "56px", padding: "0 48px", background: "var(--primary)", border: "none", borderRadius: "12px", color: "#1A1A1A", fontSize: "16px", fontFamily: "'Manrope', sans-serif", fontWeight: 700, cursor: "pointer", boxShadow: "0 12px 40px -8px rgba(198,153,87,0.5)", transition: "transform 0.15s ease" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
            Discover QuietComfort
          </button>
          <p style={{ fontSize: "14px", fontFamily: "'Manrope', sans-serif", color: "rgba(250,249,247,0.5)", letterSpacing: "0.02em" }}>
            Backed by 50+ years of audio innovation.
          </p>
        </div>

        {/* Scroll cue */}
        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 2, opacity: 0.4 }}>
          <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
            <rect x="1" y="1" width="18" height="30" rx="9" stroke="#FAF9F7" strokeWidth="1.5"/>
            <circle cx="10" cy="8" r="2.5" fill="#FAF9F7" style={{ animation: "scrollDot 1.8s ease-in-out infinite" }}/>
          </svg>
        </div>
        <style>{`@keyframes scrollDot { 0%,100% { transform: translateY(0); opacity:1; } 50% { transform: translateY(10px); opacity:0.3; } }`}</style>
      </section>

      {/* ─── SECTION: A New Dimension of Sound (Editorial Split) ── */}
      <section id="our-story" style={{ background: "#1C1C1C", padding: "96px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px", display: "grid", gridTemplateColumns: "60fr 40fr", gap: "64px", alignItems: "center" }}>
          {/* Left: image with clip-path */}
          <div className="reveal" style={{ overflow: "hidden", borderRadius: "24px", position: "relative" }}>
            <div style={{ clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%)", overflow: "hidden", borderRadius: "16px" }}>
              <img src="/product-1.jpg" alt="Bose QuietComfort earbuds showcasing premium build quality" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", transition: "transform 0.7s ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
            {/* Gold accent strip */}
            <div style={{ position: "absolute", top: "32px", left: "0", width: "4px", height: "80px", background: "var(--primary)", borderRadius: "0 4px 4px 0" }} />
          </div>

          {/* Right: text */}
          <div className="reveal stagger-1" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Eyebrow */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9E8B72" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><path d="M8 12s1.5-3 4-3 4 3 4 3-1.5 3-4 3-4-3-4-3z"/>
              </svg>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: "#9E8B72" }}>Sound Technology</span>
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1.1, color: "#FAF9F7" }}>
              A New Dimension<br />of Sound
            </h2>
            <p style={{ fontSize: "18px", lineHeight: 1.7, color: "#AAAAAA", fontFamily: "'Manrope', sans-serif", fontWeight: 400, maxWidth: "400px" }}>
              CustomTune technology personalises the noise cancellation and equalisation to the exact shape of your ear — delivering a sound signature that's uniquely yours, no manual adjustment needed.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
              {[
                ["Personalised ANC", "Adapts to your ear anatomy in real time for best-in-class silence."],
                ["11 levels of ANC", "Fine-tune how much world you want to let in."],
              ].map(([title, body]) => (
                <div key={title} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--primary)", marginTop: "10px", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "15px", color: "#FAF9F7", marginBottom: "4px" }}>{title}</p>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "14px", color: "#AAAAAA", lineHeight: 1.6 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION: Engineered for Your Ears (Circular image) ── */}
      <section style={{ background: "#121212", padding: "96px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          {/* Left: circular product shot — the VISUAL FINGERPRINT */}
          <div className="reveal" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", width: "clamp(280px, 36vw, 480px)", height: "clamp(280px, 36vw, 480px)" }}>
              {/* Outer gold ring */}
              <div style={{ position: "absolute", inset: "-12px", borderRadius: "50%", border: "1px solid rgba(198,153,87,0.3)" }} />
              <div style={{ position: "absolute", inset: "-24px", borderRadius: "50%", border: "1px solid rgba(198,153,87,0.12)" }} />
              {/* The circle */}
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", boxShadow: "0 40px 80px -20px rgba(198,153,87,0.25)" }}>
                <img src="/product-1.jpg" alt="Bose QuietComfort earbud close-up showing ergonomic ear fin design" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
              {/* Floating spec badge */}
              <div style={{ position: "absolute", bottom: "-16px", right: "-16px", background: "var(--primary)", borderRadius: "12px", padding: "12px 20px", boxShadow: "0 16px 40px rgba(198,153,87,0.4)" }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "20px", color: "#1A1A1A", lineHeight: 1 }}>IPX4</p>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "11px", color: "rgba(26,26,26,0.7)", marginTop: "2px" }}>Water Resistant</p>
              </div>
            </div>
          </div>

          {/* Right: text */}
          <div className="reveal stagger-1" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: "#9E8B72" }}>Ergonomic Design</span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(2.2rem, 4vw, 3.5rem)", letterSpacing: "-0.02em", lineHeight: 1.1, color: "#FAF9F7" }}>
              Engineered<br />for Your Ears
            </h2>
            <p style={{ fontSize: "18px", lineHeight: 1.7, color: "#AAAAAA", fontFamily: "'Manrope', sans-serif" }}>
              Three sizes of StayHear Max tips are included, tested with thousands of ear shapes. The soft, flexible silicone fin nestles into the natural ridge of your ear — providing stability through workouts, commutes, and long listening sessions.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "8px" }}>
              {[
                ["3 Tip Sizes", "Find your perfect fit instantly"],
                ["Silicone Fins", "Stays locked in, all day"],
                ["30g Weight", "Feather-light comfort"],
                ["Oval Form", "Natural ear canal alignment"],
              ].map(([stat, desc]) => (
                <div key={stat} style={{ padding: "16px", background: "rgba(198,153,87,0.06)", borderRadius: "12px", border: "1px solid rgba(198,153,87,0.12)" }}>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--primary)" }}>{stat}</p>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "13px", color: "#888", marginTop: "4px" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION: Lifestyle Quote Block ────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "520px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Background image with blur */}
        <img src="/product-2.jpg" alt="Person experiencing premium audio in an urban environment" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(2px) brightness(0.35)", zIndex: 0 }} />
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(43,44,45,0.4), rgba(26,26,26,0.75))", zIndex: 1 }} />
        {/* Text content */}
        <div className="reveal" style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "96px 40px", maxWidth: "900px" }}>
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: "var(--primary)", marginBottom: "24px" }}>The Soundshy Promise</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2.5rem, 4.5vw, 4rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "#FAF9F7", fontStyle: "italic", marginBottom: "24px" }}>
            Unrivaled Sound.<br />Uninterrupted Silence.
          </h2>
          <p style={{ fontSize: "20px", fontFamily: "'Manrope', sans-serif", fontWeight: 400, color: "#BBBBBB", lineHeight: 1.6 }}>
            The world is loud. Your music doesn't have to fight it.
          </p>
          <button onClick={() => router.push("/shop")} style={{ marginTop: "40px", height: "52px", padding: "0 40px", background: "transparent", border: "1.5px solid rgba(198,153,87,0.6)", borderRadius: "12px", color: "var(--primary)", fontSize: "15px", fontFamily: "'Manrope', sans-serif", fontWeight: 600, cursor: "pointer", transition: "transform 0.15s ease, background 0.2s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(198,153,87,0.12)"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
            Explore the Collection
          </button>
        </div>
      </section>

      {/* ─── SECTION: Your Day, Elevated (Feature Grid) ─────── */}
      <section style={{ background: "#0F0F0F", padding: "96px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: "#777" }}>Why Soundshy</span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2.2rem, 4vw, 3.5rem)", letterSpacing: "-0.02em", color: "#FAF9F7", marginTop: "12px" }}>
              Your Day, Elevated
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {features.map((f, i) => (
              <div key={f.title} className={`reveal stagger-${i}`}
                style={{ background: "#0A0A0A", border: "1px solid #222", borderRadius: "16px", padding: "40px 32px", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(198,153,87,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ marginBottom: "24px" }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", color: "#FAF9F7", marginBottom: "12px", letterSpacing: "-0.01em" }}>{f.title}</h3>
                <p style={{ fontSize: "15px", fontFamily: "'Manrope', sans-serif", color: "#BBBBBB", lineHeight: 1.65 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION: Interactive Feature Breakdown (VISUAL FINGERPRINT) ─ */}
      <section style={{ background: "var(--accent)", padding: "96px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: "var(--primary)" }}>Precision Engineering</span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.02em", color: "#FAF9F7", marginTop: "12px" }}>
              Built Different, Inside &amp; Out
            </h2>
          </div>

          {/* Feature breakdown grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {[
              {
                img: "/product-1.jpg",
                tag: "01 / Acoustics",
                title: "TriPort Acoustic Architecture",
                body: "Three precision-tuned ports work together to produce deep, natural bass without distortion — the same technology Bose has refined over five decades.",
              },
              {
                img: "/product-2.jpg",
                tag: "02 / Noise Cancellation",
                title: "Six Microphone Array",
                body: "External and internal mics work in concert, measuring and countering ambient noise before it reaches your ear canal. The result: near-complete sonic isolation.",
              },
              {
                img: "/product-3.jpg",
                tag: "03 / Connectivity",
                title: "SimpleSync Technology",
                body: "Pair effortlessly with Bose headphones or soundbars and share the same on/off switch — one ecosystem, total harmony.",
              },
              {
                img: "/product-4.jpg",
                tag: "04 / Wear Detection",
                title: "Automatic Ear Detection",
                body: "Built-in sensors detect when you remove an earbud and pause playback instantly — then resume the moment you put it back in.",
              },
            ].map((item, i) => (
              <div key={item.tag} className={`reveal stagger-${i % 3}`}
                style={{ display: "flex", gap: "24px", background: "rgba(250,249,247,0.04)", border: "1px solid rgba(198,153,87,0.12)", borderRadius: "16px", padding: "28px", alignItems: "center", transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(198,153,87,0.12)"; e.currentTarget.style.borderColor = "rgba(198,153,87,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(198,153,87,0.12)"; }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "12px", overflow: "hidden", flexShrink: 0 }}>
                  <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                </div>
                <div>
                  <p style={{ fontSize: "11px", fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>{item.tag}</p>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(1rem, 1.6vw, 1.25rem)", color: "#FAF9F7", letterSpacing: "-0.01em", marginBottom: "8px" }}>{item.title}</h3>
                  <p style={{ fontSize: "14px", fontFamily: "'Manrope', sans-serif", color: "#AAAAAA", lineHeight: 1.6 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION: Explore the Collection (Horizontal Carousel) */}
      <section style={{ background: "#0A0A0A", padding: "96px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px", marginBottom: "48px" }}>
          <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: "#777" }}>Full Catalogue</span>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.02em", color: "#FAF9F7", marginTop: "8px" }}>
                Explore the Collection
              </h2>
            </div>
            <button onClick={() => router.push("/shop")} style={{ background: "none", border: "1px solid #333", borderRadius: "999px", padding: "10px 24px", color: "#BBBBBB", fontFamily: "'Manrope', sans-serif", fontSize: "14px", cursor: "pointer", transition: "border-color 0.2s, color 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#333"; (e.currentTarget as HTMLButtonElement).style.color = "#BBBBBB"; }}>
              View All
            </button>
          </div>
        </div>

        {/* Drag scroll carousel */}
        <div ref={carouselRef} className="carousel-track"
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
          style={{ display: "flex", gap: "24px", overflowX: "auto", padding: "0 40px 24px", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {products.map((p) => {
            const isAdded = addedId === p.id;
            return (
              <div key={p.id} style={{ flexShrink: 0, width: "clamp(240px, 28vw, 320px)", background: "#0A0A0A", border: "1px solid #222", borderRadius: "16px", overflow: "hidden", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 24px 50px rgba(198,153,87,0.18)"; e.currentTarget.style.borderColor = "rgba(198,153,87,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#222"; }}>
                {/* Product image */}
                <div style={{ overflow: "hidden", aspectRatio: "3/4", background: "#111" }} onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}>
                  <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                </div>
                {/* Card info */}
                <div style={{ padding: "20px 20px 24px" }}>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "16px", color: "#FAF9F7", marginBottom: "6px", lineHeight: 1.3 }}>{p.name}</h3>
                  <p style={{ fontSize: "13px", color: "#BBBBBB", fontFamily: "'Manrope', sans-serif", lineHeight: 1.5, marginBottom: "16px" }}>{p.description.slice(0, 60)}…</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--primary)" }}>₹{p.price.toLocaleString("en-IN")}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleAddToCart(p); }}
                      style={{ height: "36px", padding: "0 20px", borderRadius: "8px", border: "none", background: isAdded ? "#2D6A2D" : "#222", color: "#FAF9F7", fontFamily: "'Manrope', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "background 0.2s ease, transform 0.15s ease", whiteSpace: "nowrap" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                      {isAdded ? "✓ Added" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── SECTION: Newsletter ────────────────────────────────── */}
      <section id="contact" style={{ background: "var(--bg)", padding: "96px 0", borderTop: "1px solid rgba(43,44,45,0.08)" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 40px", textAlign: "center" }} className="reveal">
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: "var(--muted)" }}>Stay in the Loop</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em", color: "var(--text)", marginTop: "12px", marginBottom: "16px" }}>
            Sound Deals, Delivered
          </h2>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "16px", color: "var(--muted)", lineHeight: 1.7, marginBottom: "40px" }}>
            Be the first to hear about new products, exclusive drops, and deals you won't find anywhere else.
          </p>
          {subscribed ? (
            <div style={{ padding: "24px", background: "rgba(198,153,87,0.08)", borderRadius: "12px", border: "1px solid rgba(198,153,87,0.2)" }}>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: "var(--primary)", fontSize: "16px" }}>
                🎵 Thanks for subscribing! We'll be in touch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "12px", maxWidth: "480px", margin: "0 auto" }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                style={{ flex: 1, height: "52px", padding: "0 18px", background: "white", border: "1.5px solid rgba(43,44,45,0.2)", borderRadius: "10px", fontFamily: "'Manrope', sans-serif", fontSize: "15px", color: "var(--text)", outline: "none", transition: "border-color 0.2s" }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--primary)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(43,44,45,0.2)")} />
              <button type="submit" style={{ height: "52px", padding: "0 28px", background: "var(--accent)", border: "none", borderRadius: "10px", color: "#FAF9F7", fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "15px", cursor: "pointer", whiteSpace: "nowrap", transition: "transform 0.15s ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ background: "#0A0A0A", borderTop: "1px solid #1A1A1A", padding: "64px 0 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", gap: "48px" }}>
          {/* Col 1: Brand */}
          <div>
            <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(250,249,247,0.06)", display: "inline-block", marginBottom: "16px" }}>
              <img src="/logo.png" alt="Soundshy" style={{ height: "32px", objectFit: "contain", opacity: 0.85 }} />
            </div>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "14px", color: "#BBBBBB", lineHeight: 1.7, marginBottom: "24px", maxWidth: "220px" }}>
              Sound. Elevated.<br />We provide better sound.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "16px" }}>
              {[
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { label: "X / Twitter", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { label: "YouTube", path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
              ].map((social) => (
                <button key={social.label} onClick={() => {}} aria-label={social.label}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", opacity: 0.6, transition: "opacity 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#BBBBBB"><path d={social.path}/></svg>
                </button>
              ))}
            </div>
          </div>

          {/* Col 2: Shop */}
          <div>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: "#777", marginBottom: "16px" }}>Shop</p>
            {["Earbuds", "Headphones", "Accessories", "Gift Cards"].map((item) => (
              <button key={item} onClick={() => router.push("/shop")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontSize: "14px", color: "#FAF9F7", lineHeight: "2.2", padding: 0, textAlign: "left", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "#FAF9F7")}>
                {item}
              </button>
            ))}
          </div>

          {/* Col 3: Learn */}
          <div>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: "#777", marginBottom: "16px" }}>Learn</p>
            {["Our Story", "Technology", "Press", "Careers"].map((item) => (
              <button key={item} onClick={() => item === "Our Story" ? document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" }) : {}}
                style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontSize: "14px", color: "#FAF9F7", lineHeight: "2.2", padding: 0, textAlign: "left", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "#FAF9F7")}>
                {item}
              </button>
            ))}
          </div>

          {/* Col 4: Newsletter mini */}
          <div>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: "#777", marginBottom: "16px" }}>Newsletter</p>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "14px", color: "#BBBBBB", lineHeight: 1.6, marginBottom: "16px" }}>Get exclusive deals and audio insights in your inbox.</p>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              style={{ height: "44px", padding: "0 24px", background: "var(--primary)", border: "none", borderRadius: "8px", color: "#1A1A1A", fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "14px", cursor: "pointer", transition: "transform 0.15s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{ maxWidth: "1280px", margin: "48px auto 0", padding: "24px 40px", borderTop: "1px solid #1A1A1A", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: "#555" }}>© 2026 Soundshy, Inc. All rights reserved.</p>
            {["Privacy Policy", "Terms of Use"].map((link) => (
              <button key={link} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: "#555", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#BBBBBB")}
                onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
                {link}
              </button>
            ))}
          </div>
          {/* Payment icons (text-based) */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["VISA", "MC", "AMEX", "UPI", "GPay"].map((p) => (
              <div key={p} style={{ padding: "4px 10px", background: "#1A1A1A", borderRadius: "4px", fontFamily: "'Manrope', sans-serif", fontSize: "11px", fontWeight: 600, color: "#777", letterSpacing: "0.05em" }}>{p}</div>
            ))}
          </div>
        </div>
      </footer>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (max-width: 768px) {
          section > div[style*="gridTemplateColumns: '60fr 40fr'"],
          section > div[style*="1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}