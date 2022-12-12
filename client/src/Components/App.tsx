import { Routes, Route } from 'react-router-dom'
import { PostList } from './PostList'
import { Post } from './Post'
import { PostProvider } from '../../context/PostContext'
import { PostListProvider } from '../../context/PostListContext'
import { Header } from './Header'

function App() {
	return (
		<div className="container">
			<Header />
			<PostListProvider>
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
			</PostListProvider>
		</div>
	)
}

export default App
