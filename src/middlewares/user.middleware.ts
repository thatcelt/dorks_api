import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

const userMiddlewarePlugin = (fastify: FastifyInstance, _opts: Record<never, never>, done: () => void) => {
    fastify.decorate('adminAuthenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        if (request.headers.authorization !== process.env.BOT_API_KEY) return reply.code(403).send({ message: "FORBIDDEN" })
    });

    done();
};

declare module 'fastify' {
    interface FastifyInstance {
        adminAuthenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
};

export default fp(userMiddlewarePlugin);