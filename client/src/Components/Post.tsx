import { useEffect, useState } from 'react'
import { getPosts } from '../../api/posts'
import { usePost } from '../../context/PostContext'
import CommentList from './CommentList'

export const Post = () => {
	const { post, rootComments, createLocalComment } = usePost()
	console.log(rootComments)
	return (
		<>
			<h1>{post.title}</h1>
			<article>{post.body}</article>
			<h3 className="comments-title">Comments:</h3>
			<section>
				{/* <CommentForm
					loading={loading}
					error={error}
					onSubmit={onCommentCreate}
				/> */}
				{rootComments != null && rootComments.length > 0 && (
					<div className="mt-4">
						<CommentList comments={rootComments} />
					</div>
				)}
			</section>
		</>
	)
}
