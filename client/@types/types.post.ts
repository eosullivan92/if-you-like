export type Post = {
	title: string
	body: string
	comments?: Comment[]
}

export type Comment = {
	id: string
	message: string
	parentId?: string
	createdAt: Date
	user: User
}

export type User = {
	id: string
	name: string
}
