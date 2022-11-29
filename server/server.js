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
		// sets userId to current user id ('Me (Eamonn) by default')
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
		})
	)
})

// get post
app.get('/posts/:id', async (req, res) => {
	return await commitToDb(
		prisma.post.findUnique({
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
					select: COMMENT_SELECT_FIELDS,
				},
			},
		})
	)
})

app.post('/posts/:id/comments', async (req, res) => {
	//error
	if (req.body.message === '' || req.body.message === null) {
		return res.send(app.httpErrors.badRequest('Message is required'))
	}

	return await commitToDb(
		prisma.comment.create({
			data: {
				message: req.body.message,
				userId: req.cookies.userId,
				parentId: req.body.parentId,
				postId: req.params.id,
			},
			select: COMMENT_SELECT_FIELDS,
		})
	)
})

//error handling
async function commitToDb(promise) {
	const [error, data] = await app.to(promise)
	if (error) return app.httpErrors.internalServerError(error.message)
	return data
}

app.listen({ port: process.env.PORT })
