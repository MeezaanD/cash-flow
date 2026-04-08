import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import logo from '@/assets/images/logos/cflow-transparent-light.png';

interface NavbarProps {
	onAuthClick: (mode: 'login' | 'register') => void;
}

const navLinks = [
	{ label: 'Home', href: '#home' },
	{ label: 'Features', href: '#features' },
	{ label: 'Demo', href: '#demo' },
	{ label: 'FAQ', href: '#faq' },
	{ label: 'Contact', href: '#developer' },
];

const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const authDropdownRef = useRef<HTMLDivElement>(null);

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
		if (!mobileMenuOpen && !authDropdownOpen) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setMobileMenuOpen(false);
				setAuthDropdownOpen(false);
			}
		};
		const handleClick = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setMobileMenuOpen(false);
			}
			if (authDropdownRef.current && !authDropdownRef.current.contains(e.target as Node)) {
				setAuthDropdownOpen(false);
			}
		};
		document.addEventListener('keydown', handleKey);
		document.addEventListener('mousedown', handleClick);
		return () => {
			document.removeEventListener('keydown', handleKey);
			document.removeEventListener('mousedown', handleClick);
		};
	}, [mobileMenuOpen, authDropdownOpen]);

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
				scrolled ? 'py-4' : 'py-6'
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative backdrop-blur-xl bg-gray-900/80 border border-gray-800 rounded-2xl transition-all duration-500">
					<div className="px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							{/* Logo */}
							<div className="flex-shrink-0">
								<a href="#home" className="flex items-center">
									<img className="w-24" src={logo} alt="CashFlow Logo" />
								</a>
							</div>

							{/* Desktop Navigation */}
							<div className="hidden md:flex items-center space-x-1">
								{navLinks.map((link) => (
									<a
										key={link.label}
										href={link.href}
										className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-xl hover:bg-gray-800/50"
									>
										{link.label}
									</a>
								))}
							</div>

							{/* Desktop Auth Dropdown */}
							<div className="hidden md:flex items-center" ref={authDropdownRef}>
								<div className="relative">
									<button
										onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
										aria-expanded={authDropdownOpen}
										aria-haspopup="true"
										className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
									>
										Get Started
										<ChevronDown
											size={16}
											className={`transition-transform duration-200 ${authDropdownOpen ? 'rotate-180' : ''}`}
										/>
									</button>

									{authDropdownOpen && (
										<div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
											<button
												onClick={() => {
													onAuthClick('login');
													setAuthDropdownOpen(false);
												}}
												className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
											>
												<LogIn size={16} className="text-blue-400" />
												Login
											</button>
											<button
												onClick={() => {
													onAuthClick('register');
													setAuthDropdownOpen(false);
												}}
												className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
											>
												<UserPlus size={16} className="text-blue-400" />
												Register
											</button>
										</div>
									)}
								</div>
							</div>

							{/* Mobile Menu Button */}
							<button
								className="md:hidden p-2.5 rounded-xl hover:bg-gray-800/50 transition-all duration-200"
								aria-label="Toggle navigation menu"
								aria-expanded={mobileMenuOpen}
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							>
								{mobileMenuOpen ? (
									<X className="h-5 w-5 text-gray-300" />
								) : (
									<Menu className="h-5 w-5 text-gray-300" />
								)}
							</button>
						</div>
					</div>

					{/* Mobile Menu */}
					{mobileMenuOpen && (
						<div
							ref={menuRef}
							className="md:hidden border-t border-gray-800 backdrop-blur-xl"
						>
							<div className="px-6 py-4 space-y-2">
								{navLinks.map((link) => (
									<a
										key={link.label}
										href={link.href}
										className="block px-4 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-gray-800/50 transition-all duration-200"
										onClick={() => setMobileMenuOpen(false)}
									>
										{link.label}
									</a>
								))}
								<div className="pt-2 space-y-2">
									<button
										onClick={() => {
											onAuthClick('login');
											setMobileMenuOpen(false);
										}}
										className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-left text-gray-300 rounded-xl hover:bg-gray-800/50 transition-all duration-200"
									>
										<LogIn size={16} className="text-blue-400" />
										Login
									</button>
									<button
										onClick={() => {
											onAuthClick('register');
											setMobileMenuOpen(false);
										}}
										className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
									>
										<UserPlus size={16} />
										Register
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
