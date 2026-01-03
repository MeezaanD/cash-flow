import React from 'react';
import { Github, Linkedin, Globe, Mail } from 'lucide-react';
import profile from '@/assets/images/profile-photo.jpeg';

const Contact: React.FC = () => {
	return (
		<section
			id="developer"
			className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-950"
		>
			<div className="relative max-w-4xl mx-auto">
				<div className="text-center mb-16">
					<span className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm font-medium mb-4">
						Meet the Developer
					</span>
					<h2 className="text-4xl md:text-5xl font-bold text-white">Built by Meezaan</h2>
				</div>

				<div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-12">
					<div className="flex flex-col items-center text-center space-y-8">
						<div className="relative w-32 h-32 rounded-full bg-blue-500/10 p-1">
							<img
								src={profile}
								alt="Meezaan Davids"
								className="w-full h-full rounded-full object-cover"
							/>
						</div>

						<div className="space-y-4 max-w-xl">
							<h3 className="text-3xl font-bold text-white">Meezaan Davids</h3>
							<p className="text-xl text-gray-400">Full Stack Developer</p>
							<p className="text-gray-400 leading-relaxed text-lg">
								Passionate about building practical tools that solve real problems.
								I focus on creating clean, user-friendly applications with modern
								web technologies.
							</p>
						</div>

						<div className="flex flex-wrap gap-4 justify-center">
							<a
								href="https://github.com/MeezaanD"
								target="_blank"
								rel="noopener noreferrer"
								className="group/link inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800 hover:bg-gray-800/80 transition-all duration-300 hover:-translate-y-1"
							>
								<Github
									size={20}
									className="text-gray-400 group-hover/link:text-blue-400 transition-colors"
								/>
								<span className="text-sm font-medium text-gray-300 group-hover/link:text-white">
									GitHub
								</span>
							</a>
							<a
								href="https://www.linkedin.com/in/meezaan-davids"
								target="_blank"
								rel="noopener noreferrer"
								className="group/link inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800 hover:bg-gray-800/80 transition-all duration-300 hover:-translate-y-1"
							>
								<Linkedin
									size={20}
									className="text-gray-400 group-hover/link:text-blue-400 transition-colors"
								/>
								<span className="text-sm font-medium text-gray-300 group-hover/link:text-white">
									LinkedIn
								</span>
							</a>
							<a
								href="https://meezaan-portfolio.vercel.app/"
								target="_blank"
								rel="noopener noreferrer"
								className="group/link inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800 hover:bg-gray-800/80 transition-all duration-300 hover:-translate-y-1"
							>
								<Globe
									size={20}
									className="text-gray-400 group-hover/link:text-blue-400 transition-colors"
								/>
								<span className="text-sm font-medium text-gray-300 group-hover/link:text-white">
									Portfolio
								</span>
							</a>
							<a
								href="mailto:meezaandavids365@gmail.com"
								className="group/link inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800 hover:bg-gray-800/80 transition-all duration-300 hover:-translate-y-1"
							>
								<Mail
									size={20}
									className="text-gray-400 group-hover/link:text-blue-400 transition-colors"
								/>
								<span className="text-sm font-medium text-gray-300 group-hover/link:text-white">
									Email
								</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Contact;
