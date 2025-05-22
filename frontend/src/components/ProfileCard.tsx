import React from 'react';
import { Phone, Mail, MapPin, Calendar, Send } from 'lucide-react';
import { Theme } from '@theme/Theme.model';
import { ProfileServer } from '@store/authorizeState/interface';

interface ProfileCardProps {
	isDoctor?: boolean;
	data: ProfileServer;
	theme: Theme;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ data, isDoctor = false, theme }) => {
	const { id, user, specialization, is_auth_in_tg } = data;
	const { first_name, last_name, email, uid } = user;

	const handleTelegram = () => {
		window.open('https://t.me/aidoctor71bot', '_blank');
	};

	return (
		<div
			className="bg-white rounded-2xl p-6 shadow-sm"
			style={{ background: theme['--card'] }}
		>
			<div className="flex flex-col items-center">
				<img
					src={isDoctor
						? 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
						: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
					}
					alt="Profile"
					className="w-32 h-32 rounded-full border-4 border-blue-50 mb-4"
				/>
				<h2 className="text-xl font-semibold text-center" style={{ color: theme['--text'] }}>
					{isDoctor ? `Доктор ${first_name} ${last_name}` : `${first_name} ${last_name}`}
				</h2>
				<p className="font-medium mb-4" style={{ color: theme['--secondary'] }}>
					{isDoctor ? `${specialization}` : `Пациент №${id}`}
				</p>

				<div className="w-full space-y-3 mt-4">
					<div className="flex items-center space-x-3" style={{ color: theme['--text'] }}>
						<Phone className="w-5 h-5"/>
						<span>+7 (999) 123-45-67</span>
					</div>
					<div className="flex items-center space-x-3" style={{ color: theme['--text'] }}>
						<Mail className="w-5 h-5"/>
						<span>{email}</span>
					</div>
					<div className="flex items-center space-x-3" style={{ color: theme['--text'] }}>
						<MapPin className="w-5 h-5"/>
						<span>г. Москва, ул. Ленина, 42</span>
					</div>
					<div className="flex items-center space-x-3" style={{ color: theme['--text'] }}>
						<Calendar className="w-5 h-5"/>
						<span>Дата рождения: 15.06.1985</span>
					</div>

					{!isDoctor && (
						<div onClick={handleTelegram} className="flex items-center space-x-3 cursor-pointer" style={{ color: theme['--text'] }}>
							<Send className="min-w-5 h-5"/>
							<span>{is_auth_in_tg ? 'Ваш telegram подтвержден' : `Подтвердите telegram: ${uid}`}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
