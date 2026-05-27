"use client";
export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../components/CartContext";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Bose QuietComfort Earbuds II", description: "Premium wireless earbuds with world-class noise cancellation and secure fit.", price: 24999 },
  { id: 2, img: "/product-2.jpg", name: "White Wired Apple EarPods", description: "White, wired Apple EarPods meticulously nestled within their original retail packaging.", price: 300 },
  { id: 3, img: "/product-3.jpg", name: "AKG Wired In-Ear Earphones", description: "Sleek AKG black wired in-ear earphones offer dependable performance and a sophisticated aesthetic.", price: 400 },
  { id: 4, img: "/product-4.jpg", name: "SONY In-Ear Wired Earphones", description: "Sleek SONY in-ear wired earphones in charcoal black with ergonomic design for reliable audio.", price: 500 },
];

const reviews = [
  { name: "Arjun Mehta", date: "Jan 2025", rating: 5, text: "Absolutely blown away by the noise cancellation. Used these on a 4-hour flight and barely heard a thing. The fit is secure and comfortable even after hours of wear." },
  { name: "Priya Nair", date: "Feb 2025", rating: 5, text: "Worth every rupee. The sound stage is wide and the bass is punchy without being overwhelming. Call quality is exceptional — colleagues can hear me clearly even in a busy café." },
  { name: "Rohan Sharma", date: "Mar 2025", rating: 4, text: "Premium product with a premium feel. Setup was instant and the multipoint connection works flawlessly between my phone and laptop. Battery life is impressive." },
  { name: "Sonal Kapoor", date: "Mar 2025", rating: 5, text: "The ergonomic design is a revelation — they literally disappear in your ears. I forget I'm wearing them. Sound quality is studio-grade for daily commuting." },
];

