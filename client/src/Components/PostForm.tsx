import { useState } from 'react'
import { Post, PostFormType } from '../../context/PostContext'

type PostFormProps = {
	loading: boolean
	error: string
	onSubmit: (post: PostFormType) => Promise<Post>
	autoFocus: boolean
	createPostActive: boolean
	handleCreatePostActive: () => void
}

export const PostForm = ({
	loading,
	error,
	onSubmit,
	autoFocus,
	createPostActive,
	handleCreatePostActive,
}: PostFormProps) => {
	const [postInput, setPostInput] = useState<PostFormType>({
		title: '',
		body: '',
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log(postInput)
		onSubmit(postInput).then(() => {
			setPostInput({
				title: '',
				body: '',
			})
			handleCreatePostActive()
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
						onChange={(e) =>
							setPostInput({
								...postInput,
								title: e.target.value,
							})
						}
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
