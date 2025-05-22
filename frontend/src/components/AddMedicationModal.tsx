import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Theme } from '@theme/Theme.model';
import type { Medication } from '@store/mainState/interface';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (medication: Omit<Medication, 'id'>) => void;
  theme: Theme;
}

export const AddMedicationModal: React.FC<Props> = ({ isOpen, onClose, onAdd, theme }) => {
	const [name, setName] = useState('');
	const [dosage, setDosage] = useState('');
	const [frequency, setFrequency] = useState('daily');
	const [timeToTake, setTimeToTake] = useState(['']);
	const [notes, setNotes] = useState('');

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

	const addTimeField = () => {
		setTimeToTake([...timeToTake, '']);
	};

	const updateTime = (index: number, value: string) => {
		const newTimes = [...timeToTake];
		newTimes[index] = value;
		setTimeToTake(newTimes);
	};

	const removeTime = (index: number) => {
		setTimeToTake(timeToTake.filter((_, i) => i !== index));
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
					Добавить лекарство
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
							Дозировка
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

					<div>
						<label
							className="block text-sm font-medium mb-1"
							style={{ color: theme['--text'] }}
						>
							Частота приёма
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
							<option value="daily">Ежедневно</option>
							<option value="weekly">Еженедельно</option>
							<option value="monthly">Ежемесячно</option>
						</select>
					</div>

					<div>
						<label
							className="block text-sm font-medium mb-1"
							style={{ color: theme['--text'] }}
						>
							Время приёма
						</label>

						{timeToTake.map((time, index) => (
							<div key={index} className="flex gap-2 mb-2">
								<input
									type="time"
									value={time}
									onChange={(e) => updateTime(index, e.target.value)}
									className="flex-1 px-4 py-2 rounded-lg"
									style={{
										background: theme['--background'],
										color: theme['--text'],
										border: `1px solid ${theme['--primary']}`
									}}
									required
								/>
								{timeToTake.length > 1 && (
									<button
										type="button"
										onClick={() => removeTime(index)}
										className="px-3 py-2 rounded-lg"
										style={{ background: theme['--button'] }}
									>
										<X className="w-4 h-4" />
									</button>
								)}
							</div>
						))}

						<button
							type="button"
							onClick={addTimeField}
							className="text-sm px-4 py-2 rounded-lg mt-2"
							style={{ background: theme['--button'], color: theme['--white'] }}
						>
							Добавить время
						</button>
					</div>

					<div>
						<label
							className="block text-sm font-medium mb-1"
							style={{ color: theme['--text'] }}
						>
							Заметки
						</label>
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							className="w-full px-4 py-2 rounded-lg"
							style={{
								background: theme['--background'],
								color: theme['--text'],
								border: `1px solid ${theme['--primary']}`
							}}
							rows={3}
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
