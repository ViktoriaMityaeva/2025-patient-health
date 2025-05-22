import { checkNegativeServerAns } from '@helpers/functions/helpFunctions';
import authorizeState from '@store/authorizeState/authorizeState';
import { ServerData, ServerError } from './api.interface';

type ApiGetQuery = <T>(url: string) => Promise<T>;
export const apiGetQuery: ApiGetQuery = async (url) => {
	const { token, setAuthorize, setToken } = authorizeState;

	const options: RequestInit = {
		method: 'GET',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Token ${token}`,
		},
	};

	const answer = await fetch(url, options);
	const { status } = answer;

	if (status === 401) {
		setAuthorize(false);
		setToken('');
	}

	return answer.json();
};

type ApiCatchError = (error: Error) => ServerError;
export const apiCatchError: ApiCatchError = (error) => {
	const { name, message: errorText } = error as Error;
	const isAborted = name === 'AbortError';

	return { isError: true, name, errorText, isAborted };
};

export const getServerData = <T>(data: T): ServerData<T> => ({
	ans: { status: null, statusText: '' },
	error: { isError: false, name: '', isAborted: false, errorText: '' },
	data,
});

type ApiPostAuthorize = <T> (url: string, parameters: object, returnType: T ) => Promise<ServerData<T>>;
export const apiPostAuthorize: ApiPostAuthorize = async (url = '', parameters = {}, returnType) => {
	const serverData = getServerData(returnType);

	const options: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify(parameters),
	};

	try {
		const answer = await fetch(url, options);

		const { status, statusText } = answer;
		const { ans } = serverData;
		serverData.ans = { ...ans, status, statusText };

		if (checkNegativeServerAns(status)) {
			throw new Error(`Ошибка запроса ${status}: ${statusText}`);
		}

		serverData.data = await answer.json();

	} catch (error) {
		serverData.error = apiCatchError(error as Error);
	}

	return serverData;
};
