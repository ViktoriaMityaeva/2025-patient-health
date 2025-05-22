import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { ThemeType } from '@theme/Theme.model';
import { ChatMessage } from '@store/mainState/interface';

const mockMessages: ChatMessage[] = [
	{
		id: '1',
		sender: 'doctor',
		message: 'Здравствуйте! Как вы себя чувствуете после приема новых лекарств?',
		timestamp: '2024-03-10T10:00:00',
		read: true
	},
	{
		id: '2',
		sender: 'patient',
		message: 'Добрый день! Головные боли уменьшились, но иногда кружится голова.',
		timestamp: '2024-03-10T10:05:00',
		read: true
	},
	{
		id: '3',
		sender: 'doctor',
		message: 'Это ожидаемый эффект в первые дни. Продолжайте прием и следите за давлением.',
		timestamp: '2024-03-10T10:07:00',
		read: false
	}
];

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
