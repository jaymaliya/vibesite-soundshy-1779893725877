"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items = [], removeItem, total } = (useCart() as any) ?? { items: [], removeItem: () => {}, total: 0 };

  const clearCart = (useCart() as any)?.clearCart ?? (() => {});

  const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const orderTotal = subtotal + shipping;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [paying, setPaying] = useState(false);
  const [payData, setPayData] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [paymentLaunched, setPaymentLaunched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://fonts.googleapis.com";
    document.head.appendChild(link);
    const link2 = document.createElement("link");
    link2.rel = "stylesheet";
    link2.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap";
    document.head.appendChild(link2);
  }, []);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email is required";
    if (!phone.trim() || !/^\d{10}$/.test(phone)) e.phone = "Enter a valid 10-digit phone number";
    if (!address.trim()) e.address = "Address is required";
    if (!city.trim()) e.city = "City is required";
    if (!state.trim()) e.state = "State is required";
    if (!pin.trim() || !/^\d{6}$/.test(pin)) e.pin = "Enter a valid 6-digit PIN code";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePay() {
    if (!validate()) return;
    setPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: orderTotal,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i: any) => ({ name: i.name, qty: i.quantity, price: i.price }))),
        }),
      });
      const data = await res.json();
      setPayData(data);
    } catch {
      setPaying(false);
    }
  }

  async function payNow() {
    if (!payData) return;
    if (typeof (window as any).PaymentRequest !== "undefined") {
      try {
        const req = new (window as any).PaymentRequest(
          [{ supportedMethods: "https://tez.google.com/pay", data: { pa: payData.upiId, tr: payData.orderId, am: String(payData.amount), cu: "INR" } }],
          { total: { label: "Total", amount: { currency: "INR", value: String(payData.amount) } } }
        );
        const canPay = await req.canMakePayment();
        if (canPay) {
          const response = await req.show();
          await response.complete("success");
          setPaymentLaunched(true);
          return;
        }
      } catch (_e) {}
    }
    window.location.href = `upi://pay?pa=${encodeURIComponent(payData.upiId)}&am=${payData.amount}&cu=INR`;
    setTimeout(() => setPaymentLaunched(true), 4000);
  }

  async function confirmOrder() {
    if (!payData) return;
    setConfirming(true);
    try {
      await fetch("/api/upi-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: payData.orderId,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i: any) => ({ name: i.name, qty: i.quantity, price: i.price }))),
          brandName: "Soundshy",
          amount: payData.amount,
          upiTxnId,
        }),
      });
      setPaid(true);
      clearCart();
    } catch {
      setConfirming(false);
    }
  }

  const inputBase: React.CSSProperties = {
    width: "100%",
    height: "48px",
    padding: "0 16px",
    border: "1px solid #E2D9CE",
    borderRadius: "12px",
    background: "#FFFFFF",
    fontFamily: "'Manrope', sans-serif",
    fontSize: "15px",
    color: "var(--text)",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  };

  const errorInput: React.CSSProperties = { ...inputBase, borderColor: "#E05555" };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--accent)",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginBottom: "6px",
    display: "block",
  };

  const errorText: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "12px",
    color: "#E05555",
    marginTop: "4px",
  };

  if (items.length === 0 && !paid) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Manrope', sans-serif", padding: "48px 24px" }}>
        <style>{`
          :root { --bg:#FAF9F7; --surface:#A87E42; --primary:#C69957; --accent:#2B2C2D; --text:#1A1A1A; --muted:#9E8B72; }
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap');
        `}</style>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#F0EAE0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M6 8h24l-2.5 16H8.5L6 8z" stroke="#9E8B72" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
              <circle cx="13" cy="29" r="2" fill="#9E8B72"/>
              <circle cx="23" cy="29" r="2" fill="#9E8B72"/>
              <path d="M2 4h3l1 4" stroke="#9E8B72" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.75rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "12px" }}>Your cart is empty</h2>
          <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.6, marginBottom: "32px" }}>Looks like you haven't added anything yet. Explore our premium audio collection.</p>
          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            style={{ padding: "16px 40px", background: "var(--accent)", color: "#FAF9F7", border: "none", borderRadius: "12px", fontFamily: "'Manrope', sans-serif", fontSize: "15px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em", transition: "transform 0.15s ease" }}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Manrope', sans-serif" }}>
      <style>{`
        :root { --bg:#FAF9F7; --surface:#A87E42; --primary:#C69957; --accent:#2B2C2D; --text:#1A1A1A; --muted:#9E8B72; }
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(198,153,87,0.15); }
        input::placeholder { color: #C4B8A8; }
        @media (max-width: 768px) {
          .checkout-grid { flex-direction: column !important; }
          .checkout-left { width: 100% !important; }
          .checkout-right { width: 100% !important; position: static !important; }
        }
      `}</style>

      {/* Navbar */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,249,247,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(198,153,87,0.15)", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <img
          src="/logo.png"
          alt="Soundshy logo"
          style={{ height: "40px", objectFit: "contain", cursor: "pointer" }}
          onClick={() => router.push("/")}
        />
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Secure Checkout</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1a3.5 3.5 0 013.5 3.5v1H12a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7a1 1 0 011-1h.5V4.5A3.5 3.5 0 018 1zm0 1.5A2 2 0 006 4.5v1h4v-1A2 2 0 008 2.5z" fill="#9E8B72"/>
          </svg>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "13px", color: "var(--muted)" }}>SSL Secured</span>
        </div>
      </header>

      {/* Progress Indicator */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #F0EAE0", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", gap: "0", justifyContent: "center" }}>
          {["Cart", "Details", "Payment", "Confirmation"].map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: i <= 2 ? "var(--primary)" : "#E8E0D5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "12px", fontWeight: 700, color: i <= 2 ? "#FFFFFF" : "#9E8B72" }}>{i + 1}</span>
                </div>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "11px", fontWeight: i === 2 ? 700 : 500, color: i <= 2 ? "var(--text)" : "var(--muted)", whiteSpace: "nowrap" }}>{step}</span>
              </div>
              {i < 3 && <div style={{ width: "48px", height: "2px", background: i < 2 ? "var(--primary)" : "#E8E0D5", margin: "0 4px", marginBottom: "20px" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px 96px" }}>
        <div className="checkout-grid" style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>

          {/* Left: Form */}
          <div className="checkout-left" style={{ width: "60%" }}>
            {/* Delivery Info */}
            <div style={{ background: "#FFFFFF", borderRadius: "20px", padding: "36px", boxShadow: "0 4px 24px rgba(198,153,87,0.08)", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(198,153,87,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM1.5 16.5c0-3.314 3.358-6 7.5-6s7.5 2.686 7.5 6" stroke="#C69957" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", margin: 0 }}>Delivery Information</h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: "" })); }}
                    placeholder="Arjun Sharma"
                    style={errors.name ? errorInput : inputBase}
                  />
                  {errors.name && <p style={errorText}>{errors.name}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }}
                    placeholder="arjun@example.com"
                    style={errors.email ? errorInput : inputBase}
                  />
                  {errors.email && <p style={errorText}>{errors.email}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(prev => ({ ...prev, phone: "" })); }}
                    placeholder="9876543210"
                    style={errors.phone ? errorInput : inputBase}
                  />
                  {errors.phone && <p style={errorText}>{errors.phone}</p>}
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Delivery Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => { setAddress(e.target.value); setErrors(prev => ({ ...prev, address: "" })); }}
                    placeholder="Flat 4B, Prestige Towers, MG Road"
                    style={errors.address ? { ...errorInput, height: "48px" } : { ...inputBase, height: "48px" }}
                  />
                  {errors.address && <p style={errorText}>{errors.address}</p>}
                </div>

                <div>
                  <label style={labelStyle}>City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => { setCity(e.target.value); setErrors(prev => ({ ...prev, city: "" })); }}
                    placeholder="Bengaluru"
                    style={errors.city ? errorInput : inputBase}
                  />
                  {errors.city && <p style={errorText}>{errors.city}</p>}
                </div>

                <div>
                  <label style={labelStyle}>State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => { setState(e.target.value); setErrors(prev => ({ ...prev, state: "" })); }}
                    placeholder="Karnataka"
                    style={errors.state ? errorInput : inputBase}
                  />
                  {errors.state && <p style={errorText}>{errors.state}</p>}
                </div>

                <div>
                  <label style={labelStyle}>PIN Code</label>
                  <input
                    type="text"
                    value={pin}
                    onChange={e => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); setErrors(prev => ({ ...prev, pin: "" })); }}
                    placeholder="560001"
                    style={errors.pin ? errorInput : inputBase}
                  />
                  {errors.pin && <p style={errorText}>{errors.pin}</p>}
                </div>
              </div>
            </div>

            {/* Trust Signals */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {[
                { icon: "🔒", label: "256-bit SSL Encryption" },
                { icon: "📦", label: "Express Delivery Available" },
                { icon: "↩️", label: "7-Day Easy Returns" },
              ].map(t => (
                <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FFFFFF", border: "1px solid #F0EAE0", borderRadius: "999px", padding: "8px 16px" }}>
                  <span style={{ fontSize: "14px" }}>{t.icon}</span>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "12px", fontWeight: 500, color: "var(--muted)" }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="checkout-right" style={{ width: "40%", position: "sticky", top: "80px" }}>
            <div style={{ background: "#FFFFFF", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(198,153,87,0.10)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(198,153,87,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 2h2l2.5 10H14l2-7H5" stroke="#C69957" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="8" cy="15.5" r="1" fill="#C69957"/>
                    <circle cx="13" cy="15.5" r="1" fill="#C69957"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", margin: 0 }}>Order Summary</h2>
              </div>

              {/* Cart Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                {items.map((item: any) => (
                  <div key={item.id} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "12px", overflow: "hidden", background: "#FAF9F7", flexShrink: 0, border: "1px solid #F0EAE0" }}>
                      <img
                        src={item.image || item.img}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "13px", color: "var(--muted)" }}>Qty: {item.quantity}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--primary)" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", marginTop: "2px" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 2l10 10M12 2L2 12" stroke="#9E8B72" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "#F0EAE0", marginBottom: "20px" }} />

              {/* Totals */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "14px", color: "var(--muted)" }}>Subtotal</span>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "14px", color: "var(--muted)" }}>Shipping</span>
                  {shipping === 0 ? (
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "13px", fontWeight: 600, color: "#2D9E5F", background: "rgba(45,158,95,0.1)", padding: "2px 10px", borderRadius: "999px" }}>FREE</span>
                  ) : (
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>₹99</span>
                  )}
                </div>
                {shipping > 0 && (
                  <div style={{ background: "rgba(198,153,87,0.08)", borderRadius: "8px", padding: "10px 14px" }}>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: "var(--primary)", fontWeight: 500 }}>
                      Add ₹{(500 - subtotal).toLocaleString("en-IN")} more for FREE shipping
                    </p>
                  </div>
                )}
                <div style={{ height: "1px", background: "#F0EAE0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text)" }}>Total</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.02em" }}>₹{orderTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* UPI Tag */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center", background: "#FAF9F7", border: "1px solid #F0EAE0", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L3 8v10h5v-5h4v5h5V8L10 2z" stroke="#C69957" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                </svg>
                <div>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text)", margin: 0 }}>Pay via UPI</p>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: "var(--muted)", margin: 0 }}>Google Pay · PhonePe · Paytm · Any UPI app</p>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePay}
                disabled={paying}
                onMouseEnter={e => !paying && (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{ width: "100%", height: "56px", background: paying ? "#9E8B72" : "var(--accent)", color: "#FAF9F7", border: "none", borderRadius: "12px", fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, cursor: paying ? "not-allowed" : "pointer", letterSpacing: "0.02em", transition: "transform 0.15s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 8px 24px rgba(43,44,45,0.25)" }}
              >
                {paying ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                      <circle cx="9" cy="9" r="7" stroke="#FAF9F7" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12"/>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 1L2 6v10h5V11h4v5h5V6L9 1z" stroke="#FAF9F7" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                    </svg>
                    Proceed to Pay — ₹{orderTotal.toLocaleString("en-IN")}
                  </>
                )}
              </button>

              <button
                onClick={() => router.push("/shop")}
                onMouseEnter={e => (e.currentTarget.style.background = "#F5EEE3")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                style={{ width: "100%", height: "44px", background: "transparent", color: "var(--muted)", border: "1px solid #E2D9CE", borderRadius: "12px", fontFamily: "'Manrope', sans-serif", fontSize: "14px", fontWeight: 500, cursor: "pointer", marginTop: "12px", transition: "background 0.2s ease" }}
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* UPI Payment Overlay */}
      {payData && !paid && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,26,26,0.75)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "24px", padding: "32px", maxWidth: "420px", width: "100%", boxShadow: "0 32px 80px rgba(0,0,0,0.3)", position: "relative" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src="/logo.png" alt="Soundshy" style={{ height: "28px", objectFit: "contain" }} />
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text)" }}>Soundshy</span>
              </div>
              <button
                onClick={() => { setPayData(null); setPaying(false); setPaymentLaunched(false); }}
                style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#F5F0EA", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="#9E8B72" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Amount */}
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "13px", color: "var(--muted)", marginBottom: "4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Total Amount</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "2.75rem", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.03em", lineHeight: 1 }}>₹{payData.amount?.toLocaleString("en-IN")}</p>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: "var(--muted)", marginTop: "6px" }}>Order #{String(payData.orderId || "").slice(-8)}</p>
            </div>

            {/* Mobile or Desktop */}
            {isMobile ? (
              <div style={{ marginBottom: "24px" }}>
                {!paymentLaunched ? (
                  <>
                    <button
                      onClick={payNow}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                      style={{ width: "100%", height: "56px", background: "var(--accent)", color: "#FAF9F7", border: "none", borderRadius: "12px", fontFamily: "'Syne', sans-serif", fontSize: "17px", fontWeight: 700, cursor: "pointer", transition: "transform 0.15s ease", boxShadow: "0 8px 24px rgba(43,44,45,0.25)" }}
                    >
                      Pay ₹{payData.amount?.toLocaleString("en-IN")} Now
                    </button>
                    <p style={{ textAlign: "center", fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: "var(--muted)", marginTop: "10px" }}>Opens Google Pay · PhonePe · Paytm</p>
                  </>
                ) : (
                  <div style={{ background: "rgba(45,158,95,0.08)", border: "1px solid rgba(45,158,95,0.2)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "14px", fontWeight: 600, color: "#2D9E5F" }}>✓ Payment app opened — confirm below</p>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>Complete the payment in your UPI app, then click "I've Paid"</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ marginBottom: "24px", textAlign: "center" }}>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "14px" }}>Scan with any UPI app</p>
                {payData.qrBase64 ? (
                  <div style={{ display: "inline-block", padding: "12px", background: "#FFFFFF", borderRadius: "16px", border: "2px solid #F0EAE0", boxShadow: "0 4px 16px rgba(198,153,87,0.15)" }}>
                    <img
                      src={`data:image/png;base64,${payData.qrBase64}`}
                      alt="UPI QR Code"
                      width={180}
                      height={180}
                      style={{ display: "block" }}
                    />
                  </div>
                ) : (
                  <div style={{ width: "180px", height: "180px", background: "#FAF9F7", borderRadius: "16px", border: "2px dashed #E2D9CE", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: "var(--muted)", textAlign: "center", padding: "16px" }}>QR code will appear here</p>
                  </div>
                )}
                <div style={{ marginTop: "14px", display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                  {["Google Pay", "PhonePe", "Paytm", "BHIM"].map(app => (
                    <span key={app} style={{ fontFamily: "'Manrope', sans-serif", fontSize: "11px", fontWeight: 500, color: "var(--muted)", background: "#FAF9F7", border: "1px solid #E2D9CE", borderRadius: "999px", padding: "3px 10px" }}>{app}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ flex: 1, height: "1px", background: "#F0EAE0" }} />
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: "var(--muted)" }}>Confirm your payment</span>
              <div style={{ flex: 1, height: "1px", background: "#F0EAE0" }} />
            </div>

            {/* Confirm Section */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="text"
                placeholder="UPI Transaction ID (optional)"
                value={upiTxnId}
                onChange={e => setUpiTxnId(e.target.value)}
                style={{ ...inputBase, background: "#FAF9F7", borderColor: "#E2D9CE" }}
              />
              <button
                onClick={confirmOrder}
                disabled={confirming}
                onMouseEnter={e => !confirming && (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                style={{ width: "100%", height: "52px", background: confirming ? "#9E8B72" : "var(--primary)", color: "#FFFFFF", border: "none", borderRadius: "12px", fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, cursor: confirming ? "not-allowed" : "pointer", transition: "transform 0.15s ease", boxShadow: "0 6px 20px rgba(198,153,87,0.35)" }}
              >
                {confirming ? "Confirming..." : "I've Paid — Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Overlay */}
      {paid && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(250,249,247,0.97)", backdropFilter: "blur(12px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ textAlign: "center", maxWidth: "440px" }}>
            <div style={{ width: "96px", height: "96px", borderRadius: "50%", background: "rgba(45,158,95,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M12 24l9 9 15-18" stroke="#2D9E5F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2.25rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: "12px" }}>Order Confirmed!</h1>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "15px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "8px" }}>
              Thank you for your order. We'll prepare your premium audio gear right away.
            </p>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--primary)", marginBottom: "8px" }}>
              Order #{payData ? String(payData.orderId || "").slice(-8) : ""}
            </p>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "14px", color: "var(--muted)", marginBottom: "40px" }}>We'll ship soon — tracking details will be sent to your email.</p>
            <button
              onClick={() => router.push("/")}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              style={{ padding: "16px 48px", background: "var(--accent)", color: "#FAF9F7", border: "none", borderRadius: "12px", fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, cursor: "pointer", transition: "transform 0.15s ease", boxShadow: "0 8px 24px rgba(43,44,45,0.2)", letterSpacing: "0.02em" }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}