import React from 'react';
import { Clock, Pill } from 'lucide-react';
import { format, isBefore  } from 'date-fns';
import type { Medication } from '@store/mainState/interface';
import { Theme } from '@theme/Theme.model';

interface Props {
  medication: Medication;
  lastTaken?: string;
  theme: Theme;
  isDoctor?: boolean;
}

export const MedicationCard: React.FC<Props> = ({ medication, lastTaken = '', theme, isDoctor }) => {
	const isTimeToTake = (time: string) => {
		const [hours, minutes] = time.split(':');
		const medicationTime = new Date();
		medicationTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

		const now = new Date();
		const timeDiff = Math.abs(now.getTime() - medicationTime.getTime());

		return timeDiff <= 30 * 60 * 1000;
	};

	const shouldTake = medication.times.some(isTimeToTake);
	const currentDateTime = new Date();
	const lastTakenDateTime = new Date(lastTaken);

	const isLastTakenBeforeCurrent = isBefore(lastTakenDateTime, currentDateTime);

	return (
		<div
			className="rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
			style={{ background: theme['--card'] }}
		>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center space-x-3">
					<div className="p-2 rounded-lg" style={{ background: theme['--button'] }}>
						<Pill className="w-6 h-6" style={{ color: theme['--white'] }} />
					</div>
					<h3 className="text-lg font-semibold" style={{ color: theme['--text'] }}>
						{medication.name}
					</h3>
				</div>
				{!isDoctor && (
					<button
						onClick={() => console.log('clicked')}
						className={`px-4 py-2 rounded-lg transition-colors ${shouldTake ? 'animate-pulse' : ''}`}
						style={{
							background: shouldTake ? theme['--primary'] : theme['--button'],
							color: theme['--white'],
						}}
					>
						Принять
					</button>
				)}
			</div>

			<div className="space-y-2">
				<p style={{ color: theme['--text'] }}>
					<span className="font-medium">Дозировка:</span> {medication.dosage}
				</p>
				<div className="flex items-center" style={{ color: theme['--text'] }}>
					<Clock className="w-4 h-4 mr-2"/>
					<span className="font-medium">Время приёма:</span>
					<div className="ml-2 flex flex-wrap gap-2">
						{medication.times.map((time) => (
							<span
								key={time}
								className={`px-2 py-1 rounded-md text-sm ${isTimeToTake(time) ? 'ring-2' : ''}`}
								style={{
									border: `1px solid ${theme['--secondary']}`,
								}}
							>
								{time}
							</span>
						))}
					</div>
				</div>

				{lastTaken && (
					<p
						className="text-sm"
						style={{ color: theme['--secondary'] }}
					>
						{isLastTakenBeforeCurrent
							? `Последний приём: ${format(new Date(lastTaken), 'dd.MM.yyyy HH:mm')}`
							: `Ближайший приём: ${format(new Date(lastTaken), 'dd.MM.yyyy HH:mm')}`
						}
					</p>
				)}

				{medication.comment && (
					<p
						className="text-sm mt-2"
						style={{ color: theme['--secondary'] }}
					>
						{medication.comment}
					</p>
				)}
			</div>
		</div>
	);
};
