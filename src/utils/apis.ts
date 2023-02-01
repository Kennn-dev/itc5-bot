import axios, { RawAxiosRequestConfig } from 'axios';

export async function axiosRequest<T = any>(options: RawAxiosRequestConfig<any>): Promise<T> {
	let result = null;
	try {
		const res = await axios.request(options);
		result = res.data;
	} catch (error) {
		console.error(error);
		result = null;
	}

	return result;
}
