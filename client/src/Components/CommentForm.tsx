import React, { FormEventHandler, useState } from 'react'
import { CommentType } from '../../context/PostContext'

type CommentFormProps = {
	loading: boolean
	error: string
	onSubmit: (message: string) => Promise<CommentType>
	autoFocus: boolean
	initialValue?: string
}

export function CommentForm({
	loading,
	error,
	onSubmit,
	autoFocus = false,
	initialValue = '',
}: CommentFormProps) {
	const [message, setMessage] = useState<string>(initialValue)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit(message).then(() => setMessage(''))
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="comment-form-row">
				<textarea
					autoFocus={autoFocus}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className="message-input"
				/>
				<button className="btn" disabled={loading}>
					{loading ? 'Loading' : 'Post'}
				</button>
			</div>
			<div className="error-msg">{error}</div>
		</form>
	)
}
