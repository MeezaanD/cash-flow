import React from 'react';
import { Github, Linkedin, Globe, Mail, ExternalLink } from 'lucide-react';
import logo from '@/assets/images/logos/cflow-transparent-light.png';

const Footer: React.FC = () => {
	return (
		<footer className="relative border-t border-gray-800 bg-gray-950 px-4 sm:px-6 lg:px-8">
			{/* Main footer grid */}
			<div className="max-w-7xl mx-auto py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
				{/* Meet the Developer */}
				<div className="space-y-4">
					<img src={logo} alt="CashFlow" className="w-24 mb-2" />
					<p className="text-sm text-gray-400 leading-relaxed max-w-xs">
						CashFlow is a personal finance tracker built to make budgeting simple,
						fast, and stress-free.
					</p>
					<div className="flex gap-3 pt-2">
						<a
							href="https://github.com/MeezaanD"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="GitHub"
							className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-blue-400 hover:border-blue-500/40 transition-all duration-200"
						>
							<Github size={18} />
						</a>
						<a
							href="https://www.linkedin.com/in/meezaan-davids"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="LinkedIn"
							className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-blue-400 hover:border-blue-500/40 transition-all duration-200"
						>
							<Linkedin size={18} />
						</a>
						<a
							href="https://meezaan.dev/"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Portfolio"
							className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-blue-400 hover:border-blue-500/40 transition-all duration-200"
						>
							<Globe size={18} />
						</a>
						<a
							href="mailto:meezaandavids365@gmail.com"
							aria-label="Email"
							className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-blue-400 hover:border-blue-500/40 transition-all duration-200"
						>
							<Mail size={18} />
						</a>
					</div>
				</div>

				{/* Helpful Links */}
				<div className="space-y-4">
					<h4 className="text-sm font-semibold text-white uppercase tracking-wider">
						Helpful Links
					</h4>
					<ul className="space-y-3">
						{[
							{
								label: 'Source Code',
								href: 'https://github.com/MeezaanD/cash-flow',
								external: true,
							},
							{ label: 'Features', href: '#features', external: false },
							{ label: 'Demo', href: '#demo', external: false },
							{ label: 'FAQ', href: '#faq', external: false },
						].map((link) => (
							<li key={link.label}>
								<a
									href={link.href}
									target={link.external ? '_blank' : undefined}
									rel={link.external ? 'noopener noreferrer' : undefined}
									className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-200"
								>
									{link.label}
									{link.external && <ExternalLink size={12} className="opacity-60" />}
								</a>
							</li>
						))}
					</ul>
				</div>

				{/* Contact */}
				<div className="space-y-4">
					<h4 className="text-sm font-semibold text-white uppercase tracking-wider">
						Contact
					</h4>
					<ul className="space-y-3">
						<li>
							<a
								href="mailto:meezaandavids365@gmail.com"
								className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
							>
								<Mail size={15} className="text-blue-400 flex-shrink-0" />
								meezaandavids365@gmail.com
							</a>
						</li>
						<li>
							<a
								href="https://github.com/MeezaanD"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
							>
								<Github size={15} className="text-blue-400 flex-shrink-0" />
								github.com/MeezaanD
							</a>
						</li>
						<li>
							<a
								href="https://meezaan.dev/"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
							>
								<Globe size={15} className="text-blue-400 flex-shrink-0" />
								meezaan.dev
							</a>
						</li>
					</ul>
				</div>
			</div>

			{/* Bottom bar */}
			<div className="border-t border-gray-800 py-6">
				<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
					<p>© 2026 CashFlow by Meezaan Davids. All rights reserved.</p>
					<p>Built with React, TypeScript, Tailwind CSS &amp; Firebase</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

