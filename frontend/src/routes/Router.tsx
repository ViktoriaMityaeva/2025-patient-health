import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ConnectPage from '@pages/ConnectPage';
import MainPage from '@pages/MainPage';
import Redirect from '@helpers/Redirect';
import AccountPage from '@pages/AccountPage';
import RehabPage from '@pages/RehabPage';
import DashboardPage from '@pages/DashboardPage';
import DangerPage from '@pages/DangerPage';

export default observer(() => {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<ConnectPage />} />
				<Route path="/rehabilitation" element={<RehabPage />} />
				<Route path="/dangers" element={<DangerPage />} />
				<Route path="/account" element={<AccountPage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/" element={<MainPage />} />
				<Route path="*" element={<Redirect to='/' />} />
			</Routes>
		</Router>
	);
});
