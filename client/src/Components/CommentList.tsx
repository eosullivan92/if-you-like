import React from 'react'
import Comment from './Comment'
import { CommentType } from '../../context/PostContext'

type PropsType = {
	comments: CommentType[]
}

export default function CommentList(props: PropsType) {
	console.log(props.comments)
	return (
		<>
			{props.comments.map((comment) => (
				<div key={comment.id} className="comment-stack">
					<Comment {...comment} />
				</div>
			))}
		</>
	)
}
