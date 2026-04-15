import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";
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
    // Load dynamic content from backend
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
        // fallback content
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

  // === Scroll Animation Observer ===
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            entry.target.style.transitionDelay = `${idx * 0.1}s`;
          }
        });
      },
      { threshold: 0.2 }
    );

    const hiddenEls = document.querySelectorAll(".cc-card, .cc-step, .cc-testi");
    hiddenEls.forEach((el) => observer.observe(el));

    return () => {
      hiddenEls.forEach((el) => observer.unobserve(el));
    };
  }, [cards, howItWorks, testimonials]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="cc-root">
      <Navbar user={user} />

      {/* === HERO === */}
      <section className="cc-hero">
        <div className="cc-hero-inner">
          <h1 className="cc-hero-title">Welcome! To Collegecart...</h1>
          <p className="cc-hero-sub">
            Everything you need for campus life — in one place.
          </p>

          {/* SIDE-BY-SIDE CARDS */}
          <div className="cc-card-row">
            {cards.slice(0, 4).map((c, i) => (
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

      {/* === HOW IT WORKS === */}
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

      {/* === TESTIMONIALS === */}
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
