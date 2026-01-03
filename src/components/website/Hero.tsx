import React from 'react';
import { ArrowRight, X, Check, CodeXml } from 'lucide-react';
import dashboard from '@/assets/images/previews/dashboard.png';

const steps = [
	{
		step: 1,
		title: 'The Problem',
		description: 'Manual tracking is slow, messy, and error-prone.',
		icon: <X size={20} />,
		color: 'bg-red-100 text-red-600',
	},
	{
		step: 2,
		title: 'The Solution',
		description: 'Clean workflows with real-time sync and insights.',
		icon: <Check size={20} />,
		color: 'bg-green-100 text-green-600',
	},
	{
		step: 3,
		title: 'The Tech',
		description: 'Built with React, TypeScript, and Firebase.',
		icon: <CodeXml size={20} />,
		color: 'bg-blue-100 text-blue-700',
	},
];

interface HeroProps {
	onAuthClick: (mode: 'login' | 'register') => void;
}

const Hero: React.FC<HeroProps> = ({ onAuthClick }) => {
	return (
		<section className="relative px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center pt-28 lg:pt-0">
			<div className="max-w-7xl mx-auto w-full py-6 lg:py-10 relative">
				{/* Easter Egg Badge */}
				<span className="absolute -top-8 left-1/2 transform -translate-x-1/2 inline-block px-4 py-1.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200 select-none opacity-70 hover:opacity-100 transition-all shadow-sm">
					Tip: Click Login for a free test account!
				</span>

				{/* Hero Row */}
				<div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center mb-12">
					{/* Text */}
					<div className="space-y-5 lg:space-y-6">
						<div className="space-y-3 lg:space-y-4">
							<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
								Take Control of Your Personal Finances
							</h1>
							<p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
								Track income, monitor expenses, and achieve your financial goals
								with CashFlow - the simple, fast, and secure budgeting app.
							</p>
						</div>

						{/* Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 pt-1">
							<button
								onClick={() => onAuthClick('register')}
								className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all shadow-md"
							>
								Get Started
								<ArrowRight size={16} />
							</button>

							<button
								onClick={() => onAuthClick('login')}
								className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
							>
								Login
							</button>
						</div>
					</div>

					{/* Dashboard */}
					<div className="relative flex justify-center">
						<img
							src={dashboard}
							alt="Dashboard Preview"
							className="w-full max-w-md lg:max-w-lg object-contain max-h-[50vh]"
						/>
					</div>
				</div>

				{/* Stepper / Features Section */}
				<div className="mt-12">
					<div className="relative w-full px-4 lg:px-0">
						<div className="hidden md:block absolute top-6 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent" />

						<div className="grid md:grid-cols-3 gap-12">
							{steps.map((item) => (
								<div
									key={item.step}
									className="relative flex flex-col items-center text-center space-y-4"
								>
									<div
										className={`z-10 w-12 h-12 rounded-full flex items-center justify-center ${item.color}`}
									>
										{item.icon}
									</div>
									<div className="space-y-1">
										<h3 className="text-lg sm:text-xl font-semibold text-gray-900">
											{item.title}
										</h3>
										<p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-[220px] mx-auto">
											{item.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Scroll Hint */}
				<div className="text-center mt-8">
					<div className="animate-bounce inline-flex flex-col items-center text-gray-400">
						<span className="text-xs">Scroll for more</span>
						<svg
							className="w-3 h-3 mt-1"
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
