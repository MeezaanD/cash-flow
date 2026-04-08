import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import dashboard from '@/assets/images/previews/dashboard.png';

interface HeroProps {
	onAuthClick: (mode: 'login' | 'register') => void;
}

const Hero: React.FC<HeroProps> = ({ onAuthClick }) => {
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({ x: e.clientX, y: e.clientY });
		};
		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, []);

	return (
		<section
			id="home"
			className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 lg:pt-32 pb-12 lg:pb-20 px-4 sm:px-6 lg:px-8"
		>
			{/* Animated gradient background */}
			<div className="absolute inset-0 bg-gray-950">
				<div className="absolute inset-0 opacity-20">
					<div
						className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
						style={{
							transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
							transition: 'transform 0.3s ease-out',
						}}
					></div>
					<div
						className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
						style={{
							transform: `translate(${-mousePos.x * 0.015}px, ${
								mousePos.y * 0.015
							}px)`,
							transition: 'transform 0.3s ease-out',
						}}
					></div>
					<div
						className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
						style={{
							transform: `translate(${mousePos.x * 0.01}px, ${-mousePos.y * 0.01}px)`,
							transition: 'transform 0.3s ease-out',
						}}
					></div>
				</div>
			</div>

			<div className="relative max-w-7xl mx-auto w-full">
				{/* Easter egg badge */}
				<motion.div
					className="text-center mb-8"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-full text-sm font-medium text-gray-300 transition-all duration-300 hover:scale-105">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
						</span>
						Click Login for a free test account!
					</span>
				</motion.div>

				<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-8 lg:mb-12">
					<motion.div
						className="space-y-4 lg:space-y-6"
						initial={{ opacity: 0, x: -40 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7, delay: 0.1 }}
					>
						<div className="space-y-3 lg:space-y-4">
							<h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
								<span className="block text-white">Take Control of</span>
								<span className="block text-blue-500">Your Finances</span>
							</h1>
							<p className="text-base lg:text-lg xl:text-xl text-gray-400 leading-relaxed max-w-xl">
								Track income, monitor expenses, and achieve your financial goals
								with CashFlow — the simple, fast, and secure budgeting app built
								with React, TypeScript &amp; Firebase.
							</p>
						</div>

						<div className="flex flex-wrap gap-3 lg:gap-4">
							<motion.button
								onClick={() => onAuthClick('register')}
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.97 }}
								className="group px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-base font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
							>
								<span className="flex items-center gap-2">
									Get Started For Free
									<ArrowRight
										size={18}
										className="group-hover:translate-x-1 transition-transform"
									/>
								</span>
							</motion.button>

							<motion.button
								onClick={() => onAuthClick('login')}
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.97 }}
								className="px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-base font-semibold text-gray-300 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl hover:bg-gray-800/80 hover:text-white transition-all duration-300"
							>
								Login
							</motion.button>
						</div>
					</motion.div>

					<motion.div
						className="relative flex justify-center"
						initial={{ opacity: 0, x: 40 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7, delay: 0.2 }}
					>
						<img
							src={dashboard}
							alt="Dashboard Preview"
							className="w-full rounded-2xl"
							loading="lazy"
						/>
					</motion.div>
				</div>

				{/* Scroll indicator */}
				<div className="text-center mt-8 lg:mt-12 xl:mt-16">
					<div className="inline-flex flex-col items-center text-gray-500 animate-bounce">
						<span className="text-xs lg:text-sm mb-2">Scroll to explore</span>
						<svg
							className="w-5 h-5 lg:w-6 lg:h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 14l-7 7m0 0l-7-7m7 7V3"
							/>
						</svg>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;