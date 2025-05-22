import React, { useState } from 'react';
import { Activity, Plus } from 'lucide-react';
import { Theme } from '@theme/Theme.model';
import { Modal } from '@components/Modal';
import { DeviceChart } from '@components/DeviceChart';
import { DevicePatient } from '@store/authorizeState/interface';
import { serverPath } from '@helpers/functions/connect';

interface MedicalInfoProps {
	isDoctor?: boolean;
	device: DevicePatient[];
	theme: Theme;
}

const firstData = [
	{ time: '00:00', value: 120 },
	{ time: '04:00', value: 135 },
	{ time: '08:00', value: 150 },
	{ time: '12:00', value: 130 },
	{ time: '16:00', value: 125 },
	{ time: '20:00', value: 140 },
	{ time: '24:00', value: 135 },
];

const secondData = [
	{ time: '00:00', value: 110 },
	{ time: '04:00', value: 125 },
	{ time: '08:00', value: 140 },
	{ time: '12:00', value: 120 },
	{ time: '16:00', value: 115 },
	{ time: '20:00', value: 130 },
	{ time: '24:00', value: 125 },
];

const devices = [
	{
		id: 1,
		name: 'Холтер',
		data: firstData,
	},
	{
		id: 2,
		name: 'Датчик непрерывного мониторинга глюкозы',
		data: secondData,
	}];

export const MedicalInfo: React.FC<MedicalInfoProps> = ({ isDoctor = false, device, theme }) => {
	if (isDoctor) return;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState(devices[0]);

	const handleDeviceClick = (isFirst: boolean) => {
		setIsModalOpen(true);

		setModalType(isFirst ? devices[0] : devices[1]);
	};

	const ItemDevice = ({ deviceItem }: { deviceItem: DevicePatient}) => {
		const { device } = deviceItem;
		const { name, photo } = device;

		return (
			<div
				className="rounded-xl p-4 cursor-pointer" style={{ background: theme['--background'] }}
				onClick={() => handleDeviceClick(true)}>

				<div className="flex items-center space-x-3 mb-2">
					<Activity className="min-w-5 h-5" style={{ color: theme['--text'] }}/>
					<span className="font-medium" style={{ color: theme['--text'] }}>{name}</span>
				</div>

				<img className="w-30 h-30" src={`http://${serverPath}/${photo}`} alt=""/>
			</div>
		);
	};

	return (
		<div className="rounded-2xl p-6 shadow-sm" style={{ background: theme['--card'] }}>
			<h3 className="flex items-center justify-between text-lg font-semibold mb-4"
				style={{ color: theme['--text'] }}>
				{isDoctor ? 'Специализация и опыт' : 'Подключенные устройства'}

				<button
					className="w-10 h-10 rounded-full flex items-center justify-center"
					style={{ background: theme['--primary'] }}>
					<Plus className="w-5 h-5" style={{ color: theme['--white'] }}/>
				</button>
			</h3>

			{isDoctor ? (
				<div className="space-y-4">
					<div className="border-b pb-4">
						<h4 className="font-medium text-gray-900 mb-2">Специализация</h4>
						<p className="text-gray-600">Кардиология, аритмология, УЗИ сердца</p>
					</div>
					<div className="border-b pb-4">
						<h4 className="font-medium text-gray-900 mb-2">Опыт работы</h4>
						<p className="text-gray-600">15 лет практики</p>
					</div>
					<div className="border-b pb-4">
						<h4 className="font-medium text-gray-900 mb-2">Образование</h4>
						<p className="text-gray-600">РНИМУ им. Пирогова, 2008</p>
						<p className="text-gray-600">Кандидат медицинских наук</p>
					</div>
					<div>
						<h4 className="font-medium text-gray-900 mb-2">Сертификаты</h4>
						<div className="flex flex-wrap gap-2">
							<span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">Кардиология</span>
							<span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">УЗИ</span>
							<span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">ЭКГ</span>
						</div>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{device.map((device) => (
						<ItemDevice key={device.id} deviceItem={device} />
					))}
				</div>
			)}

			<Modal
				isOpen={isModalOpen}
				theme={theme}
				onClose={() => setIsModalOpen(false)}
				title="Данные устройства"
			>
				<DeviceChart modalType={modalType} />
			</Modal>
		</div>
	);
};
