import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import { config } from 'dotenv';
config()

import userMiddleware from './middlewares/user.middleware';
import signatureMiddleware from './middlewares/signature.middleware';
import { APP, FASTIFY_CORS_CONFIG, FASTIFY_RATE_LIMIT_CONFIG_GLOBAL, ON_MESSAGE_HANDLER } from './constants';
import { userRoutes } from './routes/user.route';
import { signatureRoutes } from './routes/signature.route';
import { loadFrida, onMessage } from './utils/resolveFrida';
import { onReadyHook } from './hooks/onReady';

APP.register(fastifyCors, FASTIFY_CORS_CONFIG);
APP.register(fastifyRateLimit, FASTIFY_RATE_LIMIT_CONFIG_GLOBAL);

APP.register(userMiddleware);
APP.register(signatureMiddleware);
APP.register(userRoutes, { prefix: '/api/v1/users' });
APP.register(signatureRoutes, { prefix: '/api/v1/signature' });

APP.addHook('onReady', onReadyHook);

const start = async () => {
    await loadFrida();
    await APP.listen({ port: 3000 });
    onMessage(ON_MESSAGE_HANDLER);
    console.log('[+] Server started.');
};

start();