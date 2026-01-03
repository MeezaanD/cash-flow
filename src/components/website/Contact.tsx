import React from 'react';
import { Github, Linkedin, Globe, Mail } from 'lucide-react';
import profile from '@/assets/images/profile-photo.jpeg';

const Contact: React.FC = () => {
	return (
		<section id="developer" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
			<div className="max-w-4xl mx-auto">
				{/* Heading */}
				<div className="text-center space-y-4 mb-12">
					<span className="inline-block px-4 py-1.5 text-sm font-medium bg-blue-100 text-blue-700 rounded-full border border-blue-200">
						Meet the Developer
					</span>
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
						Built by Meezaan
					</h2>
				</div>

				{/* Card */}
				<div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 flex flex-col items-center text-center space-y-6">
					{/* Profile Image */}
					<img
						src={profile}
						alt="Meezaan Davids"
						className="w-32 h-32 rounded-full object-cover"
					/>

					{/* Name & Bio */}
					<div className="space-y-4 max-w-xl">
						<h3 className="text-2xl font-bold text-gray-900">Meezaan Davids</h3>
						<p className="text-lg text-gray-600">Full Stack Developer</p>
						<p className="text-gray-600 leading-relaxed">
							Passionate about building practical tools that solve real problems. I
							focus on creating clean, user-friendly applications with modern web
							technologies.
						</p>
					</div>

					{/* Social Links */}
					<div className="flex flex-wrap gap-3 justify-center">
						<a
							href="https://github.com/MeezaanD"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
						>
							<Github size={20} className="text-gray-700" />
							<span className="text-sm font-medium text-gray-700">GitHub</span>
						</a>
						<a
							href="https://www.linkedin.com/in/meezaan-davids"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
						>
							<Linkedin size={20} className="text-gray-700" />
							<span className="text-sm font-medium text-gray-700">LinkedIn</span>
						</a>
						<a
							href="https://meezaan-portfolio.vercel.app/"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
						>
							<Globe size={20} className="text-gray-700" />
							<span className="text-sm font-medium text-gray-700">Portfolio</span>
						</a>
						<a
							href="mailto:meezaandavids365@gmail.com"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
						>
							<Mail size={20} className="text-gray-700" />
							<span className="text-sm font-medium text-gray-700">Email</span>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Contact;
