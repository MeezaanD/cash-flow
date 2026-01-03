import React from 'react';
import { FiClock, FiRefreshCw, FiPieChart, FiCalendar, FiFileText, FiCloud } from 'react-icons/fi';
import { SiReact, SiTypescript, SiTailwindcss, SiFirebase } from 'react-icons/si';

import expenses from '@/assets/images/previews/recurring-expenses.png';
import reports from '@/assets/images/previews/reports.png';
import auto from '@/assets/images/previews/auto-fill.png';

const Features: React.FC = () => {
	const features = [
		{
			icon: <FiClock size={28} />,
			title: 'Real-time Tracking',
			desc: 'Log income and expenses instantly with automatic cloud sync',
		},
		{
			icon: <FiRefreshCw size={28} />,
			title: 'Recurring Expenses',
			desc: 'Set up automatic tracking for monthly bills and subscriptions',
		},
		{
			icon: <FiPieChart size={28} />,
			title: 'Visual Analytics',
			desc: 'Beautiful charts and insights to understand spending patterns',
		},
		{
			icon: <FiCalendar size={28} />,
			title: 'Date Filtering',
			desc: 'Analyze transactions across custom time periods',
		},
		{
			icon: <FiFileText size={28} />,
			title: 'Import / Export',
			desc: 'Move data in and out easily with CSV and JSON support',
		},
		{
			icon: <FiCloud size={28} />,
			title: 'Cloud Sync',
			desc: 'Access your data securely from any device',
		},
	];

	const demoSections = [
		{
			title: 'Recurring Expenses',
			desc: 'Set up monthly bills once and track them automatically',
			image: expenses,
		},
		{
			title: 'Quick Fill',
			desc: 'Log transactions in seconds with smart suggestions',
			image: auto,
		},
		{
			title: 'Visual Analytics',
			desc: 'Beautiful charts to understand your spending patterns',
			image: reports,
		},
	];

	const techStack = [
		{
			name: 'React',
			desc: 'Component-based UI',
			icon: <SiReact size={32} />,
		},
		{
			name: 'TypeScript',
			desc: 'Type-safe code',
			icon: <SiTypescript size={32} />,
		},
		{
			name: 'Tailwind CSS',
			desc: 'Modern styling',
			icon: <SiTailwindcss size={32} />,
		},
		{
			name: 'Firebase',
			desc: 'Real-time database',
			icon: <SiFirebase size={32} />,
		},
	];

	return (
		<>
			{/* Key Features */}
			<section
				id="features"
				className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-950"
			>
				<div className="relative max-w-7xl mx-auto">
					<div className="text-center mb-20">
						<span className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm font-medium mb-4">
							Features
						</span>
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
							Everything You Need
						</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Powerful tools designed to make personal finance management simple
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, i) => (
							<div
								key={i}
								className="group relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:bg-gray-900/70 transition-all duration-500 hover:-translate-y-2"
							>
								<div className="flex flex-col items-center text-center space-y-4">
									<div className="inline-flex p-4 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-300">
										{feature.icon}
									</div>
									<div>
										<h3 className="text-xl font-bold text-white mb-3">
											{feature.title}
										</h3>
										<p className="text-gray-400 leading-relaxed">
											{feature.desc}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Demo Sections */}
			<section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gray-950">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-24">
						<span className="inline-block px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-sm font-medium mb-4">
							See It in Action
						</span>
						<h2 className="text-4xl md:text-6xl font-bold text-white">
							Experience It Yourself
						</h2>
					</div>

					<div className="space-y-32">
						{demoSections.map((item, i) => (
							<div
								key={i}
								className={`grid lg:grid-cols-2 gap-16 items-center ${
									i % 2 === 1 ? 'lg:flex-row-reverse' : ''
								}`}
							>
								<div className={`${i % 2 === 1 ? 'lg:order-2' : ''}`}>
									<h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
										{item.title}
									</h3>
									<p className="text-xl text-gray-400">{item.desc}</p>
								</div>
								<div
									className={`relative group ${i % 2 === 1 ? 'lg:order-1' : ''}`}
								>
									<div className="relative">
										<img
											src={item.image}
											alt={item.title}
											className="w-full rounded-2xl"
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Tech Stack */}
			<section
				id="tech"
				className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-950"
			>
				<div className="relative max-w-5xl mx-auto">
					<div className="text-center mb-20">
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
							Built With Modern Tech
						</h2>
					</div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{techStack.map((tech, i) => (
							<div
								key={i}
								className="group relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:bg-gray-900/70 transition-all duration-500 hover:-translate-y-2"
							>
								<div className="flex flex-col items-center text-center space-y-4">
									<div className="text-blue-400 group-hover:scale-110 transition-transform duration-300">
										{tech.icon}
									</div>
									<div>
										<h3 className="text-xl font-bold text-white mb-2">
											{tech.name}
										</h3>
										<p className="text-gray-400">{tech.desc}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default Features;
