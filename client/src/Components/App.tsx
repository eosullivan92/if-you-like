import { useEffect, useState } from 'react'
import { createPost, getPosts } from '../../api/posts'
import { useAsync } from '../../hooks/useAsync'
import { Routes, Route } from 'react-router-dom'
import { PostList } from './PostList'
import { Post } from './Post'
import { PostProvider } from '../../context/PostContext'
import { PostListProvider } from '../../context/PostListContext'
import { Header } from './Header'
import { PostForm } from './PostForm'
import { useAsyncFn } from '../../hooks/useAsync'
import { PostFormType, PostType } from '../../context/PostContext'

function App() {
	// TODO: Bring this into it's own context, or PostList component?
	const {
		loading: createPostLoading,
		error: createPostError,
		execute: createPostFn,
	} = useAsyncFn(createPost)

	const [createPostActive, setCreatePostActive] = useState<boolean>(false)

	const onPostCreate = (post: PostFormType) => {
		console.log(post)
		return createPostFn(post).then(
			(post: { id: string; title: string }) => {
				// setLocalPosts((prevPosts) => [post, ...posts])
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
				loading={createPostLoading}
				error={createPostError}
				autoFocus
				createPostActive={createPostActive}
				handleCreatePostActive={handleCreatePostActive}
			/>
			<Routes>
				<Route
					path="/"
					element={
						<PostListProvider>
							<PostList />
						</PostListProvider>
					}
				/>
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
