import fastify from 'fastify'
import dotenv from 'dotenv'
import sensible from '@fastify/sensible'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
dotenv.config()

const app = fastify()
app.register(sensible)
app.register(cors, {
	origin: process.env.CLIENT_URL,
	credentials: true,
})

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
					select: {
						...COMMENT_SELECT_FIELDS,
					},
				},
			},
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
