import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme, ThemeContextType, CurrencyCode } from '../types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [theme, setThemeState] = useState<Theme>(() => {
		return (localStorage.getItem('theme') as Theme) || 'light';
	});
	const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
		return (localStorage.getItem('currency') as CurrencyCode) || 'ZAR';
	});

	const setTheme = (newTheme: Theme) => {
		localStorage.setItem('theme', newTheme);
		setThemeState(newTheme);
	};

	const setCurrency = (newCurrency: CurrencyCode) => {
		localStorage.setItem('currency', newCurrency);
		setCurrencyState(newCurrency);
	};

	return (
		<ThemeContext.Provider value={{ theme, setTheme, currency, setCurrency }}>
			<div className={`theme-${theme}`}>{children}</div>
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
