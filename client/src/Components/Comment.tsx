import { CommentType } from '../../context/PostContext'
import { useState } from 'react'
import { usePost } from '../../context/PostContext'
import { FaHeart, FaReply, FaEdit, FaTrash, FaRegHeart } from 'react-icons/fa'
import { IconBtn } from './IconButton'
import CommentList from './CommentList'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
	dateStyle: 'medium',
	timeStyle: 'short',
})

export default function Comment({ id, message, user, createdAt }: CommentType) {
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
					// <CommentForm
					// 	autoFocus
					// 	onSubmit={onCommentUpdate}
					// 	loading={updateCommentFn.loading}
					// 	error={updateCommentFn.error}
					// 	initialValue={message}
					// />
					<div>comment form placeholder</div>
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
						isActive={isReplying}
					/>
					<IconBtn
						Icon={FaEdit}
						aria-label="edit"
						isActive={isEditing}
					/>
					<IconBtn
						Icon={FaTrash}
						aria-label="delete"
						color="danger"
					/>
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
