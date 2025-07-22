import React from "react";
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
} from "lucide-react";
import preview from "../assets/images/cashflow.png";
import "../styles/Home.css";

const features = [
  {
    icon: <Shield size={32} />,
    color: "blue",
    title: "Secure Login",
    desc: "Protected by Fortuna authentication with enterprise-grade security",
  },
  {
    icon: <Clock size={32} />,
    color: "yellow",
    title: "Real-time Tracking",
    desc: "Instantly log and update your income and expenses as they happen",
  },
  {
    icon: <Users size={32} />,
    color: "green",
    title: "Clean Interface",
    desc: "Intuitive UI designed for effortless financial management",
  },
  {
    icon: <Cloud size={32} />,
    color: "purple",
    title: "Cloud Sync",
    desc: "Your data syncs securely across all devices via Firebase",
  },
];

const idealFor = [
  {
    icon: <DollarSign size={32} />,
    color: "blue",
    title: "Budget-conscious individuals",
    desc: null,
  },
  {
    icon: <GraduationCap size={32} />,
    color: "yellow",
    title: "Students and freelancers",
    desc: null,
  },
  {
    icon: <User size={32} />,
    color: "green",
    title: "Anyone wanting a lightweight finance tracker",
    desc: null,
  },
];

const Home: React.FC = () => (
  <div className="home-container">
    {/* Hero Section */}
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1>
            Your Personal <span className="text-blue">Finance</span>
            <span className="text-blue">Companion</span>
          </h1>
          <p>
            Track income, monitor expenses, and stay in control. CashFlow is a
            simple, fast, and secure budgeting app built with privacy in mind.
          </p>
          <div className="hero-buttons">
            <a href="/register">
              <button className="btn-primary">Try CashFlow - It's Free!</button>
            </a>
            <a href="/login">
              <button className="btn-secondary">Login</button>
            </a>
          </div>
        </div>
        <div className="hero-preview">
          <img
            src={preview}
            alt="App Preview"
            className="hero-preview-image"
          />
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="features-section">
      <div className="features-content">
        <div className="features-header">
          <h2>Powerful features for better budgeting</h2>
          <p>Everything you need to take control of your finances</p>
        </div>

        <div className="features-grid">
          {/* Dashboard Preview */}
          <div className="dashboard-preview">
            <img
              src={preview}
              alt="CashFlow Dashboard Preview"
              className="dashboard-image"
            />
            <h3>CashFlow Dashboard</h3>
          </div>
          {/* Features List */}
          <div className="features-list">
            {features.map((f) => (
              <div className="feature-item" key={f.title}>
                <div className={`feature-icon ${f.color}`}>{f.icon}</div>
                <div className="feature-content">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Ideal For Section */}
    <section className="simple-section">
      <div className="simple-content">
        <div className="simple-header">
          <h2>Ideal For:</h2>
        </div>
        <div className="simple-grid ideal-for-grid">
          {idealFor.map((item) => (
            <div className="simple-item" key={item.title}>
              <div className={`simple-item-icon feature-icon ${item.color}`}>
                {item.icon}
              </div>
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="cta-section">
      <div className="cta-content">
        <h2>Start budgeting like a boss</h2>
        <p>
          Sign up today and take control of your personal finances with
          CashFlow
        </p>
        <a href="/register">
          <button className="btn-white">Create Account</button>
        </a>
      </div>
    </section>

    {/* Developer Contact */}
    <section className="contact-section">
      <div className="contact-content">
        <div className="contact-header">
          <h2>Contact the Developer</h2>
        </div>
        <div className="developer-card">
          <div className="developer-avatar">MD</div>
          <h3>Meezaan Davids</h3>
          <p className="developer-title">Full Stack Developer</p>
          <p className="developer-description">
            Passionate about creating simple, effective solutions for everyday
            problems. CashFlow is built with modern web technologies to
            enhance user experience.
          </p>
          <div className="contact-links">
            <div className="contact-link">
              <div className="contact-icon blue">
                <Mail size={24} />
              </div>
              <p>Email</p>
              <a
                href="mailto:meezaandavids365@gmail.com"
                className="btn-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Send Email
              </a>
            </div>
            <div className="contact-link">
              <div className="contact-icon purple">
                <Globe size={24} />
              </div>
              <p>Portfolio</p>
              <a
                href="https://meezaand.github.io/"
                className="btn-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="footer">
      <div className="footer-content">
        <p>© 2025 CashFlow by Meezaan Davids. Built with React, Firebase.</p>
      </div>
    </footer>
  </div>
);

export default Home;