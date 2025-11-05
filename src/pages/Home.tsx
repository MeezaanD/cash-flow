import React, { useState, useEffect, useRef } from 'react';
import {
	Shield,
	Clock,
	Cloud,
	Mail,
	Globe,
	DollarSign,
	GraduationCap,
	User,
	ArrowRight,
	TrendingUp,
	PieChart,
	Calendar,
	Github,
	Linkedin,
	UserPlus,
	Plus,
	BarChart3,
	Target,
} from 'lucide-react';
import preview from '../assets/images/cashflow.png';
import logo from '../assets/images/dark-transparent-image.png';
import profilePhoto from '../assets/images/profile-photo.jpeg';
import AuthModals from '../components/AuthModals';
import '../styles/Home.css';

const features = [
	{
		icon: <Shield size={28} />,
		color: 'purple',
		title: 'Secure Login',
		desc: 'Protected by Fortuna authentication with enterprise-grade security',
	},
	{
		icon: <Clock size={28} />,
		color: 'teal',
		title: 'Real-time Tracking',
		desc: 'Instantly log and update your income and expenses as they happen',
	},
	{
		icon: <TrendingUp size={28} />,
		color: 'blue',
		title: 'Visual Analytics',
		desc: 'Beautiful charts to understand your spending patterns',
	},
	{
		icon: <Calendar size={28} />,
		color: 'indigo',
		title: 'Smart Date Filtering',
		desc: 'Filter transactions and charts by custom date ranges or preset periods',
	},
	{
		icon: <Cloud size={28} />,
		color: 'green',
		title: 'Cloud Sync',
		desc: 'Your data syncs securely across all devices via Firebase',
	},
	{
		icon: <PieChart size={28} />,
		color: 'red',
		title: 'Smart Budgeting',
		desc: "Set budgets and get alerts when you're approaching limits",
	},
];

const idealFor = [
	{
		icon: <DollarSign size={28} />,
		color: 'blue',
		title: 'Budget-conscious individuals',
	},
	{
		icon: <GraduationCap size={28} />,
		color: 'purple',
		title: 'Students and freelancers',
	},
	{
		icon: <User size={28} />,
		color: 'teal',
		title: 'Financial beginners',
	},
];

const howItWorks = [
	{
		icon: <UserPlus size={28} />,
		step: '1',
		title: 'Create Account',
		desc: 'Sign up with your email and set up your secure profile in seconds',
	},
	{
		icon: <Plus size={28} />,
		step: '2',
		title: 'Add Transactions',
		desc: 'Log your income and expenses with categories and descriptions',
	},
	{
		icon: <BarChart3 size={28} />,
		step: '3',
		title: 'Track Progress',
		desc: 'View real-time charts and insights about your spending patterns',
	},
	{
		icon: <Target size={28} />,
		step: '4',
		title: 'Achieve Goals',
		desc: 'Set budgets and financial targets to reach your money goals',
	},
];

