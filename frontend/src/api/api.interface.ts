export interface ServerAns {
	status: number | null;
	statusText: string;
}

export interface ServerError {
	isError: boolean;
	name: string;
	isAborted: boolean;
	errorText: string;
}

export interface ServerData<T> {
	ans: ServerAns;
	error: ServerError;
	data?: T;
}
