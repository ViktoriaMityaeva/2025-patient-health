import React, { FC } from 'react';
import { useTheme } from '@theme/Theme.context';
import { Header } from '@components/Header';
import { MedicalHistory } from '@components/MedicalHistory';
import { MedicalRecord } from '@store/mainState/interface';
import { useQuery } from 'react-query';
import { apiGetQuery } from '@api/api';
import connectState from '@store/connectState/connectState';
import authorizeState from '@store/authorizeState/authorizeState';

export const getRehabData = async (link: string) => {
	const data = await apiGetQuery(link);
	return data as MedicalRecord[];
};

const RehabPage: FC = () => {
	const { theme } = useTheme();
	const { token, isStaff } = authorizeState;
	const { linkRehab } = connectState;

	const { data } = useQuery(['rehab', linkRehab, token],
		() => getRehabData(linkRehab), { keepPreviousData: true });

	return (
		<div className="min-h-screen" style={{ background: theme['--background'] }}>
			<Header/>

			<div className="container mx-auto px-4 py-8">
				{data && <MedicalHistory records={data} theme={theme} isDoctor={isStaff}/> }
			</div>
		</div>
	);
};

export default RehabPage;