const Home: React.FC = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
	const menuRef = useRef<HTMLDivElement>(null);

	// Prevent background scroll when menu is open
	useEffect(() => {
		if (mobileMenuOpen) {
			document.body.classList.add('menu-open');
		} else {
			document.body.classList.remove('menu-open');
		}
		return () => document.body.classList.remove('menu-open');
	}, [mobileMenuOpen]);

	// Close menu on ESC or click outside
	useEffect(() => {
		if (!mobileMenuOpen) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setMobileMenuOpen(false);
		};
		const handleClick = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setMobileMenuOpen(false);
			}
		};
		document.addEventListener('keydown', handleKey);
		document.addEventListener('mousedown', handleClick);
		return () => {
			document.removeEventListener('keydown', handleKey);
			document.removeEventListener('mousedown', handleClick);
		};
	}, [mobileMenuOpen]);

	const handleAuthClick = (mode: 'login' | 'register') => {
		setAuthMode(mode);
		setAuthModalOpen(true);
	};

	const handleAuthClose = () => {
		setAuthModalOpen(false);
	};

	const handleAuthModeChange = (newMode: 'login' | 'register') => {
		setAuthMode(newMode);
	};

	return (
		<div className="home-container theme-light">
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
						<button
							onClick={() => handleAuthClick('login')}
							className="navbar-link navbar-auth"
							style={{ background: 'none', border: 'none', cursor: 'pointer' }}
						>
							Login
						</button>
						<button
							onClick={() => handleAuthClick('register')}
							className="navbar-link navbar-auth navbar-register"
							style={{ background: 'none', border: 'none', cursor: 'pointer' }}
						>
							Register
						</button>
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
						<button
							onClick={() => {
								handleAuthClick('login');
								setMobileMenuOpen(false);
							}}
							className="navbar-link navbar-auth"
							style={{
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								width: '100%',
								textAlign: 'center',
							}}
						>
							Login
						</button>
						<button
							onClick={() => {
								handleAuthClick('register');
								setMobileMenuOpen(false);
							}}
							className="navbar-link navbar-auth navbar-register"
							style={{
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								width: '100%',
								textAlign: 'center',
							}}
						>
							Register
						</button>
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
								<button
									onClick={() => handleAuthClick('register')}
									className="btn-primary"
								>
									Get Started <ArrowRight size={18} />
								</button>
								<button
									onClick={() => handleAuthClick('login')}
									className="btn-secondary"
								>
									Login
								</button>
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

			{/* Data Import/Export Section */}
			<section className="date-filtering-section">
				<div className="container">
					<div className="section-header">
						<span className="section-subtitle">New Feature</span>
						<h2>Import and Export Transactions</h2>
						<p>
							Move your data in and out of CashFlow with CSV or JSON — with smart
							validation and duplicate protection.
						</p>
					</div>

					<div className="date-filtering-content">
						<div className="date-filtering-text">
							<h3>Simple Export</h3>
							<p>
								Download all your transactions as CSV or JSON directly from the
								Settings modal.
							</p>

							<h3>Safe Import</h3>
							<p>
								Import CSV/JSON files and we automatically validate required fields
								and skip duplicates.
							</p>

							<h3>Instant Feedback</h3>
							<p>
								Get success and error notifications after each import so you always
								know what happened.
							</p>
						</div>

						<div className="date-filtering-visual">
							<div className="filter-preview">
								<div className="filter-header">
									<PieChart size={24} />
									<span>Settings → Data</span>
								</div>
								<div className="filter-options">
									<div className="filter-option active">Import CSV/JSON</div>
									<div className="filter-option">Export CSV</div>
									<div className="filter-option">Export JSON</div>
								</div>
								<div className="filter-result">
									<span>Data tools available in</span>
									<strong> Settings → Data</strong>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Date Range Filtering Section */}
			<section className="date-filtering-section">
				<div className="container">
					<div className="section-header">
						<span className="section-subtitle">New Feature</span>
						<h2>Smart Date Range Filtering</h2>
						<p>Analyze your finances with precision using advanced date filtering</p>
					</div>

					<div className="date-filtering-content">
						<div className="date-filtering-text">
							<h3>Filter by Time Periods</h3>
							<p>
								Choose from preset ranges like last 7 days, 30 days, 3 months, or 6
								months for quick analysis.
							</p>

							<h3>Custom Date Ranges</h3>
							<p>
								Select specific start and end dates to analyze any time period that
								matters to you.
							</p>

							<h3>Cross-Component Sync</h3>
							<p>
								Your date range applies to both the transaction table and pie chart,
								ensuring consistent data across all views.
							</p>

							<div className="date-filtering-benefits">
								<div className="benefit-item">
									<Calendar size={20} />
									<span>Quick preset options</span>
								</div>
								<div className="benefit-item">
									<TrendingUp size={20} />
									<span>Trend analysis</span>
								</div>
								<div className="benefit-item">
									<PieChart size={20} />
									<span>Filtered charts</span>
								</div>
							</div>
						</div>

						<div className="date-filtering-visual">
							<div className="filter-preview">
								<div className="filter-header">
									<Calendar size={24} />
									<span>Date Range Filter</span>
								</div>
								<div className="filter-options">
									<div className="filter-option active">Last 7 days</div>
									<div className="filter-option">Last 30 days</div>
									<div className="filter-option">Custom range</div>
								</div>
								<div className="filter-result">
									<span>Showing transactions from</span>
									<strong>Dec 15 - Dec 22, 2024</strong>
								</div>
							</div>
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

			{/* How It Works Section */}
			<section className="how-it-works-section">
				<div className="container">
					<div className="section-header">
						<span className="section-subtitle">How it works</span>
						<h2>Get started in 4 simple steps</h2>
						<p>Your journey to financial freedom starts here</p>
					</div>

					<div className="how-it-works-grid">
						{howItWorks.map((step) => (
							<div className="how-it-works-card" key={step.step}>
								<div className="step-number">{step.step}</div>
								<div className="step-icon">{step.icon}</div>
								<h3>{step.title}</h3>
								<p>{step.desc}</p>
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

			{/* Developer Contact */}
			<section className="contact-section">
				<div className="container">
					<div className="section-header">
						<span className="section-subtitle">Meet the Creator</span>
						<h2>The Developer Behind CashFlow</h2>
					</div>
					<div className="developer-card">
						<div className="developer-content">
							<div className="developer-image">
								<div className="avatar-container">
									<img
										src={profilePhoto}
										alt="Meezaan Davids"
										className="developer-avatar"
									/>
									<div className="avatar-glow"></div>
								</div>
							</div>

							<div className="developer-details">
								<div className="developer-info">
									<h3 className="developer-name">Meezaan Davids</h3>
									<p className="developer-title">Full Stack Developer</p>
									<div className="developer-tags">
										<span className="tag">React</span>
										<span className="tag">TypeScript</span>
										<span className="tag">Firebase</span>
										<span className="tag">UI/UX</span>
									</div>
								</div>

								<div className="developer-description">
									<p>
										Passionate about creating simple, effective solutions for
										everyday problems with modern web technologies. I believe in
										building applications that not only work flawlessly but also
										provide an exceptional user experience.
									</p>
								</div>

								<div className="contact-links">
									<a
										href="mailto:meezaandavids365@gmail.com"
										className="contact-link email-link"
									>
										<Mail size={20} />
										<span>Email</span>
									</a>
									<a
										href="https://meezaand.github.io/"
										className="contact-link portfolio-link"
									>
										<Globe size={20} />
										<span>Portfolio</span>
									</a>
									<a
										href="https://github.com/MeezaanD"
										className="contact-link github-link"
									>
										<Github size={20} />
										<span>GitHub</span>
									</a>
									<a
										href="https://www.linkedin.com/in/meezaan-davids-4a7aa8265/"
										className="contact-link linkedin-link"
									>
										<Linkedin size={20} />
										<span>LinkedIn</span>
									</a>
								</div>

								<div className="developer-stats">
									<div className="stat-item">
										<span className="stat-number">100%</span>
										<span className="stat-label">Passion</span>
									</div>
									<div className="stat-item">
										<span className="stat-number">24/7</span>
										<span className="stat-label">Learning</span>
									</div>
									<div className="stat-item">
										<span className="stat-number">∞</span>
										<span className="stat-label">Creativity</span>
									</div>
								</div>
							</div>
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

			{/* Auth Modals */}
			<AuthModals
				open={authModalOpen}
				onClose={handleAuthClose}
				mode={authMode}
				onModeChange={handleAuthModeChange}
			/>
		</div>
	);
};

export default Home;
