import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/images/logos/dark-transparent-image.png'

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
			className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
				scrolled
					? 'bg-white/95 backdrop-blur-xl shadow-lg'
					: 'bg-white/80 backdrop-blur-lg shadow-md'
			} rounded-2xl mx-auto max-w-7xl border border-gray-200`}
		>
			<div className="px-6 sm:px-8 lg:px-10">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<div className="flex-shrink-0">
						<a href="/" className="flex items-center">
							<img className='w-16' src={logo} alt="CashFlow Logo" />
						</a>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-1">
						<a
							href="#features"
							className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-900 transition-all duration-200 rounded-xl hover:bg-blue-50"
						>
							Features
						</a>
						<a
							href="/dashboard"
							className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-900 transition-all duration-200 rounded-xl hover:bg-blue-50"
						>
							Dashboard
						</a>
						<a
							href="#developer"
							className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-900 transition-all duration-200 rounded-xl hover:bg-blue-50"
						>
							Developer
						</a>
					</div>

					{/* Desktop Auth Buttons */}
					<div className="hidden md:flex items-center space-x-2">
						<button
							onClick={() => onAuthClick('login')}
							className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-xl hover:bg-gray-100 border border-transparent hover:border-gray-300"
						>
							Login
						</button>
						<button
							onClick={() => onAuthClick('register')}
							className="px-5 py-2.5 text-sm font-medium bg-blue-900 text-white rounded-xl hover:bg-blue-900 transition-colors shadow-md hover:shadow-lg"
						>
							Register
						</button>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200"
						aria-label="Toggle navigation menu"
						aria-expanded={mobileMenuOpen}
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X className="h-5 w-5 text-gray-900" />
						) : (
							<Menu className="h-5 w-5 text-gray-900" />
						)}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div
					ref={menuRef}
					className="md:hidden border-t border-gray-200 bg-white/98 backdrop-blur-xl"
				>
					<div className="px-6 py-4 space-y-1">
						<a
							href="#features"
							className="block px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200"
							onClick={() => setMobileMenuOpen(false)}
						>
							Features
						</a>
						<a
							href="/dashboard"
							className="block px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200"
							onClick={() => setMobileMenuOpen(false)}
						>
							Dashboard
						</a>
						<a
							href="#developer"
							className="block px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200"
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
								className="w-full px-4 py-3 text-sm font-medium text-left text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200"
							>
								Login
							</button>
							<button
								onClick={() => {
									onAuthClick('register');
									setMobileMenuOpen(false);
								}}
								className="w-full px-4 py-3 text-sm font-medium bg-blue-900 text-white rounded-xl hover:bg-blue-900 transition-colors text-center"
							>
								Register
							</button>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
