"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [prevTotal, setPrevTotal] = React.useState(totalItems);
  const [badgePulse, setBadgePulse] = React.useState(false);

  React.useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (totalItems !== prevTotal) {
      setBadgePulse(true);
      setPrevTotal(totalItems);
      const t = setTimeout(() => setBadgePulse(false), 500);
      return () => clearTimeout(t);
    }
  }, [totalItems, prevTotal]);

  function scrollToAbout() {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }

  const navLinks = [
    { label: "Shop", action: () => { router.push("/shop"); setMobileOpen(false); } },
    { label: "Earbuds", action: () => { router.push("/shop"); setMobileOpen(false); } },
    { label: "Our Story", action: scrollToAbout },
    { label: "Support", action: scrollToAbout },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#2B2C2D",
        boxShadow: scrolled
          ? "0 2px 24px 0 rgba(198,153,87,0.18)"
          : "0 1px 0 0 rgba(255,255,255,0.06)",
        transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {/* Announcement bar */}
      <div
        style={{
          backgroundColor: "#C69957",
          textAlign: "center",
          padding: "6px 16px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#1A1A1A",
          letterSpacing: "0.04em",
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        Free shipping on orders above ₹2,499 &nbsp;·&nbsp; COD available across India
      </div>

      <nav
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ flexShrink: 0 }}>
          <img
            src="/logo.png"
            alt="Soundshy logo"
            style={{ height: "40px", objectFit: "contain", cursor: "pointer" }}
            onClick={() => router.push("/")}
          />
        </div>

        {/* Desktop nav links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0px",
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#FFFFFF",
                fontSize: "16px",
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 500,
                letterSpacing: "0.02em",
                padding: "0 24px",
                height: "64px",
                display: "flex",
                alignItems: "center",
                position: "relative",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#C69957";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#C69957";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right: Cart + Mobile Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Cart button */}
          <button
            onClick={() => router.push("/checkout")}
            aria-label={`Open cart, ${totalItems} items`}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              padding: "8px",
              borderRadius: "8px",
              transition: "background 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(198,153,87,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "none";
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(198,153,87,0.12)";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "none";
            }}
          >
            {/* Cart SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {/* Badge */}
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "#C0392B",
                  color: "#FFFFFF",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "'Manrope', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  transform: badgePulse ? "scale(1.3)" : "scale(1)",
                  transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                  pointerEvents: "none",
                }}
              >
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#FFFFFF",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              borderRadius: "8px",
            }}
            className="show-mobile"
          >
            {mobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div
        aria-hidden={!mobileOpen}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#2B2C2D",
          zIndex: 49,
          display: "flex",
          flexDirection: "column",
          padding: "80px 32px 48px",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transform: mobileOpen ? "translateY(0)" : "translateY(-12px)",
          transition:
            "opacity 0.28s cubic-bezier(0.4,0,0.2,1), transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Mobile logo */}
        <div style={{ marginBottom: "48px" }}>
          <img
            src="/logo.png"
            alt="Soundshy logo"
            style={{ height: "36px", objectFit: "contain" }}
            onClick={() => { router.push("/"); setMobileOpen(false); }}
          />
        </div>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#FFFFFF",
                fontSize: "28px",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                padding: "12px 0",
                textAlign: "left",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#C69957";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div
          style={{
            marginTop: "auto",
            color: "#9E8B72",
            fontSize: "14px",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          <a
            href="mailto:maliyajay77@gmail.com"
            style={{ color: "#C69957", textDecoration: "none" }}
          >
            maliyajay77@gmail.com
          </a>
        </div>
      </div>

      {/* Responsive style rules via Tailwind-style class injection — using global CSS classes */}
      {/* These classes must exist in globals.css. Fallback inline for safety: */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 768px) {
              .hidden-mobile { display: none !important; }
              .show-mobile { display: flex !important; }
            }
            @media (min-width: 769px) {
              .show-mobile { display: none !important; }
              .hidden-mobile { display: flex !important; }
            }
          `,
        }}
      />
    </header>
  );
}