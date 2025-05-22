import React, { FC, useState } from 'react';
import { AddMedicationModal } from '@components/AddMedicationModal';
import { useTheme } from '@theme/Theme.context';
import { ArrowLeft, Plus } from 'lucide-react';
import { MedicalRecord, Medication } from '@store/mainState/interface';
import { MedicationCard } from '@components/MedicationCard';
import { MedicationHistory } from '@components/MedicationHistory';
import { VitalSignInput } from '@components/VitalSignInput';
import { VitalSignsHistory } from '@components/VitalSignsHistory';
import { Header } from '@components/Header';
import { apiGetQuery } from '@api/api';
import { useQuery } from 'react-query';
import connectState from '@store/connectState/connectState';
import authorizeState from '@store/authorizeState/authorizeState';
import { Chat } from '@components/Chat';
import { observer } from 'mobx-react-lite';
import mainState from '@store/mainState/mainState';
import { useNavigate } from 'react-router-dom';
import { PatientHeader } from '@components/PatientHeader';

export const getMyRehabData = async (link: string, uid: string | null, setSelectedId: (id: string | null) => void) => {
	const customLink = link + `${uid ? `${uid}/` : 'my-rehab/'}`;
	const data = await apiGetQuery(customLink)  as MedicalRecord;
	setSelectedId(data?.measurements?.[0]?.uid ?? null);
	return data as MedicalRecord;
};

const MainPage: FC = observer(() => {
	const navigate = useNavigate();
	const { theme } = useTheme();
	const { linkRehab } = connectState;
	const { selectedRowUid, setSelectedRowUid } = mainState;
	const { token, isStaff } = authorizeState;

	const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const { data } = useQuery(['mainPage', linkRehab, token, selectedRowUid], () => getMyRehabData(linkRehab, selectedRowUid, setSelectedId), { keepPreviousData: true });

	const [selectedId, setSelectedId] = useState(data?.measurements?.[0]?.uid ?? null);

	if (!data) return null;

	const handleAddMedication = (newMedication: Omit<Medication, 'id'>) => {
		const medication: Medication = {
			...newMedication,
			uid: Date.now().toString(),
		};

		console.log(medication);
	};

	const getLastTaken = (medicationId: string) => {
		if (!data?.medications) return;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const medication = data?.medications?.find(med => med.uid === medicationId);

		return medication?.logs?.[0]?.date;
	};

	const handleClickBack = () => {
		setSelectedRowUid(null);
		navigate('/rehabilitation');
	};

	const patientInfo = {
		cost: data?.cost ?? '',
		name: data?.patient?.fullname ?? '',
		diagnosis: `${data?.name}, ${data?.description}`,
		patientId: data?.patient?.id ?? '',
		created_at: data?.created_at ?? '',
		end_date: data?.end_date ?? '',
		is_active: data?.is_active ?? false,
		duration: data?.duration ?? 0,
		doctors: data?.doctors,
	};

	return (
		<div
			className="min-h-screen"
			style={{ background: theme['--background'] }}
		>
			<Header />

			{selectedRowUid &&
				<button
					onClick={handleClickBack}
					style={{ background: theme['--primary'] }}
					className="fixed bottom-6 left-6 text-white rounded-full p-4 shadow-lg transition-colors"
				>
					<ArrowLeft className="w-6 h-6"/>
				</button>
			}

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<PatientHeader {...patientInfo} theme={theme} />

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold" style={{ color: theme['--text'] }}>
								Медикаменты
							</h2>
							{isStaff && (
								<button
									onClick={() => setIsAddModalOpen(true)}
									className="flex items-center space-x-2 px-4 py-2 rounded-lg"
									style={{ background: theme['--button'], color: theme['--white'] }}
								>
									<Plus className="w-5 h-5"/>
									<span>Добавить</span>
								</button>
							)}
						</div>

						<div className="space-y-4">
							{
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								data?.medications?.map((medication) => (
									<MedicationCard
										key={medication.uid}
										medication={medication}
										lastTaken={getLastTaken(medication.uid)}
										theme={theme}
										isDoctor={isStaff}
									/>
								))}
						</div>

						<MedicationHistory
							medications={data?.medications ?? []}
							theme={theme}
						/>
					</div>

					<div className="space-y-6">
						<h2 className="text-xl font-semibold" style={{ color: theme['--text'] }}>
							Показатели здоровья
						</h2>
						<VitalSignInput
							selectedId={selectedId}
							setSelectedId={setSelectedId}
							measurements={data?.measurements ?? []}
							theme={theme}
							isDoctor={isStaff}
						/>
						<VitalSignsHistory
							selectedId={selectedId}
							vitalSigns={data?.measurements ?? []}
							theme={theme}
						/>
					</div>
				</div>
			</main>

			<AddMedicationModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onAdd={handleAddMedication}
				theme={theme}
			/>

			<Chat
				theme={theme}
				isDoctor={isStaff}
				personName={data?.doctor_fullname ?? data?.fullname}
			/>
		</div>
	);
});

export default MainPage;
