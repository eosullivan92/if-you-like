import axios from 'axios'
import { makeRequest } from './makeRequest'
import { PostFormType } from '../context/PostListContext'

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

export function deletePost(id: string) {
	return makeRequest(`/posts/${id}`, {
		method: 'DELETE',
	})
}

//TODO: UPDATE

export function updatePost(id: string, post: PostFormType) {
	return makeRequest(`/posts/${id}`, {
		method: 'PUT',
		data: post,
	})
}

//UPVOTE / DOWNVOTE
