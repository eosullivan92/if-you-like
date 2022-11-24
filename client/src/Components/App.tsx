import { Routes, Route } from 'react-router-dom'
import { PostList } from './PostList'
import { Post } from './Post'

function App() {
	return (
		<div className="container">
			<Routes>
				<Route path="/" element={<PostList />} />
				<Route path="/posts/:id" element={<Post />} />
			</Routes>
		</div>
	)
}

export default App
