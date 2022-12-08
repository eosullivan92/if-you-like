import axios from 'axios'
import { makeRequest } from './makeRequest'
import { PostFormType } from '../context/PostContext'

export function getPosts() {
	return makeRequest('/posts')
}

export function getPost(id: string) {
	return makeRequest(`/posts/${id}`)
}

export function createPost(post: PostFormType) {
	return makeRequest('/posts', {
		method: 'POST',
		data: post,
	})
}

//TODO: DELETE

//TODO: UPDATE

//UPVOTE / DOWNVOTE
