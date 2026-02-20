import React, { useState, useEffect } from 'react';
import { ArrowRight, X, Check, CodeXml } from 'lucide-react';
import dashboard from '@/assets/images/previews/dashboard.png';

interface HeroProps {
	onAuthClick: (mode: 'login' | 'register') => void;
}

const steps = [
	{
		step: 1,
		title: 'The Problem',
		description: 'Manual tracking is slow and error-prone',
		icon: <X size={20} />,
		color: 'bg-red-500/10 text-red-400',
		iconColor: 'text-red-400',
	},
	{
		step: 2,
		title: 'The Solution',
		description: 'Real-time sync with insights',
		icon: <Check size={20} />,
		color: 'bg-green-500/10 text-green-400',
		iconColor: 'text-green-400',
	},
	{
		step: 3,
		title: 'The Tech',
		description: 'React, TypeScript & Firebase',
		icon: <CodeXml size={20} />,
		color: 'bg-blue-500/10 text-blue-400',
		iconColor: 'text-blue-400',
	},
];

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
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 lg:pt-32 pb-12 lg:pb-20 px-4 sm:px-6 lg:px-8">
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
				<div className="text-center mb-8">
					<span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-full text-sm font-medium text-gray-300 transition-all duration-300 hover:scale-105">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
						</span>
						Click Login for a free test account!
					</span>
				</div>

				<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-8 lg:mb-12">
					<div className="space-y-4 lg:space-y-6">
						<div className="space-y-3 lg:space-y-4">
							<h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
								<span className="block text-white">Take Control of</span>
								<span className="block text-blue-500">Your Finances</span>
							</h1>
							<p className="text-base lg:text-lg xl:text-xl text-gray-400 leading-relaxed max-w-xl">
								Track income, monitor expenses, and achieve your financial goals
								with CashFlow - the simple, fast, and secure budgeting app.
							</p>
						</div>

						<div className="flex flex-wrap gap-3 lg:gap-4">
							<button
								onClick={() => onAuthClick('register')}
								className="group px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-base font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
							>
								<span className="flex items-center gap-2">
									Get Started Free
									<ArrowRight
										size={18}
										className="group-hover:translate-x-1 transition-transform"
									/>
								</span>
							</button>

							<button
								onClick={() => onAuthClick('login')}
								className="px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-base font-semibold text-gray-300 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl hover:bg-gray-800/80 hover:text-white transition-all duration-300"
							>
								Login
							</button>
						</div>
					</div>

					<div className="relative flex justify-center">
						<img
							src={dashboard}
							alt="Dashboard Preview"
							className="w-full rounded-2xl"
						/>
					</div>
				</div>

				{/* Steps */}
				<div className="relative">
					<div className="grid md:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
						{steps.map((step, i) => (
							<div key={i} className="group relative">
								<div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl lg:rounded-2xl xl:rounded-3xl p-4 lg:p-6 xl:p-8 hover:bg-gray-900/70 transition-all duration-500 hover:scale-105">
									<div className="flex flex-col items-center text-center space-y-2 lg:space-y-3">
										<div
											className={`inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-xl lg:rounded-2xl ${step.color} group-hover:scale-110 transition-transform duration-300`}
										>
											<div className={step.iconColor}>{step.icon}</div>
										</div>
										<div>
											<h3 className="text-base lg:text-lg xl:text-xl font-bold text-white mb-1 lg:mb-2">
												{step.title}
											</h3>
											<p className="text-xs lg:text-sm xl:text-base text-gray-400">{step.description}</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
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