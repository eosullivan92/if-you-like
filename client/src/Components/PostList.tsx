import { FaHeart } from 'react-icons/fa'
import { IconBtn } from './IconButton'
import { PostTitle, usePostList } from '../../context/PostListContext'

export const PostList = () => {
	const { loading, error, posts } = usePostList()
	if (loading) return <h1>Loading</h1>
	if (error) return <h1 className="error">Error</h1>
	return (
		<>
			{posts?.map((post: PostTitle) => {
				return (
					<div className="post-title" key={post.id}>
						<h1>
							<a href={`/posts/${post.id}`}>{post.title}</a>
						</h1>
						<div className="footer">
							<IconBtn
								Icon={FaHeart}
								aria-label="Like"
								// onClick={ontoggleCommentLike}
								// disabled={toggleCommentLikeFn.loading}
							/>
						</div>
					</div>
				)
			})}
		</>
	)
}
