import fastify from 'fastify'
import dotenv from 'dotenv'
import sensible from '@fastify/sensible'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
dotenv.config()

const app = fastify()
app.register(sensible)

app.register(cors, {
	origin: process.env.CLIENT_URL,
	credentials: true,
})

// FAKING AUTHENTICATION
app.register(cookie, { secret: process.env.COOKIE_SECRET })
app.addHook('onRequest', (req, res, done) => {
	if (req.cookies.userId !== CURRENT_USER_ID) {
		req.cookies.userId = CURRENT_USER_ID
		res.clearCookie('userId')
		res.setCookie('userId', CURRENT_USER_ID)
	}
	done()
})
const CURRENT_USER_ID = (
	await prisma.user.findFirst({ where: { name: 'Eamonn' } })
).id

const COMMENT_SELECT_FIELDS = {
	id: true,
	message: true,
	parentId: true,
	createdAt: true,
	user: {
		select: {
			id: true,
			name: true,
		},
	},
}

// get posts
app.get('/posts', async (req, res) => {
	return await commitToDb(
		prisma.post.findMany({
			select: {
				id: true,
				title: true,
			},
			// orderBy: { createdAt: 'desc' },
		})
	)
})

// get post
app.get('/posts/:id', async (req, res) => {
	return await commitToDb(
		prisma.post
			.findUnique({
				where: {
					id: req.params.id,
				},
				select: {
					body: true,
					title: true,
					comments: {
						orderBy: {
							createdAt: 'desc',
						},
						select: {
							...COMMENT_SELECT_FIELDS,
							_count: { select: { likes: true } },
						},
					},
				},
			})
			.then(async (post) => {
				const likes = await prisma.like.findMany({
					where: {
						userId: req.cookies.userId,
						//returns id's of all comments
						commentId: {
							in: post.comments.map((comment) => comment.id),
						},
					},
				})
				return {
					...post,
					comments: post.comments.map((comment) => {
						const { _count, ...commentFields } = comment
						return {
							...commentFields,
							// boolean - if like in this list has comment id that matches the current comment id.
							likedByMe: likes.find(
								(like) => like.commentId === comment.id
							),
							likeCount: _count.likes,
						}
					}),
				}
			})
	)
})

app.post('/posts', async (req, res) => {
	if (req.body.body === '' || req.body.body === null) {
		return res.send(app.httpErrors.badRequest('Message is required'))
	}

	if (req.body.title === '' || req.body.title === null) {
		return res.send(app.httpErrors.badRequest('Title is required'))
	}

	return await commitToDb(
		prisma.post.create({
			data: {
				title: req.body.title,
				body: req.body.body,
				userId: req.cookies.userId,
			},
			select: {
				id: true,
				title: true,
			},
		})
	)
})

app.delete('/posts/:id', async (req, res) => {
	const { userId } = await prisma.post.findUnique({
		where: { id: req.params.id },
		select: { userId: true },
	})

	// auth check
	if (userId !== req.cookies.userId) {
		return res.send(
			app.httpErrors.unauthorized(
				'You do not have permission to delete this post'
			)
		)
	}

	return await commitToDb(
		prisma.post.delete({
			where: { id: req.params.id },
			select: { id: true },
		})
	)
})

app.put(`/posts/:id`, async (req, res) => {
	if (req.body.body === '' || req.body.body === null) {
		return res.send(app.httpErrors.badRequest('Message is required'))
	}

	if (req.body.title === '' || req.body.title === null) {
		return res.send(app.httpErrors.badRequest('Title is required'))
	}

	const { userId } = await prisma.post.findUnique({
		where: { id: req.params.id },
		select: { userId: true },
	})

	if (userId !== req.cookies.userId) {
		return res.send(
			app.httpErrors.unauthorized(
				'You do not have permission to delete this post'
			)
		)
	}
	return await commitToDb(
		prisma.post.update({
			where: { id: req.params.id },
			data: { title: req.body.title, body: req.body.body },
			select: { id: true, title: true, body: true },
		})
	)
})

app.post('/posts/:id/comments', async (req, res) => {
	//error
	if (req.body.message === '' || req.body.message === null) {
		return res.send(app.httpErrors.badRequest('Message is required'))
	}

	return await commitToDb(
		prisma.comment
			.create({
				data: {
					message: req.body.message,
					userId: req.cookies.userId,
					parentId: req.body.parentId,
					postId: req.params.id,
				},
				select: COMMENT_SELECT_FIELDS,
			})
			.then((comment) => {
				return {
					// brand new comment has no likes
					...comment,
					likeCount: 0,
					likedByMe: false,
				}
			})
	)
})

app.put('/posts/:id/comments/:commentId', async (req, res) => {
	//error check
	if (req.body.message == '' || req.body.message == null) {
		return res.send(app.httpErrors.badRequest('Message is required'))
	}

	const { userId } = await prisma.comment.findUnique({
		where: { id: req.params.commentId },
		select: { userId: true },
	})

	// auth check
	if (userId !== req.cookies.userId) {
		return res.send(
			app.httpErrors.unauthorized(
				'You do not have permission to edit this comment'
			)
		)
	}

	return await commitToDb(
		prisma.comment.update({
			where: { id: req.params.commentId },
			data: { message: req.body.message },
			select: { message: true },
		})
	)
})

app.delete('/posts/:id/comments/:commentId', async (req, res) => {
	const { userId } = await prisma.comment.findUnique({
		where: { id: req.params.commentId },
		select: { userId: true },
	})

	// auth check
	if (userId !== req.cookies.userId) {
		return res.send(
			app.httpErrors.unauthorized(
				'You do not have permission to delete this comment'
			)
		)
	}

	return await commitToDb(
		prisma.comment.delete({
			where: { id: req.params.commentId },
			select: { id: true },
		})
	)
})

app.post('/posts/:id/comments/:commentId/toggleLike', async (req, res) => {
	const data = {
		commentId: req.params.commentId,
		userId: req.cookies.userId,
	}

	const like = await prisma.like.findUnique({
		where: { userId_commentId: data },
	})

	if (like == null) {
		return await commitToDb(prisma.like.create({ data })).then(() => {
			return { addLike: true }
		})
	} else {
		return await commitToDb(
			prisma.like.delete({ where: { userId_commentId: data } })
		).then(() => {
			return { addLike: false }
		})
	}
})

//error handling
async function commitToDb(promise) {
	const [error, data] = await app.to(promise)
	if (error) return app.httpErrors.internalServerError(error.message)
	return data
}

app.listen({ port: process.env.PORT })
