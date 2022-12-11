import { useState } from 'react'
import { FaHeart, FaEdit, FaTrash, FaRegHeart } from 'react-icons/fa'
import { IconBtn } from './IconButton'
import { PostTitle, usePostList } from '../../context/PostListContext'
import { PostForm } from './PostForm'
import { PostFormType } from '../../context/PostListContext'
import { useAsyncFn } from '../../hooks/useAsync'
import { createPost, deletePost, updatePost } from '../../api/posts'

export const PostList = () => {
	const [createPostActive, setCreatePostActive] = useState<boolean>(false)

	const { loading, error, posts, createLocalPost } = usePostList()
	const createPostFn = useAsyncFn(createPost)

	if (loading) return <h1>Loading</h1>
	if (error) return <h1 className="error">Error</h1>

	const handleCreatePostActive = () => {
		setCreatePostActive((prev) => !prev)
	}

	const onPostCreate = (title: string, body: string) => {
		return createPostFn.execute({ title, body }).then((post: PostTitle) => {
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
				loading={createPostFn.loading}
				error={createPostFn.error}
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
								Icon={FaRegHeart}
								aria-label="Like"
								// onClick={ontoggleCommentLike}
								// disabled={toggleCommentLikeFn.loading}
							>
								2
							</IconBtn>
						</div>
					</div>
				)
			})}
		</>
	)
}
