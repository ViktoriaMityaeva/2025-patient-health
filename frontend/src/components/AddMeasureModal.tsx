import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Theme } from '@theme/Theme.model';
import type { Medication } from '@store/mainState/interface';
import { useQuery } from 'react-query';
import { apiGetQuery } from '@api/api';
import connectState from '@store/connectState/connectState';

interface Device {
	device: {
		ai_settings: object;
		description: string;
		inventory_number: string;
		name: string;
		photo: string;
		settings: object;
		uid: string;
	};
	id: number;
	patient: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (medication: Omit<Medication, 'id'>) => void;
  theme: Theme;
}

export const getProfileData = async (link: string) => {
	const data = await apiGetQuery(link);
	return data as Device[];
};

export const AddMeasureModal: React.FC<Props> = ({ isOpen, onClose, onAdd, theme }) => {
	const { linkDevices } = connectState;

	const [name, setName] = useState('');
	const [dosage, setDosage] = useState('');
	const [frequency, setFrequency] = useState('daily');
	const [timeToTake, setTimeToTake] = useState(['']);
	const [notes, setNotes] = useState('');

	const { data } = useQuery(['profile', linkDevices],
		() => getProfileData(linkDevices), { keepPreviousData: true });

	if (!data) return null;

	const uniqueDeviceNames = Array.from(
		new Set(data?.map(device => device.device.name))
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onAdd({
			uid: Date.now().toString(),
			name,
			dosage,
			periodicity: frequency,
			times: timeToTake.filter(time => time !== ''),
			comment: notes,
		});
		resetForm();
		onClose();
	};

	const resetForm = () => {
		setName('');
		setDosage('');
		setFrequency('daily');
		setTimeToTake(['']);
		setNotes('');
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div
				className="absolute inset-0"
				style={{ background: 'rgba(0, 0, 0, 0.5)' }}
				onClick={onClose}
			/>
			<div
				className="relative w-full max-w-md p-6 rounded-xl shadow-lg"
				style={{ background: theme['--card'] }}
			>
				<button
					onClick={onClose}
					className="absolute top-4 right-4 p-2 rounded-lg hover:opacity-80"
					style={{ color: theme['--text'] }}
				>
					<X className="w-5 h-5" />
				</button>

				<h2
					className="text-xl font-semibold mb-6"
					style={{ color: theme['--text'] }}
				>
					Добавить измерение
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							className="block text-sm font-medium mb-1"
							style={{ color: theme['--text'] }}
						>
							Название
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full px-4 py-2 rounded-lg"
							style={{
								background: theme['--background'],
								color: theme['--text'],
								border: `1px solid ${theme['--primary']}`
							}}
							required
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium mb-1"
							style={{ color: theme['--text'] }}
						>
							Устройство
						</label>
						<select
							value={frequency}
							onChange={(e) => setFrequency(e.target.value)}
							className="w-full px-4 py-2 rounded-lg"
							style={{
								background: theme['--background'],
								color: theme['--text'],
								border: `1px solid ${theme['--text']}`
							}}
						>
							{uniqueDeviceNames.map((name) => (
								<option key={name} value={name}>{name}</option>
							))}
						</select>
					</div>

					<div>
						<label
							className="block text-sm font-medium mb-1"
							style={{ color: theme['--text'] }}
						>
							Программа реабилитации
						</label>
						<input
							type="text"
							value={dosage}
							onChange={(e) => setDosage(e.target.value)}
							className="w-full px-4 py-2 rounded-lg"
							style={{
								background: theme['--background'],
								color: theme['--text'],
								border: `1px solid ${theme['--primary']}`
							}}
							required
						/>
					</div>

					<div className="flex gap-4 mt-6">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 py-2 rounded-lg"
							style={{ background: theme['--button'], color: theme['--white'] }}
						>
							Отмена
						</button>
						<button
							type="submit"
							className="flex-1 py-2 rounded-lg"
							style={{ background: theme['--primary'], color: theme['--white'] }}
						>
							Добавить
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
