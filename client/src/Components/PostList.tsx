import { PostType } from '../../context/PostContext'
import { FaHeart } from 'react-icons/fa'
import { IconBtn } from './IconButton'

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
