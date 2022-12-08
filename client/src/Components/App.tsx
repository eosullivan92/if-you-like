import { useEffect, useState } from 'react'
import { createPost, getPosts } from '../../api/posts'

import { useAsync } from '../../hooks/useAsync'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { PostList } from './PostList'
import { Post } from './Post'
import { PostProvider } from '../../context/PostContext'
import { Header } from './Header'
import { PostForm } from './PostForm'
import { useAsyncFn } from '../../hooks/useAsync'
import { PostFormType, PostType } from '../../context/PostContext'

function App() {
	// TODO: Bring this into it's own context

	const {
		loading: getPostLoading,
		error: getPostError,
		value: posts,
	} = useAsync(getPosts)
	const {
		loading: createPostLoading,
		error: createPostError,
		execute: createPostFn,
	} = useAsyncFn(createPost)
	const [createPostActive, setCreatePostActive] = useState<boolean>(false)
	const [localPosts, setLocalPosts] = useState<PostType[]>([])

	const onPostCreate = (post: PostFormType) => {
		console.log(post)
		return createPostFn(post).then(
			(post: { id: string; title: string }) => {
				setLocalPosts((prevPosts) => [post, ...posts])
			}
		)
	}

	const handleCreatePostActive = () => {
		setCreatePostActive((prev) => !prev)
	}

	useEffect(() => {
		setLocalPosts(posts)
	}, [posts])

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
						<PostList
							postList={localPosts}
							loading={getPostLoading}
							error={getPostError}
						/>
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
