import axios from 'axios'

type RequestOptions = {
	method?: string
	data?: RequestData
}

type RequestData = {
	message?: string
	parentId?: string
}

const api = axios.create({
	// baseURL: import.meta.env.VITE_SERVER_URL,
	baseURL: process.env.VITE_SERVER_URL,
})

export function makeRequest(url: string, options?: RequestOptions) {
	return api(url, options)
		.then((res) => res.data)
		.catch((error) =>
			Promise.reject(error?.response?.data?.message ?? 'error')
		)
}
