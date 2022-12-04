import { CommentType, User } from '../../context/PostContext'
import { CommentForm } from './CommentForm'
import { useState } from 'react'
import { usePost } from '../../context/PostContext'
import { FaHeart, FaReply, FaEdit, FaTrash, FaRegHeart } from 'react-icons/fa'
import { IconBtn } from './IconButton'
import CommentList from './CommentList'
import { useUser } from '../../hooks/useUser'
import { useAsyncFn } from '../../hooks/useAsync'
import { createComment, deleteComment, updateComment } from '../../api/comments'

type CommentProps = {
	id: string
	message: string
	user: User
	createdAt: string
	likeCount?: number
	likedByMe?: boolean
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
	dateStyle: 'medium',
	timeStyle: 'short',
})

export default function Comment({ id, message, createdAt }: CommentProps) {
	const [areChildrenHidden, setAreChildrenHidden] = useState<boolean>(false)
	const [isReplying, setIsReplying] = useState<boolean>(false)
	const [isEditing, setIsEditing] = useState<boolean>(false)
	const {
		post,
		getReplies,
		createLocalComment,
		updateLocalComment,
		deleteLocalComment,
		toggleLocalCommentLike,
	} = usePost()
	const childComments = getReplies(id)
	const currentUser = useUser()
	const createCommentFn = useAsyncFn(createComment)
	const updateCommentFn = useAsyncFn(updateComment)
	const deleteCommentFn = useAsyncFn(deleteComment)

	function onCommentReply(message: string) {
		return createCommentFn
			.execute({
				postId: post.id,
				message,
				parentId: id,
			})
			.then((comment: CommentType) => {
				setIsReplying(false)
				createLocalComment(comment)
			})
	}

	function onCommentUpdate(message: string) {
		return updateCommentFn
			.execute({ postId: post.id, message, id })
			.then((comment: CommentType) => {
				setIsEditing(false)
				updateLocalComment(id, comment.message)
			})
	}

	function onCommentDelete() {
		return deleteCommentFn
			.execute({ postId: post.id, id })
			.then(({ id }: { id: string }) => {
				deleteLocalComment(id)
			})
	}

	return (
		<>
			<div className="comment">
				<div className="header">
					<span className="name">User Name</span>
					<span className="date">
						{dateFormatter.format(Date.parse(createdAt))}
					</span>
				</div>

				{isEditing ? (
					<CommentForm
						autoFocus
						onSubmit={onCommentUpdate}
						loading={updateCommentFn.loading}
						error={updateCommentFn.error}
						initialValue={message}
					/>
				) : (
					<div className="message">{message}</div>
				)}
				<div className="footer">
					<IconBtn Icon={FaHeart} aria-label="like">
						2
					</IconBtn>
					<IconBtn
						Icon={FaReply}
						aria-label="reply"
						onClick={() => setIsReplying((prev) => !prev)}
						isActive={isReplying}
					/>
					<IconBtn
						Icon={FaEdit}
						aria-label="edit"
						onClick={() => setIsEditing((prev) => !prev)}
						isActive={isEditing}
					/>
					<IconBtn
						Icon={FaTrash}
						aria-label="delete"
						onClick={onCommentDelete}
						color="danger"
					/>
					{deleteCommentFn.error && (
						<div className="error-msg mt-1">
							{deleteCommentFn.error}
						</div>
					)}
					{isReplying && (
						<div className="mt-1 ml-3">
							<CommentForm
								autoFocus
								onSubmit={onCommentReply}
								loading={createCommentFn.loading}
								error={createCommentFn.error}
							/>
						</div>
					)}
					{childComments?.length > 0 && (
						<>
							<div
								className={`nested-comment-stack ${
									areChildrenHidden ? 'hide' : ''
								}`}
							>
								<button
									className="collapse-line"
									area-label="Hide Replies"
									onClick={() => setAreChildrenHidden(true)}
								></button>
								<div className="nested-comments">
									<CommentList comments={childComments} />
								</div>
							</div>
							<button
								className={`btn mt1 ${
									!areChildrenHidden ? 'hide' : ''
								}`}
								onClick={() => setAreChildrenHidden(false)}
							>
								Show Replies
							</button>
						</>
					)}
				</div>
			</div>
		</>
	)
}
