import { makeAutoObservable } from 'mobx';

class ConnectsState {
	//Аккаунт
	linkLogin = '';
	linkLogout = '';
	linkProfile = '';
	linkDevices = '';

	//Реабилитация
	linkRehab = '';
	linkAddRecord = '';
	linkDangers = '';

	constructor() {
		makeAutoObservable(this);
	}

	//Аккаунт
	setLinkLogin = (url = '') => {
		this.linkLogin = url;
	};
	setLinkLogout = (url = '') => {
		this.linkLogout = url;
	};
	setLinkProfile = (url = '') => {
		this.linkProfile = url;
	};
	setLinkDevices = (url = '') => {
		this.linkDevices = url;
	};

	//Реабилитация
	setLinkRehab = (url = '') => {
		this.linkRehab = url;
	};
	setLinkAddRecord = (url = '') => {
		this.linkAddRecord = url;
	};
	setLinkDangers = (url = '') => {
		this.linkDangers = url;
	};
}
const connectState = new ConnectsState();
export default connectState;
