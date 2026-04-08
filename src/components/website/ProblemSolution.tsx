import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Lightbulb } from 'lucide-react';

const ProblemSolution: React.FC = () => {
	return (
		<>
			{/* Problem */}
			<section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gray-950">
				<div className="max-w-5xl mx-auto">
					<motion.div
						className="text-center mb-16"
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<span className="inline-block px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-sm font-medium mb-4">
							The Problem
						</span>
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
							Why Personal Finance Is Broken
						</h2>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								title: 'Manual & Error-Prone',
								body: 'Spreadsheets and paper ledgers are slow, easy to mess up, and give you no real-time visibility into where your money is going.',
							},
							{
								title: 'Who Suffers',
								body: 'Students, freelancers, and anyone living on a budget — people who need clarity the most often have the fewest tools to get it.',
							},
							{
								title: 'Why It Matters',
								body: "Without clear visibility, overspending becomes invisible until it's too late. Bad financial habits compound over time and prevent long-term goals.",
							},
						].map((item, i) => (
							<motion.div
								key={i}
								className="bg-gray-900/50 backdrop-blur-xl border border-red-900/30 rounded-3xl p-8"
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: i * 0.1 }}
							>
								<div className="flex items-center gap-3 mb-4">
									<div className="p-2 rounded-xl bg-red-500/10">
										<AlertCircle size={20} className="text-red-400" />
									</div>
									<h3 className="text-lg font-bold text-white">{item.title}</h3>
								</div>
								<p className="text-gray-400 leading-relaxed">{item.body}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Solution */}
			<section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gray-950">
				<div className="max-w-5xl mx-auto">
					<motion.div
						className="text-center mb-16"
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<span className="inline-block px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-sm font-medium mb-4">
							The Solution
						</span>
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
							CashFlow — Built Different
						</h2>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								title: 'What We Built',
								body: 'A full-stack budgeting app with real-time cloud sync, recurring expense tracking, visual analytics, and a clean mobile-first interface.',
							},
							{
								title: 'How It Solves It',
								body: 'Log a transaction in seconds, see your spending breakdown instantly in charts, and let recurring bills track themselves — no manual work required.',
							},
							{
								title: 'What Makes It Different',
								body: "It's not just another CRUD app. CashFlow combines smart auto-fill, AI-powered insights, multi-account support, and import/export — all in one lightweight tool.",
							},
						].map((item, i) => (
							<motion.div
								key={i}
								className="bg-gray-900/50 backdrop-blur-xl border border-green-900/30 rounded-3xl p-8"
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: i * 0.1 }}
							>
								<div className="flex items-center gap-3 mb-4">
									<div className="p-2 rounded-xl bg-green-500/10">
										<Lightbulb size={20} className="text-green-400" />
									</div>
									<h3 className="text-lg font-bold text-white">{item.title}</h3>
								</div>
								<p className="text-gray-400 leading-relaxed">{item.body}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default ProblemSolution;
