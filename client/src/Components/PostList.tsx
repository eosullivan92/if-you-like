import { useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import { IconBtn } from './IconButton'
import { PostTitle, usePostList } from '../../context/PostListContext'
import { PostForm } from './PostForm'
import { PostFormType } from '../../context/PostListContext'
import { useAsyncFn } from '../../hooks/useAsync'
import { createPost } from '../../api/posts'

export const PostList = () => {
	const [createPostActive, setCreatePostActive] = useState<boolean>(false)
	const { loading, error, posts, createLocalPost } = usePostList()
	const {
		loading: createPostLoading,
		error: createPostError,
		execute: createPostFn,
	} = useAsyncFn(createPost)
	if (loading) return <h1>Loading</h1>
	if (error) return <h1 className="error">Error</h1>

	const handleCreatePostActive = () => {
		setCreatePostActive((prev) => !prev)
	}

	const onPostCreate = (post: PostFormType) => {
		return createPostFn(post).then((post: PostTitle) => {
			createLocalPost(post)
		})
	}

	return (
		<>
			<button className="btn" onClick={handleCreatePostActive}>
				+ Create Post
			</button>
			<PostForm
				onSubmit={onPostCreate}
				loading={createPostLoading}
				error={createPostError}
				autoFocus
				createPostActive={createPostActive}
				handleCreatePostActive={handleCreatePostActive}
			/>
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
