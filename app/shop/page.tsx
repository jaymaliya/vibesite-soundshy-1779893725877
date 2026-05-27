"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Bose QuietComfort Earbuds II", description: "Premium Bose QuietComfort Earbuds II for high-quality wireless audio and secure fit.", price: 24999, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "White Wired Apple EarPods", description: "White, wired Apple EarPods meticulously nestled within their original retail packaging.", price: 300, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "AKG Wired In-Ear Earphones", description: "Sleek AKG black wired in-ear earphones offer dependable performance and a sophisticated", price: 400, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "SONY In-Ear Wired Earphones", description: "Sleek SONY in-ear wired earphones in charcoal black with ergonomic design for reliable", price: 500, badge: "" }
];

const filters = ["All Products", "QuietComfort Series", "Wired Earphones", "New Arrivals"];

export default function ShopPage() {
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("All Products");
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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

  const handleAddToCart = (p: (typeof products)[0]) => {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedIds((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedIds((prev) => ({ ...prev, [p.id]: false })), 1500);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap');
        :root {
          --bg: #FAF9F7;
          --surface: #A87E42;
          --primary: #C69957;
          --accent: #2B2C2D;
          --text: #1A1A1A;
          --muted: #9E8B72;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); font-family: 'Manrope', sans-serif; }
        .syne { font-family: 'Syne', sans-serif; }
        .manrope { font-family: 'Manrope', sans-serif; }
        button:focus-visible, a:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
        @media (max-width: 768px) {
          .grid-products { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .grid-products { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 1024px) {
          .grid-products { grid-template-columns: repeat(4, 1fr) !important; }
        }
        .card-add-btn {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .product-card:hover .card-add-btn {
          opacity: 1;
          transform: translateY(0);
        }
        .hamburger-line {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--text);
          transition: transform 0.25s ease, opacity 0.25s ease;
          transform-origin: center;
        }
        .nav-link-hover:hover { color: var(--primary) !important; transition: color 0.15s ease; }
      `}</style>

      {/* ── NAVBAR ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: scrolled ? "rgba(250,249,247,0.97)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(43,44,45,0.08)" : "none",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "background-color 0.2s ease, border-color 0.2s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 32px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ padding: "4px 8px", borderRadius: "8px" }}>
            <img
              src="/logo.png"
              alt="Soundshy logo"
              style={{ height: "40px", objectFit: "contain", cursor: "pointer" }}
              onClick={() => router.push("/")}
            />
          </div>

          {/* Desktop nav */}
          <nav
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
            className="desktop-nav"
          >
            {[
              { label: "Home", action: () => router.push("/") },
              { label: "Shop", action: () => router.push("/shop") },
              { label: "Contact", action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
            ].map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="nav-link-hover"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 500,
                  color: "var(--text)",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  letterSpacing: "0.01em",
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Cart icon */}
          <button
            onClick={() => router.push("/checkout")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              fontFamily: "Manrope, sans-serif",
              fontWeight: 600,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            style2={{ transition: "transform 0.15s ease" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Cart
          </button>
        </div>
      </header>

      {/* ── SHOP HERO STRIP ── */}
      <section
        style={{
          paddingTop: "72px",
          background: "linear-gradient(135deg, var(--accent) 0%, #3d3e3f 60%, #2B2C2D 100%)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "80px 32px 72px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* Left: text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <span
              className="syne"
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 700,
                color: "var(--primary)",
              }}
            >
              Premium Audio Collection
            </span>
            <h1
              className="syne"
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#FFFFFF",
              }}
            >
              Sound That
              <br />
              <span style={{ color: "var(--primary)" }}>Moves You</span>
            </h1>
            <p
              className="manrope"
              style={{
                fontSize: "17px",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.65)",
                maxWidth: "420px",
              }}
            >
              From studio-grade wireless earbuds to precision-tuned wired earphones — every product engineered for uncompromising audio fidelity.
            </p>
            {/* Trust signals */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "Manrope, sans-serif",
                fontWeight: 500,
                marginTop: "8px",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                4.8 / 5 — 2,400+ reviews
              </span>
              <span>Free delivery above ₹499</span>
              <span>Genuine products, always</span>
            </div>
          </div>

          {/* Right: hero product image */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "420px",
                overflow: "hidden",
                borderRadius: "24px",
                boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)",
              }}
            >
              <img
                src="/product-1.jpg"
                alt="Bose QuietComfort Earbuds II — premium wireless earbuds"
                style={{
                  width: "100%",
                  aspectRatio: "4/5",
                  objectFit: "cover",
                  transition: "transform 0.7s ease",
                  display: "block",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
              />
            </div>
            {/* Floating badge */}
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "0",
                background: "var(--primary)",
                borderRadius: "12px",
                padding: "12px 20px",
                boxShadow: "0 8px 24px rgba(198,153,87,0.4)",
              }}
            >
              <div
                className="syne"
                style={{ fontSize: "13px", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}
              >
                Starting at
              </div>
              <div
                className="syne"
                style={{ fontSize: "22px", fontWeight: 700, color: "#fff", lineHeight: 1.1 }}
              >
                ₹300
              </div>
            </div>
          </div>
        </div>

        {/* Decorative wave bottom */}
        <svg viewBox="0 0 1280 48" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "48px" }}>
          <path d="M0,48 L0,24 Q320,0 640,24 Q960,48 1280,24 L1280,48 Z" fill="var(--bg)" />
        </svg>
      </section>

      {/* ── VISUAL FINGERPRINT: Feature Breakdown ── */}
      <section
        className="reveal"
        style={{
          background: "var(--bg)",
          padding: "80px 32px 64px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span
            className="syne"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontWeight: 700,
              color: "var(--primary)",
              display: "block",
              marginBottom: "12px",
            }}
          >
            Why Soundshy
          </span>
          <h2
            className="syne"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--text)",
            }}
          >
            Engineered to Perform
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {[
            {
              icon: (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 6C12.268 6 6 12.268 6 20s6.268 14 14 14 14-6.268 14-14S27.732 6 20 6zm0 4a10 10 0 110 20A10 10 0 0120 10zm0 2a8 8 0 100 16A8 8 0 0020 12zm0 2a6 6 0 110 12A6 6 0 0120 14zm0 2a4 4 0 100 8 4 4 0 000-8z" fill="var(--primary)"/>
                </svg>
              ),
              title: "Active Noise Cancellation",
              body: "Proprietary dual-microphone ANC technology silences up to 98% of ambient noise — on the commute, in cafes, everywhere.",
            },
            {
              icon: (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 4a3 3 0 013 3v14a3 3 0 01-6 0V7a3 3 0 013-3zm8 14a8 8 0 01-16 0H9a11 11 0 0022 0h-3zm-8 14v-4h2v4h-2z" fill="var(--primary)"/>
                </svg>
              ),
              title: "Crystal-Clear Calls",
              body: "Four-microphone beamforming array with AI noise suppression delivers broadcast-quality voice clarity.",
            },
            {
              icon: (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M10 20a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM6 14h4v4H6v-4zm28 0h-4v4h4v-4zM10 8a2 2 0 100 4 2 2 0 000-4zm20 0a2 2 0 100 4 2 2 0 000-4z" fill="var(--primary)"/>
                </svg>
              ),
              title: "Multipoint Connectivity",
              body: "Bluetooth 5.3 multipoint lets you stay connected to your laptop and phone simultaneously, switching in milliseconds.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "32px",
                border: "1px solid rgba(43,44,45,0.07)",
                boxShadow: "0 8px 30px -10px rgba(198,153,87,0.15)",
                transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(198,153,87,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 30px -10px rgba(198,153,87,0.15)";
              }}
            >
              {f.icon}
              <h3
                className="syne"
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                }}
              >
                {f.title}
              </h3>
              <p
                className="manrope"
                style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "var(--muted)",
                }}
              >
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN SHOP SECTION ── */}
      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px 96px",
        }}
      >
        {/* Section header */}
        <div
          className="reveal"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <span
              className="syne"
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 700,
                color: "var(--primary)",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Browse All
            </span>
            <h2
              className="syne"
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                lineHeight: 1.05,
              }}
            >
              The Full Collection
            </h2>
          </div>
          <p
            className="manrope"
            style={{
              fontSize: "15px",
              color: "var(--muted)",
              lineHeight: 1.6,
              maxWidth: "320px",
              textAlign: "right",
            }}
          >
            {products.length} products · Curated for audiophiles and everyday listeners alike
          </p>
        </div>

        {/* Filter pills */}
        <div
          className="reveal"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "40px",
          }}
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="manrope"
              style={{
                height: "36px",
                padding: "0 20px",
                borderRadius: "9999px",
                border: activeFilter === f ? "none" : "1px solid rgba(43,44,45,0.18)",
                background: activeFilter === f ? "var(--accent)" : "transparent",
                color: activeFilter === f ? "#fff" : "var(--text)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.15s ease, color 0.15s ease, border-color 0.15s ease",
                fontFamily: "Manrope, sans-serif",
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== f) {
                  e.currentTarget.style.background = "rgba(43,44,45,0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== f) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div
          className="grid-products reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
          }}
        >
          {products.map((p, i) => (
            <article
              key={p.id}
              className="product-card"
              style={{
                background: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid rgba(43,44,45,0.07)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: "0 4px 20px -8px rgba(198,153,87,0.18)",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(198,153,87,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px -8px rgba(198,153,87,0.18)";
              }}
              onClick={() =>
                router.push(
                  `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                )
              }
            >
              {/* Image container — 1:1 square */}
              <div
                style={{
                  overflow: "hidden",
                  background: "#F8F7F5",
                  aspectRatio: "1/1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px",
                  position: "relative",
                }}
              >
                <img
                  src={p.img}
                  alt={`${p.name} — premium audio earphone`}
                  style={{
                    width: "80%",
                    height: "80%",
                    objectFit: "contain",
                    transition: "transform 0.6s ease",
                    display: "block",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                />
                {i === 0 && (
                  <span
                    className="syne"
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      background: "var(--primary)",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      padding: "4px 12px",
                      borderRadius: "9999px",
                      textTransform: "uppercase",
                    }}
                  >
                    Best Seller
                  </span>
                )}
                {i === 3 && (
                  <span
                    className="syne"
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      background: "var(--accent)",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      padding: "4px 12px",
                      borderRadius: "9999px",
                      textTransform: "uppercase",
                    }}
                  >
                    New
                  </span>
                )}
              </div>

              {/* Card body */}
              <div
                style={{
                  padding: "20px 24px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  flex: 1,
                  position: "relative",
                }}
              >
                {/* Product name */}
                <h3
                  className="syne"
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "var(--text)",
                    lineHeight: 1.25,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.name}
                </h3>

                {/* Description */}
                <p
                  className="manrope"
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.6,
                    color: "var(--muted)",
                    flex: 1,
                  }}
                >
                  {p.description}
                </p>

                {/* Price row + Add to Cart */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "12px",
                    gap: "12px",
                  }}
                >
                  <span
                    className="syne"
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "var(--primary)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="card-add-btn manrope"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                      style={{
                        height: "40px",
                        padding: "0 18px",
                        borderRadius: "10px",
                        border: "none",
                        background: addedIds[p.id] ? "rgba(198,153,87,0.15)" : "var(--accent)",
                        color: addedIds[p.id] ? "var(--primary)" : "#fff",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "Manrope, sans-serif",
                        whiteSpace: "nowrap",
                        transition: "background 0.2s ease, color 0.2s ease, transform 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    >
                      {addedIds[p.id] ? "Added ✓" : "Add to Cart"}
                    </button>

                    <button
                      className="card-add-btn manrope"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                        );
                      }}
                      style={{
                        height: "40px",
                        padding: "0 18px",
                        borderRadius: "10px",
                        border: "1px solid rgba(43,44,45,0.15)",
                        background: "transparent",
                        color: "var(--text)",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "Manrope, sans-serif",
                        whiteSpace: "nowrap",
                        transition: "background 0.2s ease, transform 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.background = "rgba(43,44,45,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.background = "transparent";
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    >
                      View Product
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* ── EDITORIAL BAND: "Unrivaled Sound" ── */}
      <section
        className="reveal"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "var(--accent)",
          margin: "0 0 96px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "96px 32px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "center",
          }}
        >
          {/* Left: image with clip-path */}
          <div
            style={{
              overflow: "hidden",
              borderRadius: "20px",
              clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%)",
              boxShadow: "0 40px 80px -20px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src="/product-2.jpg"
              alt="Apple EarPods — wired earphones with clear audio quality"
              style={{
                width: "100%",
                aspectRatio: "4/5",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
            />
          </div>

          {/* Right: editorial text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <span
              className="syne"
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 700,
                color: "var(--primary)",
              }}
            >
              Our Philosophy
            </span>
            <h2
              className="syne"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                color: "#FFFFFF",
              }}
            >
              Unrivaled Sound.
              <br />
              Uninterrupted Silence.
            </h2>
            <p
              className="manrope"
              style={{
                fontSize: "17px",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Every product in the Soundshy collection is selected for its ability to deliver measurable acoustic performance — not marketing claims. We test against published specifications so you always know what you're buying.
            </p>
            <div
              style={{
                display: "flex",
                gap: "32px",
                flexWrap: "wrap",
                marginTop: "8px",
              }}
            >
              {[
                { stat: "50+", label: "Years of audio heritage" },
                { stat: "98%", label: "Noise cancellation depth" },
                { stat: "4.8★", label: "Average product rating" },
              ].map((s) => (
                <div key={s.stat} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span
                    className="syne"
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "var(--primary)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.stat}
                  </span>
                  <span
                    className="manrope"
                    style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <button
              className="syne"
              onClick={() => router.push("/shop")}
              style={{
                alignSelf: "flex-start",
                height: "52px",
                padding: "0 36px",
                borderRadius: "12px",
                border: "none",
                background: "var(--primary)",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                marginTop: "8px",
                boxShadow: "0 10px 30px -10px rgba(198,153,87,0.5)",
                transition: "transform 0.15s ease",
                fontFamily: "Syne, sans-serif",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Explore the Collection
            </button>
          </div>
        </div>
      </section>

      {/* ── CONTACT / NEWSLETTER ── */}
      <section
        id="contact"
        className="reveal"
        style={{
          background: "#FFFFFF",
          padding: "96px 32px",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            alignItems: "center",
          }}
        >
          <span
            className="syne"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontWeight: 700,
              color: "var(--primary)",
            }}
          >
            Stay Connected
          </span>
          <h2
            className="syne"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: "var(--text)",
            }}
          >
            Your Next Favourite
            <br />
            Earphone Is Waiting
          </h2>
          <p
            className="manrope"
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "var(--muted)",
              maxWidth: "520px",
            }}
          >
            Join 12,000+ audio enthusiasts who receive exclusive drop alerts, honest reviews, and early access to new arrivals — no spam, ever.
          </p>

          {subscribed ? (
            <div
              className="manrope"
              style={{
                padding: "16px 32px",
                borderRadius: "12px",
                background: "rgba(198,153,87,0.1)",
                border: "1px solid rgba(198,153,87,0.3)",
                color: "var(--primary)",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              Thanks for subscribing! We'll be in touch soon.
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              style={{
                display: "flex",
                gap: "12px",
                width: "100%",
                maxWidth: "480px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="manrope"
                style={{
                  flex: 1,
                  minWidth: "220px",
                  height: "52px",
                  padding: "0 20px",
                  borderRadius: "12px",
                  border: "1px solid rgba(43,44,45,0.15)",
                  background: "var(--bg)",
                  fontSize: "15px",
                  color: "var(--text)",
                  fontFamily: "Manrope, sans-serif",
                  outline: "none",
                }}
                onFocus={(e) => (e.currentTarget.style.border = "1px solid var(--primary)")}
                onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(43,44,45,0.15)")}
              />
              <button
                type="submit"
                className="syne"
                style={{
                  height: "52px",
                  padding: "0 32px",
                  borderRadius: "12px",
                  border: "none",
                  background: "var(--accent)",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Syne, sans-serif",
                  transition: "transform 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "var(--accent)",
          padding: "64px 32px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "48px",
              paddingBottom: "48px",
            }}
          >
            {/* Brand col */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.08)", alignSelf: "flex-start" }}>
                <img src="/logo.png" alt="Soundshy logo" style={{ height: "32px", objectFit: "contain", opacity: 0.85 }} />
              </div>
              <p
                className="manrope"
                style={{ fontSize: "14px", lineHeight: 1.65, color: "rgba(255,255,255,0.55)" }}
              >
                Sound. Elevated.
                <br />
                Premium audio for every moment.
              </p>
              {/* Social icons */}
              <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                {[
                  {
                    label: "Instagram",
                    href: "https://instagram.com",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    ),
                  },
                  {
                    label: "X",
                    href: "https://x.com",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    ),
                  },
                  {
                    label: "YouTube",
                    href: "https://youtube.com",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23 7s-.3-1.9-1.1-2.7c-1.1-1.1-2.3-1.1-2.8-1.2C16.2 3 12 3 12 3s-4.2 0-7.1.1c-.6.1-1.8.1-2.8 1.2C1.3 5.1 1 7 1 7S.7 9.1.7 11.3v2.1C.7 15.6 1 17.7 1 17.7s.3 1.9 1.1 2.7c1.1 1.1 2.5 1 3.1 1.1C7.1 21.7 12 21.7 12 21.7s4.2 0 7.1-.2c.6-.1 1.8-.1 2.8-1.2.8-.8 1.1-2.7 1.1-2.7s.3-2.1.3-4.3v-2.1C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l7.6 3.6-7.6 3.5z"/>
                      </svg>
                    ),
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      transition: "color 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)")}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Shop col */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span
                className="syne"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Shop
              </span>
              {["Earbuds", "Wired Earphones", "Accessories", "Gift Cards"].map((l) => (
                <button
                  key={l}
                  onClick={() => router.push("/shop")}
                  className="manrope"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: 0,
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 2.2,
                    fontFamily: "Manrope, sans-serif",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Learn col */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span
                className="syne"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Learn
              </span>
              {["Our Story", "Technology", "Press", "Careers"].map((l) => (
                <button
                  key={l}
                  onClick={() => {}}
                  className="manrope"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: 0,
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 2.2,
                    fontFamily: "Manrope, sans-serif",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Newsletter col */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span
                className="syne"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Stay in the loop
              </span>
              <p
                className="manrope"
                style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}
              >
                New drops, honest reviews, exclusive offers.
              </p>
              {subscribed ? (
                <span
                  className="manrope"
                  style={{ fontSize: "14px", color: "var(--primary)", fontWeight: 600 }}
                >
                  Thanks for subscribing!
                </span>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                >
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="manrope"
                    style={{
                      height: "48px",
                      padding: "0 16px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.06)",
                      color: "#fff",
                      fontSize: "15px",
                      fontFamily: "Manrope, sans-serif",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    className="syne"
                    style={{
                      height: "48px",
                      borderRadius: "10px",
                      border: "none",
                      background: "var(--primary)",
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "Syne, sans-serif",
                      transition: "transform 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom strip */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              padding: "24px 0",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              className="manrope"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                fontSize: "12px",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              <span>© 2026 Soundshy, Inc. All rights reserved.</span>
              <button
                onClick={() => {}}
                className="manrope"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "Manrope, sans-serif",
                  padding: 0,
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => {}}
                className="manrope"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "Manrope, sans-serif",
                  padding: 0,
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >
                Terms of Use
              </button>
            </div>
            {/* Payment icons */}
            <div
              className="manrope"
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                fontSize: "11px",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              {["VISA", "MC", "AMEX", "UPI", "GPay"].map((p) => (
                <span
                  key={p}
                  className="syne"
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: "Syne, sans-serif",
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}