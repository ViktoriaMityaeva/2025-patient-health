import React, { FC } from 'react';
import { useTheme } from '@theme/Theme.context';
import authorizeState from '@store/authorizeState/authorizeState';
import { ProfileCard } from '@components/ProfileCard';
import { AppointmentsCard } from '@components/AppointmentsCard';
import { Header } from '@components/Header';
import { apiGetQuery } from '@api/api';
import { useQuery } from 'react-query';
import connectState from '@store/connectState/connectState';
import { ProfileServer } from '@store/authorizeState/interface';
import { MedicalInfo } from '@components/MedicalInfo';

export const getProfileData = async (link: string) => {
	const data = await apiGetQuery(link);
	return data as ProfileServer;
};

const AccountPage: FC = () => {
	const { theme } = useTheme();
	const { isStaff, token } = authorizeState;
	const { linkProfile } = connectState;

	const { data } = useQuery(['profile', linkProfile, token],
		() => getProfileData(linkProfile), { keepPreviousData: true });

	console.log(data);

	return (
		<div
			className="min-h-screen "
			style={{ background: theme['--background'] }}
		>
			<Header />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-1">
						{data && <ProfileCard data={data} isDoctor={isStaff} theme={theme} /> }
					</div>

					<div className="lg:col-span-2 space-y-8">
						<MedicalInfo device={data?.patient_devices ?? []} isDoctor={isStaff} theme={theme} />
						<AppointmentsCard isDoctor={isStaff} theme={theme} />
					</div>
				</div>
			</main>
		</div>
	);
};

export default AccountPage;
