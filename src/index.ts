import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
config({ path: '../.env' })

import userMiddleware from './middlewares/user.middleware';
import signatureMiddleware from './middlewares/signature.middleware';
import { APP, FASTIFY_CORS_CONFIG, FASTIFY_RATE_LIMIT_CONFIG_GLOBAL, IPS_CACHE, LINKS_CACHE, ON_MESSAGE_HANDLER, UIDS_CACHE } from './constants';
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
    UIDS_CACHE.push(...readFileSync('../uids.txt', 'utf-8').split('\n'));
    LINKS_CACHE.push(...readFileSync('../links.txt', 'utf-8').split('\n'));
    if (LINKS_CACHE.length == 1 && LINKS_CACHE[0] == '') LINKS_CACHE.length = 0;
    IPS_CACHE.push(...readFileSync('../ips.txt', 'utf-8').split('\n'));

    await loadFrida();
    await APP.listen({ port: 3000, host: '0.0.0.0' });
    onMessage(ON_MESSAGE_HANDLER);
    console.log('[+] Server started.');
};

start();