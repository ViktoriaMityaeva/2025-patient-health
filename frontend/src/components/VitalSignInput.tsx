import React, { useRef, useState } from 'react';
import './VitalSingInput.css';
import { Activity, Plus } from 'lucide-react';
import type { Theme } from '@theme/Theme.model';
import { VitalSign } from '@store/mainState/interface';
import { AddMeasureModal } from '@components/AddMeasureModal';

interface Props {
	selectedId: string | null;
	setSelectedId: (id: string | null) => void;
	measurements: VitalSign[];
	theme: Theme;
	isDoctor?: boolean;
}

export const VitalSignInput: React.FC<Props> = ({ selectedId, setSelectedId, measurements, theme, isDoctor }) => {
	const [value, setValue] = useState('');
	const [notes, setNotes] = useState('');
	const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// setIsLoading(true);
		try {
			const reader = new FileReader();
			reader.onloadend = () => {
				// setImage(reader.result as string);
				// setIsLoading(false);
			};
			reader.readAsDataURL(file);
		} catch (error) {
			console.error('Error uploading image:', error);
		}
	};

	const MeasureItemButton = ({ item }: { item: VitalSign }) => {
		const { uid, measurement_type } = item;

		return (
			<button
				type="button"
				onClick={() => setSelectedId(uid)}
				className={'flex-1 p-4 rounded-lg border-2'}
				style={{
					background: selectedId === uid ? theme['--button'] : 'transparent',
					border: `1px solid ${theme['--secondary']}`,
				}}
			>
				<Activity
					className="w-6 h-6 mx-auto mb-2"
					style={{ color: selectedId === uid ? theme['--white'] : theme['--text'] }}
				/>
				<span
					className="block text-sm text-center"
					style={{ color: selectedId === uid ? theme['--white'] : theme['--text'] }}
				>
					{measurement_type}
				</span>
			</button>
		);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="rounded-xl shadow-md p-6"
			style={{ background: theme['--card'] }}
		>
			<div className="space-y-4">
				<div className="flex space-x-4 overflow-x-auto">
					{measurements.map((item, index) => (
						<MeasureItemButton key={index} item={item}/>
					))}

					{isDoctor &&
						<button
							type="button"
							onClick={() => setIsAddModalOpen(true)}
							// onClick={() => setType('blood-pressure')}
							className={'flex-1 p-4 rounded-lg border-2'}
							style={{
								border: `1px solid ${theme['--secondary']}`,
							}}
						>
							<Plus
								className="w-6 h-6 mx-auto mb-2"
								style={{ color: theme['--text'] }}
							/>

							<span
								className="block text-sm text-center"
								style={{ color: theme['--text'] }}
							>
							</span>
						</button>
					}
				</div>


				{!isDoctor && !!selectedId && (
					<>
						<input
							style={{ color: theme['--text'], background: theme['--card'], width: '100%' }}
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
						/>

						<div>
							<input
								type="text"
								value={value}
								onChange={(e) => setValue(e.target.value)}
								placeholder="Значения"
								className='w-full px-4 py-2 rounded-lg placeholder'
								style={{
									background: theme['--card'],
									color: theme['--text'],
									border: `1px solid ${theme['--secondary']}`,
								}}
								required
							/>
						</div>

						<div>
							<textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Дополнительные заметки..."
								className="w-full px-4 py-2 rounded-lg placeholder"
								style={{
									background: theme['--card'],
									color: theme['--text'],
									border: `1px solid ${theme['--secondary']}`
								}}
								rows={3}
							/>
						</div>

						<button
							type="submit"
							className="w-full py-2 rounded-lg transition-colors"
							style={{ background: theme['--button'], color: theme['--white'] }}
						>
							Сохранить
						</button>
					</>
				)}
			</div>

			<AddMeasureModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onAdd={() => console.log('add')}
				theme={theme}
			/>
		</form>
	);
};
