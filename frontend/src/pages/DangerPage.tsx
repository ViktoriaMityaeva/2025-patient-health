import React, { FC } from 'react';
import { useTheme } from '@theme/Theme.context';
import { Header } from '@components/Header';
import { useQuery } from 'react-query';
import { apiGetQuery } from '@api/api';
import connectState from '@store/connectState/connectState';
import authorizeState from '@store/authorizeState/authorizeState';
import { format, parseISO } from 'date-fns';

interface Danger {
	id: number;
	dateTime: string;
	message: string;
	readed: boolean;
	patien: {
		fullname: string;
	};
}

export const getDangerData = async (link: string) => {
	const data = await apiGetQuery(link);
	console.log(data);
	return data as Danger[];
};

const DangerPage: FC = () => {
	const { theme } = useTheme();
	const { token } = authorizeState;
	const { linkDangers } = connectState;

	const { data } = useQuery(['rehab', linkDangers, token],
		() => getDangerData(linkDangers), { keepPreviousData: true });

	console.log(data);
	return (
		<div className="min-h-screen" style={{ background: theme['--background'] }}>
			<Header/>

			<div className="container mx-auto px-4 py-8">
				<div className="rounded-lg shadow-sm p-6" style={{ background: theme['--card'] }}>
					<div className="flex items-center justify-between gap-2 mb-6">
						<div className="flex items-center gap-2">
							<h2 className="text-xl font-semibold" style={{ color: theme['--text'] }}>Опасные показатели</h2>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b" style={{ color: theme['--text'] }}>
									<th className="text-center py-3 px-4">Дата</th>
									<th className="text-center py-3 px-4">Пациент</th>
									<th className="text-center py-3 px-4">Сообщение</th>
									<th className="text-center py-3 px-4">Статус</th>
								</tr>
							</thead>
							<tbody>
								{data?.map((record) => (
									<tr
										key={record.id}
										className="border-b border-gray-100 transition-colors"
										style={{ color: theme['--text'] }}
										// onClick={() => handleRowClick(record)}
									>
										{/*<td className="py-4 px-4 text-center"><ExternalLink className="w-5 h-5 cursor-pointer"*/}
										{/*	style={{ color: theme['--text'] }}/>*/}
										{/*</td>*/}
										<td className="py-4 px-4 text-center">{format(parseISO(record.dateTime), 'dd.MM.yyyy HH:mm')}</td>
										<td className="py-4 px-4 font-medium text-center">{record.patien.fullname}</td>
										{/*<td className="py-4 px-4">*/}
										{/*	<div className="flex flex-col items-center gap-2">*/}
										{/*		<span className="text-center">{record.name}</span>*/}
										{/*		<span className="text-sm text-center">{record.description}</span>*/}
										{/*	</div>*/}
										{/*</td>*/}
										<td className="py-4 px-4 text-center">{record.message}</td>
										<td className="py-4 px-4 text-center">{record.readed ? 'Прочитано' : 'Не прочитано'}</td>

									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DangerPage;
