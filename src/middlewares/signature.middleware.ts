import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { IPS_CACHE, RESPONSE_TOPICS, USERS_CACHE } from '../constants';

const signatureMiddlewarePlugin = (fastify: FastifyInstance, _opts: Record<never, never>, done: () => void) => {
    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        if (!request.headers.authorization || !USERS_CACHE.includes(request.headers.authorization) || IPS_CACHE.includes(request.ip)) return reply.code(403).send({ message: RESPONSE_TOPICS.FORBIDDEN });
        done();
    });

    done();
};

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
};

export default fp(signatureMiddlewarePlugin);