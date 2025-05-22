import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, User, Calendar, Moon, Sun, Menu, X, Bell, ChartSpline, TriangleAlert } from 'lucide-react';
import authorizeState from '@store/authorizeState/authorizeState';
import { useTheme } from '@theme/Theme.context';
import mainState from '@store/mainState/mainState';

export const Header: React.FC = () => {
	const { theme, themeType, toggleTheme } = useTheme();
	const navigate = useNavigate();
	const { isStaff, setAuthorize, setToken } = authorizeState;
	const { setSelectedRowUid } = mainState;
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const isLK = window.location.pathname.includes('/account');

	const handleLogout = () => {
		navigate('/login');
		setAuthorize(false);
		setToken('');
		setIsMenuOpen(false);
		setSelectedRowUid(null);
	};

	const handleAccount = () => {
		navigate('/account');
		setIsMenuOpen(false);
	};

	const navItems = [
		{ path: '/', label: 'Моё здоровье', icon: User, user: 'patient' },
		{ path: '/dashboard', label: 'Дашборд', icon: ChartSpline, user: 'doctor' },
		{ path: '/rehabilitation', label: 'История', icon: Calendar, user: 'both' },
		{ path: '/dangers', label: 'Опасные показатели', icon: TriangleAlert, user: 'doctor' },
		// { path: '/patients', label: 'Пациенты', icon: ContactRound, user: 'doctor' },
	];

	const NavItems = () => (
		<>
			{navItems.map(({ path, label, icon: Icon, user }) => {
				const isDoctor = user === 'doctor';
				if (user !== 'both' && isDoctor !== isStaff) {
					return null;
				}

				return (
					<NavLink
						key={path}
						to={path}
						onClick={() => setIsMenuOpen(false)}
						className={({ isActive }) =>
							`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors
						${isActive ? theme['--primary'] : 'text-gray-600 hover:bg-gray-100'}`
						}
						style={({ isActive }) => ({
							background: isActive ? theme['--primary'] : 'transparent',
							color: isActive ? theme['--white'] : theme['--text'],
						})}
					>
						<Icon size={20}/>
						<span className="font-medium">{label}</span>
					</NavLink>
				);
			})}
		</>
	);

	const AccountControls = () => (
		<>
			{isLK ? (
				<>
					<button
						onClick={toggleTheme}
						className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors"

						style={{ color: theme['--text'] }}
					>
						{themeType === 'light' ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
						<span className="font-medium">Тема</span>
					</button>
					<button
						onClick={handleLogout}
						style={{ background: 'transparent' }}
						className="flex items-center space-x-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
					>
						<LogOut size={20}/>
						<span className="font-medium">Выйти</span>
					</button>
				</>
			) : (
				<button
					onClick={handleAccount}
					style={{ background: 'transparent', color: theme['--text'] }}
					className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
				>
					<User size={20}/>
					<span className="font-medium">Личный кабинет</span>
				</button>
			)}
		</>
	);

	const Notifications = () => (
		<button
			style={{ background: 'transparent', color: theme['--text'] }}
			className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
		>
			<Bell size={20}/>
			<span className="font-medium">Уведомления</span>
		</button>
	);

	return (
		<header
			className="shadow-md relative"
			style={{ background: theme['--background'] }}
		>
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
				<div className="flex justify-between items-center h-full">
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="lg:hidden p-2 rounded-md"
						style={{ color: theme['--text'] }}
					>
						{isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
					</button>

					<div className="hidden lg:flex lg:space-x-8">
						<NavItems/>
					</div>

					<div className="hidden lg:flex lg:items-center lg:space-x-2">
						<Notifications />
						<AccountControls/>
					</div>

					{isMenuOpen && (
						<div
							className="absolute top-16 left-0 right-0 shadow-lg lg:hidden z-50"
							style={{ background: theme['--background'] }}
						>
							<div className="px-4 py-2 space-y-2">
								<NavItems/>
								<div className="border-t pt-2 mt-2" style={{ borderColor: theme['--text'] }}>
									<Notifications />
									<AccountControls/>
								</div>
							</div>
						</div>
					)}
				</div>
			</nav>
		</header>
	);
};
