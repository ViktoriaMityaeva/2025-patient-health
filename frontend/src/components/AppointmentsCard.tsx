import React from 'react';
import { Clock } from 'lucide-react';
import { Theme } from '@theme/Theme.model';

interface AppointmentsCardProps {
	isDoctor?: boolean;
	theme: Theme;
}

export const AppointmentsCard: React.FC<AppointmentsCardProps> = ({ isDoctor = false, theme }) => {
	return (
		<div className="rounded-2xl p-6 shadow-sm" style={{ background: theme['--card'] }}>
			<h3 className="mb-4 text-lg font-semibold" style={{ color: theme['--text'] }}>
				{isDoctor ? 'Расписание приёма' : 'Ближайшие приёмы'}
			</h3>
			<div className="space-y-4">
				{[1].map((item) => (
					<div key={item} className="flex items-center justify-between p-3 rounded-lg" style={{ background: theme['--background'] }}>
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: theme['--card'] }}>
								<Clock className="w-6 h-6" style={{ color: theme['--text'] }} />
							</div>
							<div>
								<p className="font-medium" style={{ color: theme['--text'] }}>
									{isDoctor ? 'Анна Петрова' : 'Др. Елена Соколова'}
								</p>
								<p className="text-sm" style={{ color: theme['--secondary'] }}>Кардиология</p>
							</div>
						</div>
						<div className="text-right">
							<p className="font-medium" style={{ color: theme['--text'] }}>25 марта</p>
							<p className="text-sm" style={{ color: theme['--secondary'] }}>14:30</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
