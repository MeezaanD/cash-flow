import React from 'react';

const Footer: React.FC = () => {
	return (
		<footer className="relative border-t border-gray-800 bg-gray-950 px-4 sm:px-6 lg:px-8">

			{/* Bottom bar */}
			<div className="border-t border-gray-800 py-6">
				<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-500">
					<p className="text-center">© 2026 CashFlow by Meezaan Davids. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

