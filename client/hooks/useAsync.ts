import { useCallback, useEffect, useState } from 'react'
import { Post } from '../context/PostContext'
// export type Post = {
// 	title: string
// 	body: string
// 	comments?: Comment[]
// }

// export type Comment = {
// 	id: string
// 	message: string
// 	parentId?: string
// 	createdAt: Date
// 	user: User
// }

// export type User = {
// 	id: string
// 	name: string
// }

export function useAsync(func: Function, dependencies: string[] = []) {
	// used in useEffect, execute runs immediately, reinvokes when dependencies change
	const { execute, ...state } = useAsyncInternal(func, dependencies, true)

	useEffect(() => {
		execute()
	}, [execute])

	return state
}

export function useAsyncFn(func: Function, dependencies: string[] = []) {
	//returns a function instead of running automatically
	return useAsyncInternal(func, dependencies, false)
}

export function useAsyncInternal(
	func: Function,
	dependencies?: string[],
	initialLoading = false
) {
	const [loading, setLoading] = useState<boolean>(initialLoading)
	const [error, setError] = useState<string>()
	const [value, setValue] = useState(undefined)

	const execute = useCallback((...params: any) => {
		setLoading(true)
		return func(...params)
			.then((data: Post[] | undefined) => {
				setValue(data)
				setError(undefined)
			})
			.catch((error: string) => {
				setValue(undefined)
				setError(error)
				return Promise.reject(error)
			})
			.finally(() => {
				setLoading(false)
			})
	}, dependencies)

	return { loading, error, value, execute }
}
