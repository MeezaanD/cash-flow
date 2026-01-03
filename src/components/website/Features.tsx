import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FiClock, FiRefreshCw, FiPieChart, FiCalendar, FiFileText, FiCloud } from 'react-icons/fi';
import { SiReact, SiTypescript, SiTailwindcss, SiFirebase } from 'react-icons/si';

import expenses from '@/assets/images/previews/recurring-expenses.png';
import reports from '@/assets/images/previews/reports.png';
import auto from '@/assets/images/previews/auto-fill.png';

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
	},
};

const Features: React.FC = () => {
	const features = [
		{
			icon: <FiClock size={32} />,
			title: 'Real-time Tracking',
			desc: 'Log income and expenses instantly with automatic cloud sync',
		},
		{
			icon: <FiRefreshCw size={32} />,
			title: 'Recurring Expenses',
			desc: 'Set up automatic tracking for monthly bills and subscriptions',
		},
		{
			icon: <FiPieChart size={32} />,
			title: 'Visual Analytics',
			desc: 'Beautiful charts and insights to understand spending patterns',
		},
		{
			icon: <FiCalendar size={32} />,
			title: 'Date Filtering',
			desc: 'Analyze transactions across custom time periods',
		},
		{
			icon: <FiFileText size={32} />,
			title: 'Import / Export',
			desc: 'Move data in and out easily with CSV and JSON support',
		},
		{
			icon: <FiCloud size={32} />,
			title: 'Cloud Sync',
			desc: 'Access your data securely from any device',
		},
	];

	const demoSections = [
		{
			title: 'Recurring Expenses',
			desc: 'Set up monthly bills once and track them automatically',
			image: expenses,
			reverse: false,
		},
		{
			title: 'Quick Fill',
			desc: 'Log transactions in seconds with smart suggestions',
			image: auto,
			reverse: true,
		},
		{
			title: 'Visual Analytics',
			desc: 'Beautiful charts to understand your spending patterns',
			image: reports,
			reverse: false,
		},
	];

	const techStack = [
		{
			name: 'React',
			desc: 'Component-based UI',
			icon: <SiReact size={28} className="text-blue-700" />,
		},
		{
			name: 'TypeScript',
			desc: 'Type-safe code',
			icon: <SiTypescript size={28} className="text-blue-700" />,
		},
		{
			name: 'Tailwind CSS',
			desc: 'Modern styling',
			icon: <SiTailwindcss size={28} className="text-blue-700" />,
		},
		{
			name: 'Firebase',
			desc: 'Real-time database',
			icon: <SiFirebase size={28} className="text-blue-700" />,
		},
	];

	return (
		<>
			{/* Key Features */}
			<section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
				<div className="max-w-7xl mx-auto">
					<div className="text-center space-y-4 mb-16">
						<span className="inline-block px-4 py-1.5 text-sm font-medium bg-blue-100 text-blue-700 rounded-full border border-blue-200">
							Features
						</span>
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
							Everything You Need
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Powerful tools designed to make personal finance management simple
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, i) => (
							<motion.div
								key={i}
								variants={fadeUp}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								className="text-center space-y-4 p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-transform hover:-translate-y-2"
							>
								<div className="inline-flex p-4 rounded-2xl bg-blue-50 text-blue-600">
									{feature.icon}
								</div>
								<h3 className="text-xl font-semibold text-gray-900">
									{feature.title}
								</h3>
								<p className="text-gray-600">{feature.desc}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Demo Sections */}
			<section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
				<div className="max-w-7xl mx-auto">
					<div className="text-center space-y-4 mb-20">
						<span className="inline-block px-4 py-1.5 text-sm font-medium bg-purple-100 text-purple-700 rounded-full border border-purple-200">
							See It in Action
						</span>
						<h2 className="text-3xl md:text-5xl font-bold text-gray-900">
							Experience It Yourself
						</h2>
					</div>

					<div className="space-y-24">
						{demoSections.map((item, index) => {
							const isImageFirst = index % 2 === 1;
							return (
								<div
									key={index}
									className="grid lg:grid-cols-2 gap-12 items-center"
								>
									{/* Text */}
									<motion.div
										variants={fadeUp}
										initial="hidden"
										whileInView="visible"
										viewport={{ once: true }}
										className={`${
											isImageFirst ? 'lg:order-2' : ''
										} text-center lg:text-left mx-auto lg:mx-0`}
									>
										<h3 className="text-2xl md:text-3xl font-bold text-gray-900">
											{item.title}
										</h3>
										<p className="mt-3 text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
											{item.desc}
										</p>
									</motion.div>

									{/* Image */}
									<motion.div
										variants={fadeUp}
										initial="hidden"
										whileInView="visible"
										viewport={{ once: true }}
										className={`${isImageFirst ? 'lg:order-1' : ''} mx-auto`}
									>
										<img
											src={item.image}
											alt={item.title}
											className="rounded-2xl"
										/>
									</motion.div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Tech Stack */}
			<section
				id="tech"
				className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
			>
				<div className="max-w-5xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
							Built With Modern Tech
						</h2>
					</div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{techStack.map((tech, i) => (
							<motion.div
								key={i}
								variants={fadeUp}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								className="text-center p-6 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-transform hover:-translate-y-1"
							>
								<div className="flex justify-center mb-3 text-blue-700">
									{tech.icon}
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-1">
									{tech.name}
								</h3>
								<p className="text-gray-600 text-sm">{tech.desc}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default Features;
