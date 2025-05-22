export const checkNegativeServerAns = (status: number) => {
	const positivesAns: { [key: string]: boolean } = { 200: false, 201: false, 204: false };

	return positivesAns[`${status}`] === undefined;
};
