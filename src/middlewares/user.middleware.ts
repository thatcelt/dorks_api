import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { RESPONSE_TOPICS } from '../constants';

const userMiddlewarePlugin = (fastify: FastifyInstance, _opts: Record<never, never>, done: () => void) => {
    fastify.decorate('adminAuthenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        if (request.headers.authorization !== process.env.BOT_API_KEY) return reply.code(403).send({ message: RESPONSE_TOPICS.FORBIDDEN });
    });

    done();
};

declare module 'fastify' {
    interface FastifyInstance {
        adminAuthenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
};

export default fp(userMiddlewarePlugin);