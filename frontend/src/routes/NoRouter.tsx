import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ConnectPage from '@pages/ConnectPage';
import Redirect from '@helpers/Redirect';

export default observer(() => {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<ConnectPage />} />
				<Route path="*" element={<Redirect to='/login' />} />
			</Routes>
		</Router>
	);
});
