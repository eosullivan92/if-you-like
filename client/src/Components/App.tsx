import { useState } from 'react'
import { createPost, getPosts } from '../../api/posts'
import { Routes, Route } from 'react-router-dom'
import { PostList } from './PostList'
import { Post } from './Post'
import { PostProvider } from '../../context/PostContext'
import {
	PostListProvider,
	PostTitle,
	usePostList,
} from '../../context/PostListContext'
import { Header } from './Header'
import { PostForm } from './PostForm'
import { useAsyncFn } from '../../hooks/useAsync'
import { PostType } from '../../context/PostContext'
import { PostFormType } from '../../context/PostListContext'

function App() {
	// TODO: Bring this into it's own context, or PostList component?

	return (
		<div className="container">
			<Header />
			{/* <PostForm
				onSubmit={onPostCreate}
				loading={createPostLoading}
				error={createPostError}
				autoFocus
				createPostActive={createPostActive}
				handleCreatePostActive={handleCreatePostActive}
			/> */}
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
