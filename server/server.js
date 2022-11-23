import fastify from 'fastify'
import dotenv from 'dotenv'
import sensible from '@fastify/sensible'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const app = fastify()
app.register(sensible)
// app.register(cors, {
// 	origin: process.env.CLIENT_URL,
// 	credentials: true,
// })

app.get('/', async (req, res) => {
	res.send('hello')
})

app.listen({ port: process.env.PORT })
