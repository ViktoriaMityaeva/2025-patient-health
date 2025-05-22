import React, { FC, useEffect } from 'react';
import './App.css';
import './fonts/Montserrat/Montserrat-Black.ttf';
import { useTheme } from '@theme/Theme.context';
import Router from './routes/Router';
import NoRouter from './routes/NoRouter';
import { setConnections } from '@helpers/functions/connect';
import authorizeState from '@store/authorizeState/authorizeState';
import { observer } from 'mobx-react-lite';
// import { AIChat } from '@components/AIChat';

const App: FC = observer(() => {
	const { theme } = useTheme();
	const { isAutorize } = authorizeState;

	useEffect(() => {
		setConnections();
	}, []);

	const routes = {
		true: <Router />,
		false: <NoRouter />,
	};

	return (
		<div className='App' style={{ ...theme } as React.CSSProperties}>
			{routes[`${isAutorize}`]}
			{/*{isAutorize && <AIChat theme={theme} />}*/}
		</div>
	);
});

export default App;
