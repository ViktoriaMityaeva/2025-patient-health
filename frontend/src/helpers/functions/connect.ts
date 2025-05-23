import connectState from '@store/connectState/connectState';

export const serverPath = 'dr-ai.aizavod.ru';
// export const serverPath = 'turbohub';
// export const serverPath = 'localhost';

export const setConnections = () => {
	const mainPathAccount = `https://${serverPath}/auth-api/`;
	const mainPath = `https://${serverPath}/api/`;

	//Аккаунт
	connectState.setLinkLogin(`${mainPathAccount}login/`);
	connectState.setLinkLogout(`${mainPathAccount}logout/`);
	connectState.setLinkProfile(`${mainPathAccount}profile/`);
	connectState.setLinkDevices(`${mainPath}patient-devices/`);

	//Реабилитация
	connectState.setLinkRehab(`${mainPath}rehabs/`);
	connectState.setLinkAddRecord(`${mainPath}medication-records/`);
	connectState.setLinkDangers(`${mainPath}dangerous-measures/`);
};
