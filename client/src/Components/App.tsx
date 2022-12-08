import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { PostList } from './PostList'
import { Post } from './Post'
import { PostProvider } from '../../context/PostContext'
import { Header } from './Header'
import { PostForm } from './PostForm'
import { useAsyncFn } from '../../hooks/useAsync'
import { createPost } from '../../api/posts'
import { PostFormType } from '../../context/PostContext'

function App() {
	const [createPostActive, setCreatePostActive] = useState<boolean>(false)

	const { loading, error, execute: createPostFn } = useAsyncFn(createPost)

	const onPostCreate = (post: PostFormType) => {
		console.log(post)
		return createPostFn(post).then(
			(post: { id: string; title: string }) => {
				console.log(post)
			}
		)
	}

	const handleCreatePostActive = () => {
		setCreatePostActive((prev) => !prev)
	}

	return (
		<div className="container">
			<Header handleCreatePostActive={handleCreatePostActive} />
			<PostForm
				onSubmit={onPostCreate}
				loading={loading}
				error={error}
				autoFocus
				createPostActive={createPostActive}
				handleCreatePostActive={handleCreatePostActive}
			/>
			<Routes>
				<Route path="/" element={<PostList />} />
				<Route
					path="/posts/:id"
					element={
						<PostProvider>
							<Post />
						</PostProvider>
					}
				/>
			</Routes>
		</div>
	)
}

export default App
