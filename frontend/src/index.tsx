import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider } from '@theme/Theme.context';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000
		}
	}
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</QueryClientProvider>
	</React.StrictMode>
);
