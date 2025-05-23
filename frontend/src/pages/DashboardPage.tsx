import React, { FC } from 'react';
import { useTheme } from '@theme/Theme.context';
import { Header } from '@components/Header';
import { VitalSignChart, VitalSignChart2 } from '@store/mainState/interface';
import { VitalSignsChart } from '@components/VitalSignsChart';
import { VitalSignsChart2 } from '@components/VitalSignsChart2';
import { MedicationAdherence } from '@components/MedicationAdherence';

export const medications: any[] = [
	{
		id: 1,
		name: 'Митяева Виктория',
		dosage: '',
		frequency: '',
		timesTaken: [
			{
				date: '2025-05-23',
				taken: true,
				scheduledTime: '21:20',
				actualTime: '21:19'
			}
		]
	},
	{
		id: 1,
		name: 'Мирон Багданов',
		dosage: '',
		frequency: '',
		timesTaken: [
			{
				date: '2025-05-20',
				taken: true,
				scheduledTime: '09:00',
				actualTime: '09:15'
			},
			{
				date: '2025-05-21',
				taken: false,
				scheduledTime: '21:00'
			}
		]
	},
	{
		id: 2,
		name: 'Валентин Уваров',
		dosage: '',
		frequency: '',
		timesTaken: [
			{
				date: '2025-05-20',
				taken: true,
				scheduledTime: '10:00',
				actualTime: '10:15'
			},
			{
				date: '2025-05-21',
				taken: true,
				scheduledTime: '10:00',
				actualTime: '10:45'
			}
		]
	},
	{
		id: 2,
		name: 'Федосий Сидоров',
		dosage: '',
		frequency: '',
		timesTaken: [
			{
				date: '2025-05-20',
				taken: true,
				scheduledTime: '9:00',
				actualTime: '9:05'
			}
		]
	}
];

export const vitalSigns: VitalSignChart[] = [
	{
		date: '2025-05-20',
		usersCount: 18,
		criticalUsersCount: 0,
	},
	{
		date: '2025-05-21',
		usersCount: 17,
		criticalUsersCount: 0,
	},
	{
		date: '2025-05-22',
		usersCount: 19,
		criticalUsersCount: 2,
	},
	{
		date: '2025-05-23',
		usersCount: 11,
		criticalUsersCount: 0,
	},
	{
		date: '2025-05-24',
		usersCount: 15,
		criticalUsersCount: 1,
	},
	{
		date: '2025-05-25',
		usersCount: 20,
		criticalUsersCount: 0,
	},
	{
		date: '2025-05-26',
		usersCount: 18,
		criticalUsersCount: 0,
	},
];

export const vitalSigns2: VitalSignChart2[] = [
	{
		date: '2025-05-20',
		visited: 5,
	},
	{
		date: '2025-05-21',
		visited: 10,
	},
	{
		date: '2025-05-22',
		visited: 11,
	},
	{
		date: '2025-05-23',
		visited: 7,
	},
];

const DashboardPage: FC = () => {
	const { theme } = useTheme();

	return (
		<div className="min-h-screen" style={{ background: theme['--background'] }}>
			<Header/>

			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<VitalSignsChart data={vitalSigns} theme={theme}/>
					<VitalSignsChart2 data={vitalSigns2} theme={theme}/>
				</div>

				<MedicationAdherence medications={medications} theme={theme} />
			</div>
		</div>
	);
};

export default DashboardPage;
