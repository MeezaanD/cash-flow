import React, { useState } from 'react';
import AuthModals from '../components/app/AuthModals';
import Navbar from '../components/website/Navbar';
import Hero from '../components/website/Hero';
import Features from '../components/website/Features';
import Contact from '../components/website/Contact';
import Footer from '../components/website/Footer';

const Home: React.FC = () => {
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

	const handleAuthClick = (mode: 'login' | 'register') => {
		setAuthMode(mode);
		setAuthModalOpen(true);
	};

	const handleAuthClose = () => {
		setAuthModalOpen(false);
	};

	const handleAuthModeChange = (newMode: 'login' | 'register') => {
		setAuthMode(newMode);
	};

	return (
		<div className="min-h-screen bg-gray-950">
			<style>{`
				@keyframes blob {
					0%, 100% { transform: translate(0, 0) scale(1); }
					25% { transform: translate(20px, -50px) scale(1.1); }
					50% { transform: translate(-20px, 20px) scale(0.9); }
					75% { transform: translate(50px, 50px) scale(1.05); }
				}
				.animate-blob {
					animation: blob 15s infinite;
				}
				.animation-delay-2000 {
					animation-delay: 2s;
				}
				.animation-delay-4000 {
					animation-delay: 4s;
				}
			`}</style>

			<Navbar onAuthClick={handleAuthClick} />
			<Hero onAuthClick={handleAuthClick} />
			<Features />
			<Contact />
			<Footer />

			{/* Auth Modals */}
			<AuthModals
				open={authModalOpen}
				onClose={handleAuthClose}
				mode={authMode}
				onModeChange={handleAuthModeChange}
			/>
		</div>
	);
};

export default Home;
