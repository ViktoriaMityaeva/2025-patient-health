import React from 'react';
import { format } from 'date-fns';
import { Activity, Camera, X } from 'lucide-react';
import type { VitalSign } from '@store/mainState/interface';
import type { Theme } from '@theme/Theme.model';
import { serverPath } from '@helpers/functions/connect';

interface Props {
	selectedId: string;
	vitalSigns: VitalSign[];
	theme: Theme;
}

export const VitalSignsHistory: React.FC<Props> = ({ selectedId, vitalSigns, theme }) => {
	const [modalPhoto, setModalPhoto] = React.useState('');

	const onClose = () => {
		setModalPhoto('');
	};

	const ItemLog = ({ sign }: { sign: VitalSign }) => (
		<>
			{sign.records.map((record, index) => {
				if (selectedId !== sign.uid) return;

				const handleClick = () => {
					setModalPhoto(record.photo ?? '');
				};

				return (
					<div
						key={index}
						className="flex items-stretch flex-col justify-between p-4 rounded-lg"
						style={{
							background: theme['--background'],
						}}
					>
						<div className="flex items-center justify-between space-x-4">
							<div className="flex items-center space-x-4">
								<Activity className="w-5 h-5" style={{ color: theme['--primary'] }}/>

								<span
									className="font-medium"
									style={{ color: !record.is_crytical ? theme['--text'] : 'red' }}
								>
									{sign.measurement_type}
								</span>

								<div>
									<span
										className="font-medium"
										style={{ color: !record.is_crytical ? theme['--text'] : 'red' }}
									>
										{record.ai_comment}
									</span>

									<p style={{ color: theme['--secondary'] }}>
										{format(new Date(record.recorded_at), 'dd.MM.yyyy HH:mm')}
									</p>
								</div>
							</div>

							{record.photo &&
								<div className="cursor-pointer" onClick={handleClick}>
									<Camera/>
								</div>
							}
						</div>
					</div>
				);
			})}
		</>
	);

	return (
		<>
			<div
				className="rounded-xl shadow-md p-6"
				style={{ background: theme['--card'] }}
			>
				<h3
					className="text-lg font-semibold mb-4"
					style={{ color: theme['--text'] }}
				>
					История измерений
				</h3>
				<div className="space-y-4">
					{vitalSigns.map((sign, index) => (
						<ItemLog key={index} sign={sign}/>
					))}

					{vitalSigns.length === 0 && (
						<p
							className="text-center py-4"
							style={{ color: theme['--secondary'] }}
						>
							История измерений пуста
						</p>
					)}
				</div>
			</div>

			{modalPhoto && (
				<div className="space-y-0">
					<div className="fixed inset-0 flex items-center justify-center z-50">
						<div
							className="absolute inset-0"
							style={{ background: 'rgba(0, 0, 0, 0.5)' }}
							onClick={onClose}
						/>
						<div
							className="relative w-full p-6 rounded-xl shadow-lg"
							style={{ background: theme['--card'] }}
						>
							<button
								onClick={onClose}
								className="absolute top-4 right-4 p-2 rounded-lg hover:opacity-80"
								style={{ color: theme['--text'] }}
							>
								<X className="w-5 h-5"/>
							</button>

							<h2
								className="text-xl font-semibold mb-6"
								style={{ color: theme['--text'] }}
							>
								Изображение
							</h2>

							<img className="w-75 h-auto" src={`http://${serverPath}/${modalPhoto}`} alt=""/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
