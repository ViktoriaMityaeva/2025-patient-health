import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { AuthData, User } from '@store/authorizeState/interface';

const getIsAuthorize = (): boolean => {
	const authData = localStorage.getItem('isAuthorize');

	if (authData !== null) {
		const parsedAuthData: AuthData = JSON.parse(authData);
		return parsedAuthData.isAuthorize;
	}
	return false;
};

class AuthorizeState {
	demoUserInf: User = {
		id: 1,
		first_name: '',
		last_name: '',
		email: '',
		phone: '',
		isStaff: true,
		isSuperuser: false,
		username: 'admin',
		role: 'admin',
		image: '',
		dateJoined: '',
		password: '',
	};

	userName = '';
	isStaff = false;
	userData = this.demoUserInf;

	token = '';

	isAutorize =  false;

	constructor() {
		makeAutoObservable(this);

		makePersistable(this, {
			name: 'AuthStore',
			properties: ['isAutorize', 'token', 'userName', 'isStaff'],
			storage: window.localStorage,
		});

		this.isAutorize = getIsAuthorize();
	}

	setAuthorize = (isAuthorize = false) => {
		this.isAutorize = isAuthorize;
	};

	setToken = (token: string) => {
		this.token = token;
	};

	setUsername = (username: string) => {
		this.userName = username;
	};

	setIsStaff = (isStaff: boolean) => {
		this.isStaff = isStaff;
	};

	setUserData = (userData: User) => {
		this.userData = userData;
	};
}

export default new AuthorizeState();
