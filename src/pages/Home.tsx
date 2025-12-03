import React, { useState, useEffect, useRef } from 'react';
import {
	Shield,
	Clock,
	Cloud,
	DollarSign,
	GraduationCap,
	User,
	ArrowRight,
	TrendingUp,
	PieChart,
	Calendar,
	UserPlus,
	Plus,
	BarChart3,
	Target,
	Menu,
	X,
} from 'lucide-react';
// import preview from '../assets/images/cashflow.png';
import logoDark from '../assets/images/dark-transparent-image.png';
import logoLight from '../assets/images/white-transparent-image.png';
import { useTheme } from '../context/ThemeContext';
// import profilePhoto from '../assets/images/profile-photo.jpeg';
import AuthModals from '../components/AuthModals';

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

const colorMap: Record<string, string> = {
	purple: 'from-purple-500 to-pink-500',
	teal: 'from-teal-500 to-cyan-500',
	blue: 'from-blue-500 to-indigo-500',
	indigo: 'from-indigo-500 to-purple-500',
	green: 'from-green-500 to-emerald-500',
	red: 'from-red-500 to-orange-500',
};

const Home: React.FC = () => {
	const { theme } = useTheme();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
	const [scrolled, setScrolled] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		if (mobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [mobileMenuOpen]);

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

	const logo = theme === 'dark' ? logoLight : logoDark;

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
		<div className="min-h-screen bg-background">
			{/* Sticky Navbar */}
			<nav
				className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
					scrolled
						? 'bg-background/95 backdrop-blur-xl border border-white/20 shadow-2xl'
						: 'bg-background/80 backdrop-blur-lg border border-white/10'
				} rounded-2xl mx-auto max-w-7xl`}
			>
				<div className="px-6 sm:px-8 lg:px-10">
					<div className="flex items-center justify-between h-16">
						{/* Logo */}
						<div className="flex-shrink-0">
							<a href="/" className="flex items-center">
								<img src={logo} alt="CashFlow Logo" className="h-11 w-auto" />
							</a>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-1">
							<a
								href="/"
								className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-all duration-200 rounded-xl hover:bg-primary/5"
							>
								Home
							</a>
							<a
								href="/dashboard"
								className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-xl hover:bg-primary/5"
							>
								Dashboard
							</a>
							<a
								href="#features"
								className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-xl hover:bg-primary/5"
							>
								Features
							</a>
						</div>

						{/* Desktop Auth Buttons */}
						<div className="hidden md:flex items-center space-x-2">
							<button
								onClick={() => handleAuthClick('login')}
								className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-xl hover:bg-muted/50 border border-transparent hover:border-muted-foreground/20"
							>
								Login
							</button>
							<button
								onClick={() => handleAuthClick('register')}
								className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
							>
								Register
							</button>
						</div>

						{/* Mobile Menu Button */}
						<button
							className="md:hidden p-2.5 rounded-xl hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-muted-foreground/20"
							aria-label="Toggle navigation menu"
							aria-expanded={mobileMenuOpen}
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div
						ref={menuRef}
						className="md:hidden border-t bg-background/98 backdrop-blur-xl"
					>
						<div className="px-6 py-4 space-y-1">
							<a
								href="/"
								className="block px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-muted-foreground/10"
								onClick={() => setMobileMenuOpen(false)}
							>
								Home
							</a>
							<a
								href="/dashboard"
								className="block px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-muted-foreground/10"
								onClick={() => setMobileMenuOpen(false)}
							>
								Dashboard
							</a>
							<a
								href="#features"
								className="block px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-muted-foreground/10"
								onClick={() => setMobileMenuOpen(false)}
							>
								Features
							</a>
							<div className="pt-2 space-y-1">
								<button
									onClick={() => {
										handleAuthClick('login');
										setMobileMenuOpen(false);
									}}
									className="w-full px-4 py-3 text-sm font-medium text-left rounded-xl hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-muted-foreground/10"
								>
									Login
								</button>
								<button
									onClick={() => {
										handleAuthClick('register');
										setMobileMenuOpen(false);
									}}
									className="w-full px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
								>
									Register
								</button>
							</div>
						</div>
					</div>
				)}
			</nav>

			{/* Hero Section */}
			<section className="relative flex flex-col justify-center items-center min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="space-y-12">
						<div className="max-w-5xl mx-auto text-center space-y-8">
							<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
								Take Control of Your <br />
								<span className="text-primary">Personal Finances</span>
							</h1>
							<p className="text-xl lg:text-3xl text-muted-foreground leading-relaxed">
								Track income, monitor expenses, and achieve your financial goals
								with CashFlow - the simple, fast, and secure budgeting app.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<button
									onClick={() => handleAuthClick('register')}
									className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
								>
									Get Started
									<ArrowRight size={18} />
								</button>
								<button
									onClick={() => handleAuthClick('login')}
									className="px-6 py-3 text-base font-medium bg-muted hover:bg-muted/80 rounded-lg transition-colors"
								>
									Login
								</button>
							</div>
						</div>
						{/* <div className="relative max-w-5xl mx-auto">
							<div className="relative rounded-2xl overflow-hidden border shadow-2xl">
								<img
									src={preview}
									alt="CashFlow App Dashboard"
									className="w-full h-auto"
								/>
							</div>
						</div> */}
					</div>
				</div>
			</section>

			{/* Data Import/Export Section */}
			{/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
				<div className="max-w-7xl mx-auto">
					<div className="text-center space-y-4 mb-12">
						<span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
							New Feature
						</span>
						<h2 className="text-3xl md:text-4xl font-bold">
							Import and Export Transactions
						</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
							Move your data in and out of CashFlow with CSV or JSON — with smart
							validation and duplicate protection.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div className="space-y-8">
							<div>
								<h3 className="text-xl font-semibold mb-2">Simple Export</h3>
								<p className="text-muted-foreground">
									Download all your transactions as CSV or JSON directly from the
									Settings modal.
								</p>
							</div>

							<div>
								<h3 className="text-xl font-semibold mb-2">Safe Import</h3>
								<p className="text-muted-foreground">
									Import CSV/JSON files and we automatically validate required
									fields and skip duplicates.
								</p>
							</div>

							<div>
								<h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
								<p className="text-muted-foreground">
									Get success and error notifications after each import so you
									always know what happened.
								</p>
							</div>
						</div>

						<div className="rounded-xl border bg-card shadow-lg p-6">
							<div className="flex items-center gap-3 mb-6 pb-4 border-b">
								<div className="p-2 rounded-lg bg-primary/10">
									<PieChart size={24} className="text-primary" />
								</div>
								<span className="font-medium">Settings → Data</span>
							</div>
							<div className="space-y-3">
								<div className="px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium border border-primary/20">
									Import CSV/JSON
								</div>
								<div className="px-4 py-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
									Export CSV
								</div>
								<div className="px-4 py-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
									Export JSON
								</div>
							</div>
							<div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
								<span>Data tools available in</span>
								<strong className="text-foreground"> Settings → Data</strong>
							</div>
						</div>
					</div>
				</div>
			</section> */}

			{/* Date Range Filtering Section */}
			{/* <section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center space-y-4 mb-12">
						<span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
							New Feature
						</span>
						<h2 className="text-3xl md:text-4xl font-bold">
							Smart Date Range Filtering
						</h2>
						<p className="text-lg text-muted-foreground">
							Analyze your finances with precision using advanced date filtering
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div className="space-y-8">
							<div>
								<h3 className="text-xl font-semibold mb-2">
									Filter by Time Periods
								</h3>
								<p className="text-muted-foreground">
									Choose from preset ranges like last 7 days, 30 days, 3 months,
									or 6 months for quick analysis.
								</p>
							</div>

							<div>
								<h3 className="text-xl font-semibold mb-2">Custom Date Ranges</h3>
								<p className="text-muted-foreground">
									Select specific start and end dates to analyze any time period
									that matters to you.
								</p>
							</div>

							<div>
								<h3 className="text-xl font-semibold mb-2">Cross-Component Sync</h3>
								<p className="text-muted-foreground">
									Your date range applies to both the transaction table and pie
									chart, ensuring consistent data across all views.
								</p>
							</div>

							<div className="flex flex-wrap gap-4">
								<div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
									<Calendar size={20} className="text-primary" />
									<span className="text-sm font-medium">
										Quick preset options
									</span>
								</div>
								<div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
									<TrendingUp size={20} className="text-primary" />
									<span className="text-sm font-medium">Trend analysis</span>
								</div>
								<div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
									<PieChart size={20} className="text-primary" />
									<span className="text-sm font-medium">Filtered charts</span>
								</div>
							</div>
						</div>

						<div className="rounded-xl border bg-card shadow-lg p-6">
							<div className="flex items-center gap-3 mb-6 pb-4 border-b">
								<div className="p-2 rounded-lg bg-primary/10">
									<Calendar size={24} className="text-primary" />
								</div>
								<span className="font-medium">Date Range Filter</span>
							</div>
							<div className="space-y-3">
								<div className="px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium border border-primary/20">
									Last 7 days
								</div>
								<div className="px-4 py-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
									Last 30 days
								</div>
								<div className="px-4 py-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
									Custom range
								</div>
							</div>
							<div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
								<span>Showing transactions from</span>
								<strong className="text-foreground"> Dec 15 - Dec 22, 2024</strong>
							</div>
						</div>
					</div>
				</div>
			</section> */}

			{/* Features Section */}
			<section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
				<div className="max-w-7xl mx-auto">
					<div className="text-center space-y-4 mb-12">
						<span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
							Features
						</span>
						<h2 className="text-3xl md:text-4xl font-bold">Powerful Financial Tools</h2>
						<p className="text-lg text-muted-foreground">
							Everything you need to take control of your money
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{features.map((feature) => (
							<div
								key={feature.title}
								className="group rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
							>
								<div
									className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${colorMap[feature.color]} mb-4`}
								>
									<div className="text-white">{feature.icon}</div>
								</div>
								<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
								<p className="text-muted-foreground">{feature.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center space-y-4 mb-12">
						<span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
							How It Works
						</span>
						<h2 className="text-3xl md:text-4xl font-bold">
							Get Started in 4 Simple Steps
						</h2>
						<p className="text-lg text-muted-foreground">
							Your journey to financial freedom starts here
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{howItWorks.map((step) => (
							<div
								key={step.step}
								className="relative rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300"
							>
								<div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
									{step.step}
								</div>
								<div className="pt-4">
									<div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
										<div className="text-primary">{step.icon}</div>
									</div>
									<h3 className="text-xl font-semibold mb-2">{step.title}</h3>
									<p className="text-muted-foreground">{step.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Ideal For Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
				<div className="max-w-7xl mx-auto">
					<div className="text-center space-y-4 mb-12">
						<span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
							Who's It For
						</span>
						<h2 className="text-3xl md:text-4xl font-bold">
							Perfect for Your Financial Journey
						</h2>
					</div>

					<div className="grid md:grid-cols-3 gap-6">
						{idealFor.map((item) => (
							<div
								key={item.title}
								className="rounded-xl border bg-card p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-center hover:scale-105"
							>
								<div
									className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${colorMap[item.color]} mb-6`}
								>
									<div className="text-white">{item.icon}</div>
								</div>
								<h3 className="text-xl font-semibold">{item.title}</h3>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Developer Contact */}
			{/* <section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-5xl mx-auto">
					<div className="text-center space-y-4 mb-12">
						<span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
							Meet the Creator
						</span>
						<h2 className="text-3xl md:text-4xl font-bold">
							The Developer Behind CashFlow
						</h2>
					</div>

					<div className="rounded-2xl border bg-card shadow-xl overflow-hidden">
						<div className="p-8 md:p-12">
							<div className="grid md:grid-cols-3 gap-8 items-start">
								<div className="flex justify-center md:justify-start">
									<div className="relative">
										<div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full blur-xl opacity-50"></div>
										<img
											src={profilePhoto}
											alt="Meezaan Davids"
											className="relative h-40 w-40 rounded-full object-cover border-4 border-background shadow-xl"
										/>
									</div>
								</div>

								<div className="md:col-span-2 space-y-6">
									<div>
										<h3 className="text-2xl md:text-3xl font-bold mb-2">
											Meezaan Davids
										</h3>
										<p className="text-lg text-muted-foreground mb-4">
											Full Stack Developer
										</p>
										<div className="flex flex-wrap gap-2">
											<span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
												React
											</span>
											<span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
												TypeScript
											</span>
											<span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
												Firebase
											</span>
											<span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
												UI/UX
											</span>
										</div>
									</div>

									<p className="text-muted-foreground leading-relaxed">
										Passionate about creating simple, effective solutions for
										everyday problems with modern web technologies. I believe in
										building applications that not only work flawlessly but also
										provide an exceptional user experience.
									</p>

									<div className="flex flex-wrap gap-3">
										<a
											href="mailto:meezaandavids365@gmail.com"
											className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-muted transition-colors"
										>
											<Mail size={20} />
											<span className="text-sm font-medium">Email</span>
										</a>
										<a
											href="https://meezaand.github.io/"
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-muted transition-colors"
										>
											<Globe size={20} />
											<span className="text-sm font-medium">Portfolio</span>
										</a>
										<a
											href="https://github.com/MeezaanD"
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-muted transition-colors"
										>
											<Github size={20} />
											<span className="text-sm font-medium">GitHub</span>
										</a>
										<a
											href="https://www.linkedin.com/in/meezaan-davids-4a7aa8265/"
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-muted transition-colors"
										>
											<Linkedin size={20} />
											<span className="text-sm font-medium">LinkedIn</span>
										</a>
									</div>

									<div className="grid grid-cols-3 gap-4 pt-4">
										<div className="text-center p-4 rounded-lg bg-muted">
											<div className="text-xl font-bold mb-1">100%</div>
											<div className="text-sm text-muted-foreground">
												Passion
											</div>
										</div>
										<div className="text-center p-4 rounded-lg bg-muted">
											<div className="text-xl font-bold mb-1">24/7</div>
											<div className="text-sm text-muted-foreground">
												Learning
											</div>
										</div>
										<div className="text-center p-4 rounded-lg bg-muted">
											<div className="text-xl font-bold mb-1">∞</div>
											<div className="text-sm text-muted-foreground">
												Creativity
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section> */}

			{/* Footer */}
			<footer className="py-12 px-4 sm:px-6 lg:px-8 border-t bg-muted/30">
				<div className="max-w-7xl mx-auto text-center space-y-2">
					<p className="text-sm text-muted-foreground">
						© 2025 CashFlow by Meezaan Davids
					</p>
					<p className="text-sm text-muted-foreground">
						Built with React, TypeScript & Firebase
					</p>
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
