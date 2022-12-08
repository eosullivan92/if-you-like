import React, { Context } from 'react'
import { useParams } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { getPost } from '../api/posts'
import { useContext, useMemo, useState, useEffect } from 'react'

interface PostContextType {
	post: PostType
	rootComments: CommentType[]
	getReplies: (parentId: string) => CommentType[]
	createLocalComment: (comment: CommentType) => void
	updateLocalComment: (id: string, comment: string) => void
	deleteLocalComment: (id: string) => void
	toggleLocalCommentLike: (id: string, addLike: boolean) => void
}

type Props = {
	children: React.ReactNode
}

type CommentGroup = {
	[key: string]: CommentType[]
}

// type CommentKey = keyof CommentGroup

export type PostType = {
	id: string
	title: string
	body: string
	comments?: CommentType[]
}

export type PostFormType = {
	title: string
	body: string
}

export type CommentType = {
	id: string
	message: string
	parentId?: string
	createdAt: string
	user: User
	likeCount: number
	likedByMe: boolean
}

export type User = {
	id: string
	name: string
}

const PostContext = React.createContext<Partial<PostContextType>>({})

export function usePost() {
	return useContext(PostContext)
}

export function PostProvider({ children }: Props) {
	const { id } = useParams()
	const { loading, error, value: post } = useAsync(() => getPost(id), [id])
	const [comments, setComments] = useState([])

	//group comments by parent id
	const commentsByParentId = useMemo(() => {
		// below is causing issues with getReplies function, as parentId can't be used as a key in an empty array
		// if (comments == null) return []
		const group: CommentGroup = {}
		comments.forEach((comment) => {
			//assigns group[parentId] to [] if right side is falsy i.e. first of that parentId in loop
			group[comment.parentId] ||= []
			group[comment.parentId].push(comment)
		})
		return group
	}, [comments])

	function getReplies(parentId: string) {
		return commentsByParentId[parentId as keyof CommentGroup]
	}

	function createLocalComment(comment: CommentType) {
		setComments((prevComments) => {
			return [comment, ...comments]
		})
	}

	function updateLocalComment(id: string, message: string) {
		setComments((prevComments) => {
			return prevComments.map((comment) =>
				comment.id == id ? { ...comment, message } : comment
			)
		})
	}

	function deleteLocalComment(id: string) {
		setComments((prevComments) => {
			return prevComments.filter((comment) => comment.id !== id)
		})
	}

	function toggleLocalCommentLike(id: string, addLike: boolean) {
		setComments((prevComments) => {
			return prevComments.map((comment) => {
				if (id == comment.id) {
					if (addLike) {
						return {
							...comment,
							likeCount: comment.likeCount + 1,
							likedByMe: true,
						}
					} else {
						return {
							...comment,
							likeCount: comment.likeCount - 1,
							likedByMe: false,
						}
					}
				} else {
					return comment
				}
			})
		})
	}
	useEffect(() => {
		if (post?.comments == null) return
		setComments(post.comments)
	}, [post?.comments])

	return (
		<PostContext.Provider
			value={{
				post: {
					id,
					...post,
				},
				rootComments: commentsByParentId['null'],
				getReplies,
				createLocalComment,
				updateLocalComment,
				deleteLocalComment,
				toggleLocalCommentLike,
			}}
		>
			{children}
		</PostContext.Provider>
	)
}
