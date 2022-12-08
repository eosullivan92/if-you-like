import { createPost, getPosts } from '../../api/posts'
import { PostType } from '../../context/PostContext'

import { useAsync } from '../../hooks/useAsync'

type PostTitle = {
	id: string
	title: string
}

type PostListProps = {
	postList: PostType[]
	loading: boolean
	error: string
}

export const PostList = ({ postList, loading, error }: PostListProps) => {
	if (loading) return <h1>Loading</h1>
	if (error) return <h1 className="error">Error</h1>

	return (
		<>
			{postList?.map((post: PostTitle) => {
				return (
					<h1 key={post.id}>
						<a href={`/posts/${post.id}`}>{post.title}</a>
					</h1>
				)
			})}
		</>
	)
}
