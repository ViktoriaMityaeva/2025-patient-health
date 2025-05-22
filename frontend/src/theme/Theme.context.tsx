import React from 'react';
import { THEMES } from './Theme.config';
import { ThemeType, Theme } from './Theme.model';
import mainState from '@store/mainState/mainState';

interface ThemeContextProps {
    themeType: ThemeType;
    theme: Theme;
	toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextProps>({
	themeType: 'light',
	theme: THEMES['light'],
} as ThemeContextProps);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { themeState, setTheme } = mainState;
	const [currentTheme, setCurrentTheme] = React.useState<ThemeType>(themeState);

	const toggleTheme = () => {
		const newTheme = currentTheme === 'light' ? 'dark' : 'light';
		setCurrentTheme(newTheme);
		setTheme(newTheme);
	};

	return (
		<ThemeContext.Provider value={{
			themeType: currentTheme,
			theme: THEMES[currentTheme],
			toggleTheme,
		}}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => React.useContext(ThemeContext);
