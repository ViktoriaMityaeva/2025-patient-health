import React from 'react';
import { FileText, CheckCircle, Clock, ExternalLink, Plus, X } from 'lucide-react';
import { MedicalRecord } from '@store/mainState/interface';
import { Theme } from '@theme/Theme.model';
import { format, parseISO } from 'date-fns';
import { observer } from 'mobx-react-lite';
import mainState from '@store/mainState/mainState';
import { useNavigate } from 'react-router-dom';

interface MedicalHistoryProps {
	records: MedicalRecord[];
	theme: Theme;
	isDoctor?: boolean;
}

export const MedicalHistory: React.FC<MedicalHistoryProps> = observer(({ records, theme, isDoctor = false }) => {
	const { setSelectedRowUid } = mainState;
	const navigate = useNavigate();

	const [isOpenModal, setOpenModal] = React.useState(false);

	const onClose = () => {
		setOpenModal(false);
	};

	const getStatusIcon = (status: MedicalRecord['is_active']) => {
		switch (status) {
		case false:
			return <CheckCircle className="w-5 h-5 text-green-500" />;
		case true:
			return <Clock className="w-5 h-5 text-amber-500" />;
		}
	};

	const handleRowClick = (record: MedicalRecord) => {
		setSelectedRowUid(record.uid);
		navigate('/');
	};

	return (
		<>
			<div className="rounded-lg shadow-sm p-6" style={{ background: theme['--card'] }}>
				<div className="flex items-center justify-between gap-2 mb-6">
					<div className="flex items-center gap-2">
						<FileText className="w-5 h-5" style={{ color: theme['--text'] }}/>
						<h2 className="text-xl font-semibold" style={{ color: theme['--text'] }}>История реабилитаций</h2>
					</div>

					{isDoctor && (
						<button
							onClick={() => setOpenModal(true)}
							className="flex items-center space-x-2 px-4 py-2 rounded-lg"
							style={{ background: theme['--button'], color: theme['--white'] }}
						>
							<Plus className="w-5 h-5"/>
							<span>Добавить</span>
						</button>
					)}
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b" style={{ color: theme['--text'] }}>
								<th className="text-center py-3 px-4"></th>
								<th className="text-center py-3 px-4">Дата начала</th>
								<th className="text-center py-3 px-4">Дата конца</th>
								<th className="text-center py-3 px-4">Диагноз</th>
								<th className="text-center py-3 px-4">{isDoctor ? 'Пациент' : 'Врач'}</th>
								<th className="text-center py-3 px-4">Статус</th>
							</tr>
						</thead>
						<tbody>
							{records.map((record) => (
								<tr
									key={record.uid}
									className="border-b border-gray-100 transition-colors"
									style={{ color: theme['--text'] }}
									onClick={() => handleRowClick(record)}
								>
									<td className="py-4 px-4 text-center"><ExternalLink className="w-5 h-5 cursor-pointer"
										style={{ color: theme['--text'] }}/>
									</td>
									<td className="py-4 px-4 text-center">{format(parseISO(record.created_at), 'dd.MM.yyyy HH:mm')}</td>
									<td className="py-4 px-4 font-medium text-center">{record.end_date ? format(parseISO(record.end_date), 'dd.MM.yyyy HH:mm') : 'В процессе'}</td>
									<td className="py-4 px-4">
										<div className="flex flex-col items-center gap-2">
											<span className="text-center">{record.name}</span>
											<span className="text-sm text-center">{record.description}</span>
										</div>
									</td>
									<td className="py-4 px-4 text-center">{isDoctor ? record.fullname : record.doctor_fullname}</td>
									<td className="py-4 px-4">
										<div className="flex justify-center gap-2">
											{getStatusIcon(record.is_active)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
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
							Добавление программы реабилитации
						</h2>

						<div className="space-y-4">
							<div>
								<label
									className="block text-sm font-medium mb-1"
									style={{ color: theme['--text'] }}
								>
									Название
								</label>
								<input
									type="text"
									// value={dosage}
									// onChange={(e) => setDosage(e.target.value)}
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
									Описание
								</label>
								<textarea
									// value={notes}
									// onChange={(e) => setNotes(e.target.value)}
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

							<div>
								<label
									className="block text-sm font-medium mb-1"
									style={{ color: theme['--text'] }}
								>
									ФИО пациента
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
});
