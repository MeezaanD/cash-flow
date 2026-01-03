import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/images/logos/white-transparent-image.png';

interface NavbarProps {
	onAuthClick: (mode: 'login' | 'register') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
				scrolled ? 'py-4' : 'py-6'
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div
					className={`relative backdrop-blur-xl bg-gray-900/80 border border-gray-800 rounded-2xl transition-all duration-500`}
				>
					<div className="px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							{/* Logo */}
							<div className="flex-shrink-0">
								<a href="/" className="flex items-center">
									<img className="w-16" src={logo} alt="CashFlow Logo" />
								</a>
							</div>

							{/* Desktop Navigation */}
							<div className="hidden md:flex items-center space-x-1">
								<a
									href="#features"
									className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-xl hover:bg-gray-800/50"
								>
									Features
								</a>
								<a
									href="/dashboard"
									className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-xl hover:bg-gray-800/50"
								>
									Dashboard
								</a>
								<a
									href="#developer"
									className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-xl hover:bg-gray-800/50"
								>
									Developer
								</a>
							</div>

							{/* Desktop Auth Buttons */}
							<div className="hidden md:flex items-center space-x-3">
								<button
									onClick={() => onAuthClick('login')}
									className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-xl hover:bg-gray-800/50"
								>
									Login
								</button>
								<button
									onClick={() => onAuthClick('register')}
									className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
								>
									Get Started
								</button>
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
								<a
									href="#features"
									className="block px-4 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-gray-800/50 transition-all duration-200"
									onClick={() => setMobileMenuOpen(false)}
								>
									Features
								</a>
								<a
									href="/dashboard"
									className="block px-4 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-gray-800/50 transition-all duration-200"
									onClick={() => setMobileMenuOpen(false)}
								>
									Dashboard
								</a>
								<a
									href="#developer"
									className="block px-4 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-gray-800/50 transition-all duration-200"
									onClick={() => setMobileMenuOpen(false)}
								>
									Developer
								</a>
								<div className="pt-2 space-y-2">
									<button
										onClick={() => {
											onAuthClick('login');
											setMobileMenuOpen(false);
										}}
										className="w-full px-4 py-3 text-sm font-medium text-left text-gray-300 rounded-xl hover:bg-gray-800/50 transition-all duration-200"
									>
										Login
									</button>
									<button
										onClick={() => {
											onAuthClick('register');
											setMobileMenuOpen(false);
										}}
										className="w-full px-4 py-3 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-center"
									>
										Get Started
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