const features = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 3C8.82 3 3 8.82 3 16s5.82 13 13 13 13-5.82 13-13S23.18 3 16 3zm0 2c6.075 0 11 4.925 11 11S22.075 27 16 27 5 22.075 5 16 9.925 5 16 5zm-1 5v7.586l-3.707 3.707 1.414 1.414L17 18.414V10h-2z" fill="var(--primary)"/>
      </svg>
    ),
    label: "BATTERY",
    title: "30-Hour Total Playback",
    body: "6 hours from the earbuds, 24 more from the compact charging case. Fast charge gives you 2 hours in just 15 minutes.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 2a6 6 0 016 6v8a6 6 0 01-12 0V8a6 6 0 016-6zm0 2a4 4 0 00-4 4v8a4 4 0 008 0V8a4 4 0 00-4-4zm-1 20.9V28h-3v2h8v-2h-3v-3.1A10.014 10.014 0 0026 16h-2a8 8 0 01-16 0H6a10.014 10.014 0 009 9.9z" fill="var(--primary)"/>
      </svg>
    ),
    label: "NOISE CANCELLATION",
    title: "World-Class ANC",
    body: "Dual-microphone system with CustomTune technology calibrates noise cancellation to the unique geometry of your ear canal in real time.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8 6h16a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2zm0 2v16h16V8H8zm4 3h8v2h-8v-2zm0 4h8v2h-8v-2zm0 4h5v2h-5v-2z" fill="var(--primary)"/>
      </svg>
    ),
    label: "CONNECTIVITY",
    title: "Bluetooth 5.3 Multipoint",
    body: "Seamlessly pair with two devices simultaneously. Switch between your phone and laptop without re-pairing — the earbuds remember it all.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4a8 8 0 018 8c0 5.5-8 16-8 16S8 17.5 8 12a8 8 0 018-8zm0 2a6 6 0 00-6 6c0 3.9 5.04 11.3 6 12.8.96-1.5 6-8.9 6-12.8a6 6 0 00-6-6zm0 3a3 3 0 110 6 3 3 0 010-6z" fill="var(--primary)"/>
      </svg>
    ),
    label: "FIT",
    title: "Ergonomic StayHear+ Tips",
    body: "Five sizes of silicone ear tips with angled ear fins that grip naturally, providing a secure, pressure-free seal without fatigue.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625L4.5 7.07 2 4.635l3.455-.505L7 1z" fill={i <= rating ? "var(--primary)" : "var(--muted)"} />
        </svg>
      ))}
    </div>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const paramImg   = searchParams.get('img')   ? decodeURIComponent(searchParams.get('img')!)   : null;
  const paramName  = searchParams.get('name')  ? decodeURIComponent(searchParams.get('name')!)  : null;
  const paramPrice = searchParams.get('price') ? Number(searchParams.get('price'))               : null;
  const displayImg  = paramImg  ?? "/product-1.jpg";
  const displayName = paramName ?? "Bose QuietComfort Earbuds II";
  const displayPrice = paramPrice ?? 24999;

  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [boughtNow, setBoughtNow] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const { cart } = useCart() ?? { cart: [] };

  const colorVariants = [
    { label: "Midnight Black", hex: "#1A1A1A" },
    { label: "Soapstone White", hex: "#F0EDE8" },
    { label: "Eclipse Grey", hex: "#4A4A4A" },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (cart) {
      const count = cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
      setCartCount(count);
    }
  }, [cart]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) =>
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
        }
      }), { threshold: 0.12 }
    );
    els.forEach(el => {
      (el as HTMLElement).style.cssText += "opacity:0;transform:translateY(28px);transition:opacity 0.6s ease,transform 0.6s ease;";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const featureEls = document.querySelectorAll(".feature-reveal");
    const io = new IntersectionObserver((entries) =>
      entries.forEach((e, idx) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, idx * 80);
        }
      }), { threshold: 0.15 }
    );
    featureEls.forEach(el => {
      (el as HTMLElement).style.cssText += "opacity:0;transform:translateY(20px);transition:opacity 0.5s ease-out,transform 0.5s ease-out;";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  function handleAddToCart() {
    addItem({ id: String(displayName), name: displayName, price: displayPrice, quantity, image: displayImg });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addItem({ id: String(displayName), name: displayName, price: displayPrice, quantity, image: displayImg });
    setBoughtNow(true);
    setTimeout(() => { setBoughtNow(false); router.push('/checkout'); }, 600);
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    } catch {}
    setSubscribed(true);
    setEmail("");
  }

  const relatedProducts = products.filter(p => p.name !== displayName).slice(0, 3);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "'Manrope', sans-serif", color: "var(--text)" }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap');
        :root { --bg:#FAF9F7; --surface:#A87E42; --primary:#C69957; --accent:#2B2C2D; --text:#1A1A1A; --muted:#9E8B72; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        :focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(250,249,247,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(43,44,45,0.1)" : "none",
        transition: "background 0.25s ease, border-color 0.25s ease",
        padding: "0 40px", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <img src="/logo.png" alt="Soundshy logo" onClick={() => router.push('/')} style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} />

        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {["Shop", "Earbuds", "Headphones", "Our Story"].map(link => (
              <button key={link} onClick={() => link === "Shop" || link === "Earbuds" || link === "Headphones" ? router.push('/shop') : router.push('/')}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 16px", fontFamily: "'Manrope', sans-serif", fontSize: "0.9rem", fontWeight: 500, color: scrolled ? "var(--text)" : "var(--text)", letterSpacing: "0.01em", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = scrolled ? "var(--text)" : "var(--text)")}>
                {link}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => router.push('/checkout')} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "8px" }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M1 1h3.5l2.3 11.4a2 2 0 002 1.6h9.4a2 2 0 001.95-1.57L21 5H5" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8" cy="19" r="1.5" fill="var(--accent)"/>
              <circle cx="17" cy="19" r="1.5" fill="var(--accent)"/>
            </svg>
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "2px", right: "2px", background: "var(--primary)", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Manrope', sans-serif" }}>{cartCount}</span>
            )}
          </button>
          {isMobile && (
            <button onClick={() => setMobileMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M2 5h18M2 11h18M2 17h18" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "var(--accent)", display: "flex", flexDirection: "column", padding: "24px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
            <img src="/logo.png" alt="Soundshy" style={{ height: "36px", objectFit: "contain", filter: "brightness(10)" }} />
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke="#FAF9F7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          {["Home", "Shop", "Our Story", "Contact"].map(item => (
            <button key={item} onClick={() => { setMobileMenuOpen(false); item === "Home" ? router.push('/') : item === "Shop" ? router.push('/shop') : item === "Contact" ? document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) : router.push('/'); }}
              style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "16px 0", fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 600, color: "#FAF9F7", borderBottom: "1px solid rgba(250,249,247,0.1)" }}>
              {item}
            </button>
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div onClick={() => setLightboxOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
          <img src={displayImg} alt={displayName} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: "16px" }} />
        </div>
      )}

      {/* PRODUCT SECTION */}
      <div style={{ paddingTop: "68px" }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto", padding: isMobile ? "40px 24px" : "64px 48px",
          display: isMobile ? "block" : "grid", gridTemplateColumns: "60fr 40fr", gap: "64px", alignItems: "start"
        }}>

          {/* LEFT: IMAGE COLUMN */}
          <div style={{ position: isMobile ? "static" : "sticky", top: "88px" }}>
            {/* Main Image */}
            <div style={{ overflow: "hidden", borderRadius: "24px", background: "#fff", boxShadow: `0 40px 80px -20px #C6995740`, cursor: "zoom-in", position: "relative" }}
              onClick={() => setLightboxOpen(true)}>
              <img src={displayImg} alt={displayName}
                style={{ width: "100%", aspectRatio: "4/5", objectFit: "contain", display: "block", padding: "32px", transition: "transform 0.7s ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "rgba(250,249,247,0.9)", borderRadius: "8px", padding: "6px 10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="var(--muted)" strokeWidth="1.5"/>
                  <path d="M9.5 9.5l2.5 2.5" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M4 6h4M6 4v4" stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 500 }}>Click to enlarge</span>
              </div>
            </div>

            {/* Color-variant image hints below main image */}
            <div style={{ display: "flex", gap: "12px", marginTop: "16px", justifyContent: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i}
                  onClick={() => setSelectedColor(i)}
                  style={{
                    width: "72px", height: "72px", borderRadius: "12px", overflow: "hidden",
                    border: selectedColor === i ? "2px solid var(--primary)" : "2px solid transparent",
                    background: "#fff", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "border-color 0.15s ease"
                  }}>
                  <img src={displayImg} alt={`View ${i+1}`} style={{ width: "64px", height: "64px", objectFit: "contain", transform: `rotate(${i * 8 - 8}deg) scale(0.9)` }} />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingTop: isMobile ? "32px" : "0" }}>

            {/* Eyebrow */}
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--primary)", fontFamily: "'Manrope', sans-serif" }}>
              Premium Wireless Audio
            </span>

            {/* Title */}
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 2.8rem)", letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)" }}>
              {displayName}
            </h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <StarRating rating={5} />
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 500 }}>4.9 · 2,847 reviews</span>
            </div>

            {/* Trust signals */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {["Free delivery above ₹499", "Made in India", "50+ years audio innovation"].map(t => (
                <span key={t} style={{ fontSize: "0.75rem", padding: "5px 12px", borderRadius: "9999px", background: "#fff", border: "1px solid rgba(43,44,45,0.1)", color: "var(--muted)", fontWeight: 500 }}>{t}</span>
              ))}
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.02em" }}>
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", textDecoration: "line-through" }}>
                ₹{Math.round(displayPrice * 1.18).toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize: "0.8rem", background: "#FFF3E0", color: "#E65100", padding: "3px 8px", borderRadius: "6px", fontWeight: 600 }}>18% OFF</span>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(43,44,45,0.08)" }} />

            {/* Color Selector */}
            <div>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)", marginBottom: "12px", fontFamily: "'Manrope', sans-serif" }}>
                Color: <span style={{ fontWeight: 400, color: "var(--muted)" }}>{colorVariants[selectedColor].label}</span>
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                {colorVariants.map((c, i) => (
                  <button key={i} onClick={() => setSelectedColor(i)} title={c.label}
                    style={{
                      width: "32px", height: "32px", borderRadius: "50%", background: c.hex, border: "2px solid #fff",
                      outline: selectedColor === i ? `2px solid var(--primary)` : "2px solid transparent",
                      outlineOffset: "2px", cursor: "pointer", transition: "outline-color 0.15s ease",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                    }} />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)", marginBottom: "12px", fontFamily: "'Manrope', sans-serif" }}>Quantity</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0", border: "1px solid rgba(43,44,45,0.15)", borderRadius: "12px", width: "fit-content", overflow: "hidden" }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: "44px", height: "44px", border: "none", background: "#fff", cursor: "pointer", fontSize: "1.2rem", color: "var(--text)", fontFamily: "'Manrope', sans-serif", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f5f4f2")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>−</button>
                <span style={{ width: "48px", textAlign: "center", fontSize: "1rem", fontWeight: 600, color: "var(--text)", fontFamily: "'Manrope', sans-serif" }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  style={{ width: "44px", height: "44px", border: "none", background: "#fff", cursor: "pointer", fontSize: "1.2rem", color: "var(--text)", fontFamily: "'Manrope', sans-serif", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f5f4f2")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>+</button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button onClick={handleAddToCart}
                style={{
                  width: "100%", height: "56px", borderRadius: "12px", border: "none", cursor: "pointer",
                  background: added ? "#4CAF50" : "var(--accent)",
                  color: "#FAF9F7", fontSize: "1rem", fontWeight: 600, fontFamily: "'Manrope', sans-serif",
                  transition: "transform 0.15s ease, background 0.3s ease", letterSpacing: "0.01em"
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </button>

              <button onClick={handleBuyNow}
                style={{
                  width: "100%", height: "56px", borderRadius: "12px", border: "2px solid var(--primary)", cursor: "pointer",
                  background: "transparent", color: "var(--primary)", fontSize: "1rem", fontWeight: 600,
                  fontFamily: "'Manrope', sans-serif", transition: "transform 0.15s ease, background 0.2s ease", letterSpacing: "0.01em"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#FAF9F7"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--primary)"; }}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
                {boughtNow ? "Redirecting..." : "Buy Now"}
              </button>
            </div>

            {/* Short description */}
            <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "var(--muted)", fontFamily: "'Manrope', sans-serif" }}>
              {displayName === "Bose QuietComfort Earbuds II"
                ? "Experience the gold standard in wireless audio. Personalized Active Noise Cancellation with CustomTune technology adapts to your unique ear shape, while Aware Mode keeps you connected to your surroundings."
                : products.find(p => p.name === displayName)?.description || "Premium audio quality engineered for daily performance and lasting comfort."}
            </p>

            {/* Delivery & Warranty */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { icon: "📦", title: "Free Delivery", sub: "Orders above ₹499" },
                { icon: "🛡️", title: "1 Year Warranty", sub: "Official brand warranty" },
                { icon: "↩️", title: "7-Day Returns", sub: "Hassle-free returns" },
                { icon: "🔒", title: "Secure Payment", sub: "UPI, Cards, EMI" },
              ].map(item => (
                <div key={item.title} style={{ background: "#fff", border: "1px solid rgba(43,44,45,0.08)", borderRadius: "12px", padding: "14px 16px" }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text)", marginBottom: "2px", fontFamily: "'Manrope', sans-serif" }}>{item.title}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "'Manrope', sans-serif" }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE BREAKDOWN — VISUAL FINGERPRINT */}
      <section className="reveal" style={{ background: "var(--accent)", padding: isMobile ? "64px 24px" : "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--primary)", marginBottom: "12px", fontFamily: "'Manrope', sans-serif" }}>
            Engineered Excellence
          </span>
          <h2 className="feature-reveal" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em", color: "#FAF9F7", marginBottom: "16px", maxWidth: "600px" }}>
            Every Detail. Designed for Sound.
          </h2>
          <p className="feature-reveal" style={{ fontSize: "1rem", lineHeight: 1.7, color: "rgba(250,249,247,0.6)", marginBottom: "56px", maxWidth: "480px", fontFamily: "'Manrope', sans-serif" }}>
            Precision-engineered components work in concert to deliver an audio experience that feels personal, powerful, and effortless.
          </p>

          {/* Feature grid */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "24px" }}>
            {features.map((f, i) => (
              <div key={i} className="feature-reveal"
                style={{ background: "rgba(250,249,247,0.05)", border: "1px solid rgba(250,249,247,0.08)", borderRadius: "16px", padding: "32px", cursor: "pointer", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), background 0.3s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.background = "rgba(250,249,247,0.08)"; e.currentTarget.style.boxShadow = `0 20px 50px -12px #C6995750`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(250,249,247,0.05)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ marginBottom: "20px" }}>{f.icon}</div>
                <span style={{ display: "block", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--primary)", fontWeight: 600, marginBottom: "8px", fontFamily: "'Manrope', sans-serif" }}>{f.label}</span>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "1.2rem", color: "#FAF9F7", marginBottom: "10px", letterSpacing: "-0.01em" }}>{f.title}</h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "rgba(250,249,247,0.6)", fontFamily: "'Manrope', sans-serif" }}>{f.body}</p>
              </div>
            ))}
          </div>

          {/* Full-width feature image */}
          <div className="feature-reveal" style={{ marginTop: "48px", position: "relative", overflow: "hidden", borderRadius: "24px", background: "rgba(250,249,247,0.04)" }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "45fr 55fr", gap: "0", alignItems: "center" }}>
              <div style={{ padding: isMobile ? "40px 32px 0" : "64px 48px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--primary)", fontFamily: "'Manrope', sans-serif" }}>Precision ANC</span>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", letterSpacing: "-0.02em", color: "#FAF9F7", lineHeight: 1.15 }}>
                  Silence on demand. Awareness when you need it.
                </h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(250,249,247,0.6)", fontFamily: "'Manrope', sans-serif" }}>
                  Our dual-microphone array samples the sound environment 200 times per second, generating an anti-noise signal that neutralizes up to 98% of ambient noise before it reaches your ear.
                </p>
                <div style={{ display: "flex", gap: "32px", paddingTop: "8px" }}>
                  {[{ val: "98%", label: "Noise blocked" }, { val: "6hr", label: "Battery life" }, { val: "30m", label: "Range" }].map(s => (
                    <div key={s.label}>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.02em" }}>{s.val}</p>
                      <p style={{ fontSize: "0.75rem", color: "rgba(250,249,247,0.5)", fontFamily: "'Manrope', sans-serif" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ overflow: "hidden", borderRadius: isMobile ? "0 0 24px 24px" : "0 24px 24px 0" }}>
                <img src={displayImg} alt={`${displayName} detail view`}
                  style={{ width: "100%", aspectRatio: "4/3", objectFit: "contain", padding: "40px", background: "rgba(250,249,247,0.02)", transition: "transform 0.7s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="reveal" style={{ background: "var(--bg)", padding: isMobile ? "64px 24px" : "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", marginBottom: "48px", flexDirection: isMobile ? "column" : "row", gap: "16px" }}>
            <div>
              <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--primary)", marginBottom: "8px", fontFamily: "'Manrope', sans-serif" }}>Customer Reviews</span>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.5rem)", letterSpacing: "-0.02em", color: "var(--text)" }}>What Listeners Say</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#fff", border: "1px solid rgba(43,44,45,0.08)", borderRadius: "12px", padding: "12px 20px" }}>
              <StarRating rating={5} />
              <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>4.9</p>
                <p style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "'Manrope', sans-serif" }}>2,847 reviews</p>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "24px" }}>
            {reviews.map((r, i) => (
              <div key={i} className="feature-reveal"
                style={{ background: "#fff", border: "1px solid rgba(43,44,45,0.07)", borderRadius: "16px", padding: "28px 32px", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 20px 50px -12px #C6995740`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "1rem", color: "var(--text)", marginBottom: "4px" }}>{r.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "'Manrope', sans-serif" }}>Verified Purchase · {r.date}</p>
                  </div>
                  <StarRating rating={r.rating} />
                </div>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", fontFamily: "'Manrope', sans-serif" }}>{r.text}</p>
                <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.1 3.4H12l-2.9 2.1 1.1 3.4L7 7.8l-3.2 2.1 1.1-3.4L2 4.4h3.9L7 1z" fill="var(--primary)"/></svg>
                  <span style={{ fontSize: "0.72rem", color: "var(--primary)", fontWeight: 600, fontFamily: "'Manrope', sans-serif" }}>Verified Purchase</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YOU MIGHT ALSO LIKE */}
      <section className="reveal" style={{ background: "#f0ede8", padding: isMobile ? "64px 24px" : "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--primary)", marginBottom: "8px", fontFamily: "'Manrope', sans-serif" }}>More from Soundshy</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.5rem)", letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "40px" }}>You Might Also Like</h2>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "24px" }}>
            {relatedProducts.map((p, i) => (
              <article key={p.id} className="feature-reveal"
                style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", cursor: "pointer", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 8px 30px -10px #C6995730" }}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 20px 50px -12px #C6995750`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px -10px #C6995730"; }}>
                <div style={{ overflow: "hidden", background: "#fafafa" }}>
                  <img src={p.img} alt={p.name}
                    style={{ width: "100%", aspectRatio: "4/3", objectFit: "contain", padding: "24px", display: "block", transition: "transform 0.6s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                </div>
                <div style={{ padding: "20px 24px 24px" }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "1rem", color: "var(--text)", marginBottom: "6px", lineHeight: 1.3 }}>{p.name}</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "16px", lineHeight: 1.5, fontFamily: "'Manrope', sans-serif" }}>{p.description}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--primary)" }}>₹{p.price.toLocaleString("en-IN")}</span>
                    <button onClick={e => { e.stopPropagation(); router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`); }}
                      style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--accent)", background: "transparent", color: "var(--accent)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Manrope', sans-serif", transition: "transform 0.15s ease, background 0.2s ease" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "#FAF9F7"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent)"; }}>
                      View Product
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button onClick={() => router.push('/shop')}
              style={{ padding: "14px 40px", borderRadius: "12px", border: "2px solid var(--accent)", background: "transparent", color: "var(--accent)", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Manrope', sans-serif", transition: "transform 0.15s ease, background 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "#FAF9F7"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent)"; }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
              Explore Full Collection
            </button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER / CONTACT */}
      <section id="contact" className="reveal" style={{ background: "var(--accent)", padding: isMobile ? "64px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--primary)", marginBottom: "12px", fontFamily: "'Manrope', sans-serif" }}>Stay in the Loop</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.02em", color: "#FAF9F7", marginBottom: "12px" }}>Get Early Access & Audio Insights</h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(250,249,247,0.6)", lineHeight: 1.7, marginBottom: "32px", fontFamily: "'Manrope', sans-serif" }}>Join 18,000+ audio enthusiasts. Be the first to hear about new products and exclusive offers.</p>
          {subscribed ? (
            <div style={{ padding: "20px 32px", background: "rgba(198,153,87,0.15)", borderRadius: "12px", border: "1px solid var(--primary)" }}>
              <p style={{ color: "var(--primary)", fontWeight: 600, fontFamily: "'Manrope', sans-serif" }}>Thanks for subscribing! 🎧</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "12px", flexDirection: isMobile ? "column" : "row" }}>
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ flex: 1, height: "52px", padding: "0 20px", borderRadius: "12px", border: "1px solid rgba(250,249,247,0.2)", background: "rgba(250,249,247,0.08)", color: "#FAF9F7", fontSize: "0.95rem", fontFamily: "'Manrope', sans-serif", outline: "none" }} />
              <button type="submit"
                style={{ height: "52px", padding: "0 32px", borderRadius: "12px", border: "none", background: "var(--primary)", color: "#FAF9F7", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Manrope', sans-serif", whiteSpace: "nowrap", transition: "transform 0.15s ease" }}
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

      {/* FOOTER */}
      <footer style={{ background: "#FAF9F7", borderTop: "1px solid rgba(43,44,45,0.08)", padding: isMobile ? "48px 24px 32px" : "64px 48px 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 2fr", gap: "48px", marginBottom: "48px" }}>

            {/* Col 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <img src="/logo.png" alt="Soundshy" style={{ height: "32px", objectFit: "contain", opacity: 0.85, alignSelf: "flex-start" }} />
              <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.6, maxWidth: "240px", fontFamily: "'Manrope', sans-serif" }}>Sound. Elevated. Premium audio for the discerning listener — engineered in India.</p>
              <div style={{ display: "flex", gap: "16px", paddingTop: "4px" }}>
                {[
                  { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                  { label: "YouTube", path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
                ].map(s => (
                  <a key={s.label} href={`https://${s.label.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "8px", background: "rgba(43,44,45,0.06)", color: "var(--muted)", transition: "background 0.2s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(43,44,45,0.12)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(43,44,45,0.06)")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--muted)"><path d={s.path}/></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Shop */}
            <div>
              <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: "var(--muted)", marginBottom: "16px", fontFamily: "'Manrope', sans-serif" }}>Shop</p>
              {["Earbuds", "Headphones", "Accessories", "Gift Cards"].map(l => (
                <button key={l} onClick={() => router.push('/shop')} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem", color: "var(--text)", fontFamily: "'Manrope', sans-serif", lineHeight: 2.2, textAlign: "left", padding: 0, transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}>{l}</button>
              ))}
            </div>

            {/* Col 3: Learn */}
            <div>
              <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: "var(--muted)", marginBottom: "16px", fontFamily: "'Manrope', sans-serif" }}>Learn</p>
              {["Our Story", "Technology", "Press", "Careers"].map(l => (
                <button key={l} onClick={() => router.push('/')} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem", color: "var(--text)", fontFamily: "'Manrope', sans-serif", lineHeight: 2.2, textAlign: "left", padding: 0, transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}>{l}</button>
              ))}
            </div>

            {/* Col 4: Newsletter */}
            <div>
              <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: "8px", fontFamily: "'Manrope', sans-serif" }}>Stay in the loop</p>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "16px", fontFamily: "'Manrope', sans-serif" }}>New drops, exclusive deals, and audio insights.</p>
              {subscribed ? (
                <p style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem", fontFamily: "'Manrope', sans-serif" }}>Thanks for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required
                    style={{ height: "48px", padding: "0 16px", borderRadius: "8px", border: "1px solid rgba(43,44,45,0.15)", background: "#fff", color: "var(--text)", fontSize: "0.875rem", fontFamily: "'Manrope', sans-serif", outline: "none" }} />
                  <button type="submit"
                    style={{ height: "48px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "#FAF9F7", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Manrope', sans-serif", transition: "transform 0.15s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom strip */}
          <div style={{ borderTop: "1px solid rgba(43,44,45,0.08)", paddingTop: "24px", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "'Manrope', sans-serif" }}>© 2026 Soundshy, Inc. All rights reserved.</span>
              {["Privacy Policy", "Terms of Use"].map(l => (
                <button key={l} onClick={() => router.push('/')} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "var(--muted)", fontFamily: "'Manrope', sans-serif", textDecoration: "underline" }}>{l}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {["VISA", "MC", "UPI", "AMEX"].map(p => (
                <span key={p} style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--muted)", background: "rgba(43,44,45,0.06)", padding: "4px 8px", borderRadius: "4px", fontFamily: "'Manrope', sans-serif" }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE BOTTOM BAR */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 20px", background: "rgba(250,249,247,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(43,44,45,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 50, gap: "12px" }}>
          <div>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "'Manrope', sans-serif" }}>Total</p>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--primary)" }}>₹{displayPrice.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ display: "flex", gap: "8px", flex: 1, maxWidth: "260px" }}>
            <button onClick={handleAddToCart}
              style={{ flex: 1, height: "48px", borderRadius: "10px", border: "none", background: added ? "#4CAF50" : "var(--accent)", color: "#FAF9F7", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Manrope', sans-serif", transition: "background 0.3s ease" }}>
              {added ? "✓ Added" : "Add to Cart"}
            </button>
            <button onClick={handleBuyNow}
              style={{ flex: 1, height: "48px", borderRadius: "10px", border: "none", background: "var(--primary)", color: "#FAF9F7", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Manrope', sans-serif" }}>
              Buy Now
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}