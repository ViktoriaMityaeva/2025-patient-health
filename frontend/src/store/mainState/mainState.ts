import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { ThemeType } from '@theme/Theme.model';
import { ChatMessage } from '@store/mainState/interface';

const mockMessages: ChatMessage[] = [];

class MainState {
	themeState: ThemeType = 'dark';
	messages: ChatMessage[] = mockMessages;
	selectedRowUid: string | null = null;
	medications: any[] = [];

	constructor() {
		makeAutoObservable(this);

		makePersistable(this, {
			name: 'MainStore',
			properties: ['themeState', 'messages', 'medications'],
			storage: window.localStorage,
		});
	}

	setTheme = (theme: ThemeType) => {
		this.themeState = theme;
	};

	setMessages = (newMessage: ChatMessage) => {
		this.messages = [...this.messages, newMessage];
	};

	setSelectedRowUid = (uid: string | null) => {
		this.selectedRowUid = uid;
	};

	setNewMedication = (newMedications: any) => {
		this.medications = newMedications;
	};
}

export default new MainState();
