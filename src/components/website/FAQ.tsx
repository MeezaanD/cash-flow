import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
	{
		question: 'Is CashFlow free to use?',
		answer:
			'Yes! CashFlow is completely free. Simply register for an account and start tracking your finances immediately — no credit card required.',
	},
	{
		question: 'How is my financial data stored?',
		answer:
			'Your data is stored securely in Firebase Firestore, scoped exclusively to your user account. Nobody else can access your transactions, accounts, or budgets.',
	},
	{
		question: 'Can I import my existing transactions?',
		answer:
			'Absolutely. CashFlow supports CSV and JSON import/export so you can bring in data from other tools or back up your records at any time.',
	},
	{
		question: 'Does CashFlow support recurring expenses?',
		answer:
			'Yes. You can configure recurring bills and subscriptions once, and CashFlow will automatically track them every month without any manual input.',
	},
	{
		question: 'Can I access my data from multiple devices?',
		answer:
			'Yes. Because everything is stored in the cloud via Firebase, your data syncs instantly across all your devices — desktop, tablet, or mobile.',
	},
	{
		question: 'What technologies power CashFlow?',
		answer:
			'CashFlow is built with React, TypeScript, Tailwind CSS, and Firebase (Authentication + Firestore). The UI is animated with Framer Motion.',
	},
];

const FAQ: React.FC = () => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

	return (
		<section
			id="faq"
			className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gray-950"
		>
			<div className="max-w-3xl mx-auto">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<span className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm font-medium mb-4">
						FAQ
					</span>
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
						Frequently Asked Questions
					</h2>
					<p className="text-lg text-gray-400">
						Everything you need to know before getting started.
					</p>
				</motion.div>

				<div className="space-y-3">
					{faqs.map((faq, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: i * 0.07 }}
							className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden"
						>
							<button
								onClick={() => toggle(i)}
								aria-expanded={openIndex === i}
								className="w-full flex items-center justify-between px-6 py-5 text-left text-white font-semibold hover:bg-gray-800/40 transition-colors duration-200"
							>
								<span>{faq.question}</span>
								<ChevronDown
									size={20}
									className={`flex-shrink-0 ml-4 text-blue-400 transition-transform duration-300 ${
										openIndex === i ? 'rotate-180' : ''
									}`}
								/>
							</button>

							<AnimatePresence initial={false}>
								{openIndex === i && (
									<motion.div
										key="content"
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: 'auto', opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.3, ease: 'easeInOut' }}
									>
										<p className="px-6 pb-5 text-gray-400 leading-relaxed">
											{faq.answer}
										</p>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default FAQ;
