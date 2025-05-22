import React from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import { Theme } from '@theme/Theme.model';

interface MedicationCalendarProps {
  logs: Array<{ date: string; taken: boolean }>;
  theme: Theme;
}

export const MedicationCalendar: React.FC<MedicationCalendarProps> = ({ logs, theme }) => {
	const getTileClassName = ({ date }: { date: Date }) => {
		const formattedDate = format(date, 'yyyy-MM-dd');
		const log = logs.find(l => l.date.startsWith(formattedDate));

		if (log) {
			return log.taken ? 'bg-green-500 text-white rounded-full' : 'bg-red-500 text-white rounded-full';
		}
		return '';
	};

	return (
		<div className="medication-calendar mt-4">
			<Calendar
				tileClassName={getTileClassName}
				className="rounded-lg border shadow"
				style={{
					background: theme['--background'],
					color: theme['--text']
				}}
			/>
			<div className="flex gap-4 mt-2 text-sm">
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 bg-green-500 rounded-full"></div>
					<span style={{ color: theme['--text'] }}>Принято</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 bg-red-500 rounded-full"></div>
					<span style={{ color: theme['--text'] }}>Пропущено</span>
				</div>
			</div>
		</div>
	);
};
