import { createComment } from '../../api/comments'
import { usePost } from '../../context/PostContext'
import { useAsyncFn } from '../../hooks/useAsync'
import CommentList from './CommentList'
import { CommentForm } from './CommentForm'

export const Post = () => {
	const { post, rootComments, createLocalComment } = usePost()

	const {
		loading,
		error,
		execute: createCommentFn,
	} = useAsyncFn(createComment)

	const onCommentCreate = (message: string) => {
		return createCommentFn({ postId: post.id, message }).then(
			createLocalComment
		)
	}
	return (
		<>
			<h1>{post.title}</h1>
			<article>{post.body}</article>
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
		</>
	)
}
