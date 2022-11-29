import { makeRequest } from './makeRequest'

type CreatCommentProps = {
	postId: string
	message: string
	parentId: string
}

export function createComment({
	postId,
	message,
	parentId,
}: CreatCommentProps) {
	return makeRequest(`post/${postId}/comments`, {
		method: 'POST',
		data: { message, parentId },
	})
}
