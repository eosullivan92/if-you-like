import React, { Context } from 'react'
import { useContext, useMemo, useState, useEffect } from 'react'
import { useAsync } from '../hooks/useAsync'
import { getPosts } from '../api/posts'
import { PostType } from './PostContext'

interface PostListContextType {
	postList: PostTitle[]
	createLocalPost: (post: PostType) => void
	updateLocalPost: (id: string, comment: string) => void
	deleteLocalPost: (id: string) => void
	toggleLocalPostLike: (id: string, addLike: boolean) => void
}

type Props = {
	children: React.ReactNode
}

export type PostTitle = {
	id: string
	title: string
}

const PostListContext = React.createContext<Partial<PostListContextType>>({})

export function usePostList() {
	return useContext(PostListContext)
}

export function PostListProvider({ children }: Props) {
	const { loading, error, value: postList } = useAsync(getPosts)
	const [posts, setPosts] = useState([])

	//TODO deleteLocalPost

	//TODO createLocalPost

	//TODO updateLocalPost

	//TODO move local post state from App to here

	useEffect(() => {
		if (postList === null) return
		setPosts(postList)
	}, [postList])

	return (
		<PostListContext.Provider value={{ postList }}>
			{children}
		</PostListContext.Provider>
	)
}
