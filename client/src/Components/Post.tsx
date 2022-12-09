import { useNavigate } from 'react-router-dom'
import { createComment } from '../../api/comments'
import { usePost } from '../../context/PostContext'
import { useAsyncFn } from '../../hooks/useAsync'
import CommentList from './CommentList'
import { CommentForm } from './CommentForm'
import { IconBtn } from './IconButton'
import { FaHeart, FaEdit, FaTrash, FaRegHeart } from 'react-icons/fa'
import { deletePost } from '../../api/posts'

export const Post = () => {
	const navigate = useNavigate()
	const { post, rootComments, createLocalComment } = usePost()
	const {
		loading,
		error,
		execute: createCommentFn,
	} = useAsyncFn(createComment)
	const deletePostFn = useAsyncFn(deletePost)

	const onCommentCreate = (message: string) => {
		return createCommentFn({ postId: post.id, message }).then(
			createLocalComment
		)
	}
	const onPostDelete = () => {
		return deletePostFn.execute(post.id).then(() => {
			//TODO CLEAR LOCAL (NEED CONTEXT)
			navigate('/')
		})
	}
	return (
		<div className="post">
			<h1>{post.title}</h1>
			<article>{post.body}</article>
			<div className="footer">
				<IconBtn
					Icon={FaRegHeart}
					aria-label="Like"
					// onClick={ontoggleCommentLike}
					// disabled={toggleCommentLikeFn.loading}
				>
					2
				</IconBtn>
				<IconBtn
					Icon={FaEdit}
					aria-label="edit"
					// onClick={() => setIsEditing((prev) => !prev)}
					// isActive={isEditing}
				/>
				<IconBtn
					Icon={FaTrash}
					aria-label="delete"
					onClick={onPostDelete}
					color="danger"
				/>
			</div>
			<h3 className="comments-title">Comments:</h3>
			<section>
				<CommentForm
					autoFocus
					loading={loading}
					error={error}
					onSubmit={onCommentCreate}
				/>
				{rootComments != null && rootComments.length > 0 && (
					<div className="mt-4">
						<CommentList comments={rootComments} />
					</div>
				)}
			</section>
		</div>
	)
}
