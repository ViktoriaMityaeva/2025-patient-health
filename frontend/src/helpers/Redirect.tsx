import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserAccessRouterInterface {
	to: string;
}

const Redirect: FC<UserAccessRouterInterface> = ({ to = '' }) => {
	const navigate = useNavigate();

	useEffect(() => {
		navigate(to);
	}, [navigate, to]);

	return null;
};

export default Redirect;
