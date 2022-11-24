import { useEffect, useState } from 'react'
import { getPosts } from '../../api/posts'
import { useAsync } from '../../hooks/useAsync'

type PostTitle = {
	id: string
	title: string
}

export const PostList = () => {
	const { loading, error, value: posts } = useAsync(getPosts)

	if (loading) return <h1>Loading</h1>
	if (error) return <h1 className="error">Error</h1>

	return posts?.map((post: PostTitle) => {
		return (
			<h1 key={post.id}>
				<a href={`/posts/${post.id}`}>{post.title}</a>
			</h1>
		)
	})
}
