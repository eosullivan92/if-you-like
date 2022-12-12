import { useState } from 'react'
import { PostType } from '../../context/PostContext'
import { PostFormType } from '../../context/PostListContext'

type PostFormProps = {
	loading: boolean
	error: string
	onSubmit: (title: string, body: string) => Promise<PostFormType>
	autoFocus: boolean
	createPostActive?: boolean
	handleCreatePostActive?: () => void
	initialValue?: PostFormType
}

export const PostForm = ({
	loading,
	error,
	onSubmit,
	autoFocus,
	createPostActive,
	handleCreatePostActive,
	initialValue = { title: '', body: '' },
}: PostFormProps) => {
	const [postInput, setPostInput] = useState<PostFormType>(initialValue)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit(postInput.title, postInput.body).then(() => {
			setPostInput({
				title: '',
				body: '',
			})
		})
	}

	return (
		<div className={`post-form-modal ${createPostActive ? '' : 'hide'}`}>
			<form onSubmit={handleSubmit}>
				<div className="comment-form-row">
					<label htmlFor="title" />
					<input
						type="text"
						id="title"
						name="title"
						placeholder="Title"
						autoFocus={autoFocus}
						onChange={(e) =>
							setPostInput({
								...postInput,
								title: e.target.value,
							})
						}
						value={postInput.title}
					/>
					<textarea
						onChange={(e) =>
							setPostInput({
								...postInput,
								body: e.target.value,
							})
						}
						className="message-input"
						aria-label="text-input"
						value={postInput.body}
					/>
					<button
						className="btn"
						disabled={loading}
						aria-label="submit-btn"
					>
						{loading ? 'Loading' : 'Post'}
					</button>
				</div>
				<div className="error-msg">{error}</div>
			</form>
		</div>
	)
}
