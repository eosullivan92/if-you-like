import React from 'react'
import { useParams } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { getPost } from '../api/posts'
import { useContext, useMemo, useState, useEffect } from 'react'

interface PostContextType {
	post: Post
	getReplies: (parentId: string) => Comment[]
	createLocalComment: (comment: Comment) => void
	updateLocalComment: (comment: Comment) => void
	deleteLocalComment: (comment: Comment) => void
	toggleLocalCommentLike: (id: string, addLike: boolean) => void
}

type Props = {
	children: React.ReactNode
}

type CommentGroup = {
	[key: string]: Comment[]
}

type CommentKey = keyof CommentGroup

export type Post = {
	title: string
	body: string
	comments?: Comment[]
}

export type Comment = {
	id: string
	message: string
	parentId?: string
	createdAt: Date
	user: User
}

export type User = {
	id: string
	name: string
}

const Context = React.createContext<PostContextType | null>(null)

export function usePost() {
	return useContext(Context)
}

export function PostProvider({ children }: Props) {
	const { id } = useParams()
	const { loading, error, value: post } = useAsync(() => getPost(id), [id])
	const [comments, setComments] = useState([])

	//group comments by parent id
	const commentsByParentId = useMemo(() => {
		//below is causing issues with getReplies function, as parentId can't be used as a key in an empty array
		// if (comments == null) return []
		const group: CommentGroup = {}
		comments.forEach((comment) => {
			group[comment.parentId] ||= []
			group[comment.parentId].push(comment)
		})
		return group
	}, [comments])

	function getReplies(parentId: string) {
		return commentsByParentId[parentId as CommentKey]
	}
}
