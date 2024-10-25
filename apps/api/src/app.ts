import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { env } from './env'
import { errorHandler } from './http/error-handler'
import { authenticateWithPassword } from './http/routes/auth/authenticate-with-password'
import { createAccount } from './http/routes/auth/create-account'
import { getProfile } from './http/routes/auth/get-profile'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack Saas app with mul-tenant & RBAC.',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setErrorHandler(errorHandler)

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
