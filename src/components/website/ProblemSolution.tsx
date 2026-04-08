import React from 'react';
import { motion } from 'framer-motion';

const XIcon = () => (
	<svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
		<line x1="2" y1="2" x2="8" y2="8" stroke="#F09595" strokeWidth="1.5" strokeLinecap="round" />
		<line x1="8" y1="2" x2="2" y2="8" stroke="#F09595" strokeWidth="1.5" strokeLinecap="round" />
	</svg>
);

const CheckIcon = () => (
	<svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
		<polyline
			points="2,5.5 4.5,8 8,2.5"
			stroke="#97C459"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const problems = [
	{
		title: 'Manual and error-prone',
		body: 'Spreadsheets and paper ledgers are slow, easy to break, and give you no real-time visibility into where your money is going.',
	},
	{
		title: "No visibility until it's too late",
		body: 'Overspending becomes invisible. Bad habits compound quietly, you only notice when the damage is done.',
	},
	{
		title: 'The people who need it most are underserved',
		body: 'Students, freelancers, and anyone on a tight budget have the fewest tools built for their reality.',
	},
];

const solutions = [
	{
		title: 'Real-time cloud sync',
		body: 'Log a transaction in seconds. Your spending breakdown updates instantly, no manual reconciliation, ever.',
	},
	{
		title: 'Clarity before you overspend',
		body: 'Visual charts and smart alerts surface problems early. Recurring bills track themselves, nothing falls through the cracks.',
	},
	{
		title: 'Built for real budgets',
		body: 'Insights, multi-account support, and import/export. All in one lightweight tool designed for people who actually need it.',
	},
];

const ProblemSolution: React.FC = () => {
	return (
		<section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gray-950">
			<div className="max-w-5xl mx-auto">

				{/* Header */}
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
						Why CashFlow exists
					</h2>
					<p className="text-gray-400 text-lg">
						Personal finance is broken. Here's what we fixed.
					</p>
				</motion.div>

				{/* Split grid */}
				<motion.div
					className="relative grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-white/10"
					initial={{ opacity: 0, y: 32 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.1 }}
				>
					{/* VS badge */}
					<div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-gray-950 border border-white/10 items-center justify-center">
						<span className="text-xs text-gray-500 font-medium">vs</span>
					</div>

					{/* Problem column */}
					<div className="bg-gray-900/60 p-8 flex flex-col gap-6">
						<div className="flex items-center gap-3 pb-5 border-b border-white/10">
							<span className="text-xs font-medium uppercase tracking-wide px-2.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-900/50">
								Before
							</span>
							<span className="text-base font-medium text-white">The problem</span>
						</div>

						{problems.map((item, i) => (
							<motion.div
								key={i}
								className="grid gap-3"
								style={{ gridTemplateColumns: '20px 1fr' }}
								initial={{ opacity: 0, x: -16 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
							>
								<div className="w-5 h-5 rounded-full bg-red-950 flex items-center justify-center flex-shrink-0 mt-0.5">
									<XIcon />
								</div>
								<div>
									<p className="text-sm font-medium text-white mb-1">{item.title}</p>
									<p className="text-sm text-gray-400 leading-relaxed">{item.body}</p>
								</div>
							</motion.div>
						))}
					</div>

					{/* Solution column */}
					<div className="bg-gray-950 p-8 flex flex-col gap-6 border-t md:border-t-0 md:border-l border-white/10">
						<div className="flex items-center gap-3 pb-5 border-b border-white/10">
							<span className="text-xs font-medium uppercase tracking-wide px-2.5 py-1 rounded-full bg-green-950 text-green-400 border border-green-900/50">
								After
							</span>
							<span className="text-base font-medium text-white">CashFlow fixes it</span>
						</div>

						{solutions.map((item, i) => (
							<motion.div
								key={i}
								className="grid gap-3"
								style={{ gridTemplateColumns: '20px 1fr' }}
								initial={{ opacity: 0, x: 16 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
							>
								<div className="w-5 h-5 rounded-full bg-green-950 flex items-center justify-center flex-shrink-0 mt-0.5">
									<CheckIcon />
								</div>
								<div>
									<p className="text-sm font-medium text-white mb-1">{item.title}</p>
									<p className="text-sm text-gray-400 leading-relaxed">{item.body}</p>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default ProblemSolution;