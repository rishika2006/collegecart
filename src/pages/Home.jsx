import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [howItWorks, setHowItWorks] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    // Load dynamic content from MERN backend
    Promise.all([
      fetch(`${API}/api/sections`).then((r) => r.json()),
      fetch(`${API}/api/how-it-works`).then((r) => r.json()),
      fetch(`${API}/api/testimonials`).then((r) => r.json()),
    ])
      .then(([sections, how, testi]) => {
        setCards(sections);
        setHowItWorks(how);
        setTestimonials(testi);
      })
      .catch(() => {
        // graceful fallback if backend not running
        setCards([
          { title: "Marketplace", icon: "🛍️", desc: "Buy & sell on campus", link: "/marketplace" },
          { title: "Study Materials", icon: "📚", desc: "Notes, books, papers", link: "/study-material" },
          { title: "Skill Exchange", icon: "🤝", desc: "Teach & learn skills", link: "/skill-exchange" },
          { title: "Lost & Found", icon: "🔎", desc: "Report or find items", link: "/lost-found" },
          { title: "Events", icon: "🎉", desc: "What’s happening", link: "/events" },
          { title: "Wellness", icon: "💙", desc: "Tips & resources", link: "/wellness" },
        ]);
        setHowItWorks([
          { step: "Register", text: "Sign up with your college email." },
          { step: "Explore", text: "Browse items, notes, events & more." },
          { step: "Connect", text: "Message, meet, buy/sell safely." },
        ]);
        setTestimonials([
          { name: "Aarav", quote: "Sold my old books in 2 days!" },
          { name: "Diya", quote: "Found a lost ID thanks to the community." },
          { name: "Kabir", quote: "Notes section is a lifesaver before exams." },
        ]);
      });
  }, [API]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="cc-root">
      {/* === EXACT NAVBAR THEME (purple + white, responsive) === */}
      <header className="cc-navbar">
        <div className="cc-left">
          <img src="/logo.png" alt="Logo" className="cc-logo" />
          <span className="cc-brand">CollegeCart+</span>
          <nav className="cc-links">
            <a href="/marketplace">Marketplace</a>
            <a href="/study-materials">Study Materials</a>
            <a href="/skill-exchange">Skill Exchange</a>
            <a href="/lost-found">Lost &amp; Found</a>
            <a href="/events">Events</a>
            <a href="/wellness">Wellness</a>
          </nav>
        </div>

        <div className="cc-right">
          <span className="cc-welcome">
            Welcome, {user?.displayName || user?.email || "Guest"}!
          </span>
          {user && (
            <button className="cc-btn-signout" onClick={handleSignOut}>
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* === HERO (fills the screen height, centered content) === */}
      <section className="cc-hero">
        <div className="cc-hero-inner">
          <h1 className="cc-hero-title">🏠 Home Dashboard</h1>
          <p className="cc-hero-sub">
            Everything you need for campus life — at one place.
          </p>

          {/* BIG INTERACTIVE CARDS */}
          <div className="cc-card-grid">
            {cards.map((c, i) => (
              <div
                key={i}
                className="cc-card"
                onClick={() => navigate(c.link || "/")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(c.link || "/")}
              >
                <div className="cc-card-ico">{c.icon}</div>
                <h3 className="cc-card-title">{c.title}</h3>
                <p className="cc-card-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === SCROLLABLE CONTENT BELOW === */}
      <section id="how" className="cc-section">
        <h2>How it works</h2>
        <div className="cc-steps">
          {howItWorks.map((s, i) => (
            <div key={i} className="cc-step">
              <div className="cc-step-badge">{i + 1}</div>
              <h4>{s.step}</h4>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="testimonials" className="cc-section alt">
        <h2>What students say</h2>
        <div className="cc-testis">
          {testimonials.map((t, i) => (
            <figure key={i} className="cc-testi">
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>— {t.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <footer className="cc-footer">
        © {new Date().getFullYear()} CollegeCart+. All rights reserved.
      </footer>
    </div>
  );
}
