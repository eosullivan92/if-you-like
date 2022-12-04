import React from 'react'
import Comment from './Comment'
import { CommentType } from '../../context/PostContext'

type PropsType = {
	comments: CommentType[]
}

export default function CommentList(props: PropsType) {
	return (
		<>
			{props.comments.map((comment) => (
				<div key={comment.id} className="comment-stack">
					<Comment
						id={comment.id}
						createdAt={comment.createdAt}
						message={comment.message}
						user={comment.user}
						likeCount={comment.likeCount}
						likedByMe={comment.likedByMe}
					/>
				</div>
			))}
		</>
	)
}
