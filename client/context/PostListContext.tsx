import React, { Context } from 'react'
import { useContext, useState, useEffect } from 'react'
import { useAsync } from '../hooks/useAsync'
import { getPosts } from '../api/posts'
import { PostType } from './PostContext'

interface PostListContextType {
	posts: PostTitle[]
	loading: boolean
	error: string
	createPostActive: boolean
	handleCreatePostActive: () => void
	createLocalPost: (post: PostTitle) => void
	updateLocalPost: (post: PostType) => void
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

export type PostFormType = {
	title: string
	body: string
}

type PostListType = PostTitle[] | undefined

const PostListContext = React.createContext<Partial<PostListContextType>>({})

export function usePostList() {
	return useContext(PostListContext)
}

export function PostListProvider({ children }: Props) {
	const [createPostActive, setCreatePostActive] = useState<boolean>(false)
	const { loading, error, value: postList } = useAsync(() => getPosts())
	const [posts, setPosts] = useState<PostListType>([])

	const handleCreatePostActive = () => {
		setCreatePostActive((prev) => !prev)
	}

	function createLocalPost(post: PostTitle) {
		setPosts((prevPosts) => {
			return [post, ...prevPosts]
		})
	}

	//TODO deleteLocalPost
	function deleteLocalPost(id: string) {
		setPosts((prevPosts) => {
			return prevPosts.filter((post) => post.id !== id)
		})
	}

	//TODO updateLocalPost
	function updateLocalPost(updatedPost: PostType) {
		setPosts((prevPosts) => {
			return prevPosts.map((post) => {
				if (post.id == updatedPost.id) {
					return {
						...post,
						title: updatedPost.title,
					}
				} else {
					return post
				}
			})
		})
	}

	//TODO move local post state from App to here

	useEffect(() => {
		if (postList === null) return
		setPosts(postList)
	}, [postList])

	return (
		<PostListContext.Provider
			value={{
				posts,
				loading,
				error,
				createPostActive,
				handleCreatePostActive,
				createLocalPost,
				deleteLocalPost,
				updateLocalPost,
			}}
		>
			{children}
		</PostListContext.Provider>
	)
}
