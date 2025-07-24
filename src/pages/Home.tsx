import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Clock,
  Users,
  Cloud,
  Mail,
  Globe,
  DollarSign,
  GraduationCap,
  User,
  ArrowRight,
  TrendingUp,
  PieChart,
} from "lucide-react";
import preview from "../assets/images/cashflow.png";
import logo from "../assets/images/dark-transparent-image.png";
import "../styles/Home.css";

const features = [
  {
    icon: <Shield size={28} />,
    color: "purple",
    title: "Secure Login",
    desc: "Protected by Fortuna authentication with enterprise-grade security",
  },
  {
    icon: <Clock size={28} />,
    color: "teal",
    title: "Real-time Tracking",
    desc: "Instantly log and update your income and expenses as they happen",
  },
  {
    icon: <TrendingUp size={28} />,
    color: "blue",
    title: "Visual Analytics",
    desc: "Beautiful charts to understand your spending patterns",
  },
  {
    icon: <Users size={28} />,
    color: "amber",
    title: "Clean Interface",
    desc: "Intuitive UI designed for effortless financial management",
  },
  {
    icon: <Cloud size={28} />,
    color: "green",
    title: "Cloud Sync",
    desc: "Your data syncs securely across all devices via Firebase",
  },
  {
    icon: <PieChart size={28} />,
    color: "red",
    title: "Smart Budgeting",
    desc: "Set budgets and get alerts when you're approaching limits",
  },
];

const idealFor = [
  {
    icon: <DollarSign size={28} />,
    color: "blue",
    title: "Budget-conscious individuals",
  },
  {
    icon: <GraduationCap size={28} />,
    color: "purple",
    title: "Students and freelancers",
  },
  {
    icon: <User size={28} />,
    color: "teal",
    title: "Financial beginners",
  },
];

const Home: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [mobileMenuOpen]);

  // Close menu on ESC or click outside
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="home-container">
      {/* Sticky Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <a href="/" className="navbar-logo">
              <img src={logo} alt="CashFlow Logo" className="navbar-logo-img" />
            </a>
          </div>
          <div className="navbar-center">
            <a href="/" className="navbar-link">
              Home
            </a>
            <a href="/dashboard" className="navbar-link">
              Dashboard
            </a>
            <a href="#features" className="navbar-link">
              Features
            </a>
          </div>
          <div className="navbar-right">
            {/* Hamburger only on mobile, auth links only on desktop */}
            <button
              className="navbar-hamburger"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="navbar-mobile-menu"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              &#9776;
            </button>
            <a href="/login" className="navbar-link navbar-auth">
              Login
            </a>
            <a
              href="/register"
              className="navbar-link navbar-auth navbar-register"
            >
              Register
            </a>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="navbar-mobile-menu"
            id="navbar-mobile-menu"
            ref={menuRef}
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <button
              className="navbar-mobile-close"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              &times;
            </button>
            <a
              href="/"
              className="navbar-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/dashboard"
              className="navbar-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </a>
            <a
              href="#features"
              className="navbar-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="/login"
              className="navbar-link navbar-auth"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </a>
            <a
              href="/register"
              className="navbar-link navbar-auth navbar-register"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </a>
          </div>
        )}
      </nav>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                Take Control of Your <br />
                <span className="highlight">Personal Finances</span>
              </h1>
              <p className="hero-description">
                Track income, monitor expenses, and achieve your financial goals
                with CashFlow - the simple, fast, and secure budgeting app.
              </p>
              <div className="hero-buttons">
                <a href="/dashboard">
                  <button className="btn-primary">
                    Get Started <ArrowRight size={18} />
                  </button>
                </a>
                <a href="/login">
                  <button className="btn-secondary">Login</button>
                </a>
              </div>
            </div>
            <div className="hero-image-container">
              <img
                src={preview}
                alt="CashFlow App Dashboard"
                className="hero-image"
              />
              <div className="image-highlight"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Features</span>
            <h2>Powerful financial tools</h2>
            <p>Everything you need to take control of your money</p>
          </div>

          <div className="features-grid">
            {features.map((f) => (
              <div className={`feature-card ${f.color}`} key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal For Section */}
      <section className="audience-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Who's it for</span>
            <h2>Perfect for your financial journey</h2>
          </div>
          <div className="audience-grid">
            {idealFor.map((item) => (
              <div className={`audience-card ${item.color}`} key={item.title}>
                <div className="audience-icon">{item.icon}</div>
                <h3>{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to transform your finances?</h2>
          <p>
            Join thousands of users who are already taking control of their
            money
          </p>
          <a href="/register">
            <button className="btn-white">
              Create Free Account <ArrowRight size={18} />
            </button>
          </a>
        </div>
      </section>

      {/* Developer Contact */}
      <section className="contact-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Contact</span>
            <h2>Meet the Developer</h2>
          </div>
          <div className="developer-card">
            <div className="developer-avatar">MD</div>
            <h3>Meezaan Davids</h3>
            <p className="developer-title">Full Stack Developer</p>
            <p className="developer-description">
              Passionate about creating simple, effective solutions for everyday
              problems with modern web technologies.
            </p>
            <div className="contact-links">
              <a
                href="mailto:meezaandavids365@gmail.com"
                className="contact-link"
              >
                <Mail size={20} /> Email
              </a>
              <a href="https://meezaand.github.io/" className="contact-link">
                <Globe size={20} /> Portfolio
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 CashFlow by Meezaan Davids</p>
          <p className="tech-stack">Built with React, TypeScript & Firebase</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
