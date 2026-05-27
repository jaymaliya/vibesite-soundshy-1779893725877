"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer
      style={{
        backgroundColor: "#1A1A1A",
        color: "#FAF9F7",
        fontFamily: "'Manrope', sans-serif",
        paddingTop: "80px",
        paddingBottom: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Top grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "48px",
            paddingBottom: "64px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Brand column */}
          <div>
            <img
              src="/logo.png"
              alt="Soundshy logo"
              style={{
                height: "32px",
                objectFit: "contain",
                opacity: 0.85,
                marginBottom: "20px",
                cursor: "pointer",
              }}
              onClick={() => router.push("/")}
            />
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.7",
                color: "#9E8B72",
                maxWidth: "260px",
                marginBottom: "24px",
              }}
            >
              We provide better sound. Premium wireless audio crafted for
              discerning ears — built for India, heard worldwide.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "16px" }}>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Soundshy on Instagram"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "1px solid rgba(198,153,87,0.3)",
                  color: "#C69957",
                  transition:
                    "background 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "rgba(198,153,87,0.15)";
                  el.style.borderColor = "#C69957";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "transparent";
                  el.style.borderColor = "rgba(198,153,87,0.3)";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Soundshy on Twitter"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "1px solid rgba(198,153,87,0.3)",
                  color: "#C69957",
                  transition:
                    "background 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "rgba(198,153,87,0.15)";
                  el.style.borderColor = "#C69957";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "transparent";
                  el.style.borderColor = "rgba(198,153,87,0.3)";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.38 4.07 3.6 1.64.95a4.52 4.52 0 0 0-.61 2.27c0 1.57.8 2.95 2.01 3.76a4.5 4.5 0 0 1-2.05-.57v.06c0 2.19 1.56 4.02 3.63 4.43a4.55 4.55 0 0 1-2.04.08 4.53 4.53 0 0 0 4.22 3.14A9.07 9.07 0 0 1 0 19.54a12.8 12.8 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84 0-.2 0-.39-.01-.58A9.17 9.17 0 0 0 23 3z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/917700000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact Soundshy on WhatsApp"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "1px solid rgba(198,153,87,0.3)",
                  color: "#C69957",
                  transition:
                    "background 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "rgba(198,153,87,0.15)";
                  el.style.borderColor = "#C69957";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "transparent";
                  el.style.borderColor = "rgba(198,153,87,0.3)";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                color: "#FAF9F7",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              Quick Links
            </h3>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {[
                { label: "Home", action: () => router.push("/") },
                { label: "Shop", action: () => router.push("/shop") },
                { label: "Checkout", action: () => router.push("/checkout") },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9E8B72",
                    fontSize: "14px",
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 500,
                    textAlign: "left",
                    padding: 0,
                    transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#C69957";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#9E8B72";
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#C69957";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#9E8B72";
                  }}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact & Support */}
          <div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                color: "#FAF9F7",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              Contact & Support
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                fontSize: "14px",
                color: "#9E8B72",
                lineHeight: "1.6",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C69957"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: "2px" }}
                  aria-hidden="true"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a
                  href="mailto:maliyajay77@gmail.com"
                  style={{
                    color: "#9E8B72",
                    textDecoration: "none",
                    transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#C69957";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#9E8B72";
                  }}
                >
                  maliyajay77@gmail.com
                </a>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C69957"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: "2px" }}
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Made in India — Ships pan-India via Speed Post &amp; courier</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C69957"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: "2px" }}
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Response within 24 hours (Mon–Sat)</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                color: "#FAF9F7",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Stay in the Loop
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "#9E8B72",
                lineHeight: "1.6",
                marginBottom: "20px",
              }}
            >
              New drops, exclusive deals, and audio insights — straight to your
              inbox. No spam, unsubscribe anytime.
            </p>

            {status === "success" ? (
              <div
                style={{
                  backgroundColor: "rgba(198,153,87,0.12)",
                  border: "1px solid rgba(198,153,87,0.4)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  color: "#C69957",
                  fontSize: "14px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Thanks! We&apos;ll be in touch.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} noValidate>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={status === "loading"}
                    aria-label="Email address for newsletter"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      color: "#FAF9F7",
                      fontSize: "14px",
                      fontFamily: "'Manrope', sans-serif",
                      outline: "none",
                      width: "100%",
                      boxSizing: "border-box",
                      transition:
                        "border-color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLInputElement).style.borderColor =
                        "#C69957";
                      (e.currentTarget as HTMLInputElement).style.background =
                        "rgba(198,153,87,0.06)";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLInputElement).style.borderColor =
                        "rgba(255,255,255,0.12)";
                      (e.currentTarget as HTMLInputElement).style.background =
                        "rgba(255,255,255,0.06)";
                    }}
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    style={{
                      backgroundColor: "#C69957",
                      color: "#1A1A1A",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 700,
                      cursor: status === "loading" ? "not-allowed" : "pointer",
                      opacity: status === "loading" ? 0.7 : 1,
                      letterSpacing: "0.02em",
                      width: "100%",
                      transition:
                        "transform 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) => {
                      if (status !== "loading") {
                        (e.currentTarget as HTMLButtonElement).style.transform =
                          "scale(1.02)";
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "#A87E42";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1)";
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "#C69957";
                    }}
                    onMouseDown={(e) => {
                      if (status !== "loading") {
                        (e.currentTarget as HTMLButtonElement).style.transform =
                          "scale(0.98)";
                      }
                    }}
                    onMouseUp={(e) => {
                      if (status !== "loading") {
                        (e.currentTarget as HTMLButtonElement).style.transform =
                          "scale(1.02)";
                      }
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline =
                        "2px solid #C69957";
                      (e.currentTarget as HTMLButtonElement).style.outlineOffset =
                        "2px";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline =
                        "none";
                    }}
                  >
                    {status === "loading" ? "Subscribing…" : "Subscribe"}
                  </button>
                  {status === "error" && (
                    <p
                      style={{
                        color: "#E07070",
                        fontSize: "12px",
                        margin: 0,
                        fontFamily: "'Manrope', sans-serif",
                      }}
                    >
                      Something went wrong. Please try again.
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "32px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "#9E8B72",
              margin: 0,
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            &copy; {new Date().getFullYear()} Soundshy. All rights reserved.
            &nbsp;&middot;&nbsp; Made with care in India.
          </p>
          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {["Privacy Policy", "Terms of Use", "Refund Policy"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  const el = document.getElementById("about");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9E8B72",
                  fontSize: "13px",
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 400,
                  padding: 0,
                  transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#C69957";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#9E8B72";
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}