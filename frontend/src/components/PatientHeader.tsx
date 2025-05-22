import React from 'react';
import { Theme } from '@theme/Theme.model';
import { Doctor } from '@store/mainState/interface';
import { format } from 'date-fns';
import { Plus, X } from 'lucide-react';
import authorizeState from '@store/authorizeState/authorizeState';

interface PatientHeaderProps {
	name: string;
	cost?: string | undefined;
	diagnosis: string;
	patientId: string;
	theme: Theme;
	created_at?: string;
	end_date?: string;
	is_active?: boolean;
	duration?: number;
	doctors?: Doctor[];
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ name, diagnosis, cost, created_at, end_date, is_active, duration, doctors, theme }) => {
	const { isStaff } = authorizeState;
	const [isOpenModal, setOpenModal] = React.useState(false);

	const onClose = () => {
		setOpenModal(false);
	};

	return (
		<>
			<div className="rounded-lg shadow-md p-6 mb-6" style={{ background: theme['--card'] }}>
				<div className="flex items-start justify-between" style={{ flexWrap: 'wrap' }}>
					<div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
						<div className="p-1 rounded-full" style={{ background: theme['--background'] }}>
							<img
								src={'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
								alt="Profile"
								className="w-20 h-20 rounded-full border-4 border-blue-50"
							/>
						</div>
						<div className="patient-info">
							<h1 className="text-2xl font-bold" style={{ color: theme['--text'] }}>{name}</h1>
							<p style={{ color: theme['--text'] }}>
								<span className="font-semibold">Диагноз:</span> {diagnosis}
							</p>

							{is_active && created_at &&
								<div style={{ color: theme['--text'] }}>Активна
									c {format(new Date(created_at), 'dd.MM.yyyy HH:mm')}</div>
							}

							{duration &&
								<div style={{ color: theme['--text'] }}>{duration} дн.</div>
							}

							{cost &&
								<div style={{ color: theme['--text'] }}>Стоимость лечения: {cost}</div>
							}

							{created_at && end_date &&
								<div style={{ color: theme['--text'] }}>
									{format(new Date(created_at), 'dd.MM.yyyy HH:mm')} - {format(new Date(end_date), 'dd.MM.yyyy HH:mm')}
								</div>
							}
						</div>
					</div>

					<div className="flex flex-col items-end gap-4" >
						{doctors?.map(doctor => (
							<div
								key={doctor.fullname}
								style={{ color: theme['--text'] }}>{doctor.fullname} - {doctor.specialization}</div>
						))}

						{isStaff &&
							<button
								onClick={() => setOpenModal(true)}
								className="flex items-center space-x-2 px-4 py-2 rounded-lg"
								style={{ background: theme['--button'], color: theme['--white'] }}
							>
								<Plus className="w-5 h-5"/>
								<span>Добавить врача</span>
							</button>
						}
					</div>
				</div>
			</div>

			{isOpenModal &&
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
							<X className="w-5 h-5"/>
						</button>

						<h2
							className="text-xl font-semibold mb-6"
							style={{ color: theme['--text'] }}
						>
							Добавление лечащего врача
						</h2>

						<div className="space-y-4">
							<div>
								<label
									className="block text-sm font-medium mb-1"
									style={{ color: theme['--text'] }}
								>
									Врач
								</label>
								<select
									// value={frequency}
									// onChange={(e) => setFrequency(e.target.value)}
									className="w-full px-4 py-2 rounded-lg"
									style={{
										background: theme['--background'],
										color: theme['--text'],
										border: `1px solid ${theme['--text']}`
									}}
								>
									<option value="daily"></option>
								</select>
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
						</div>
					</div>
				</div>
			}
		</>
	);
};
