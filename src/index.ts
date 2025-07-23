import fastifyCors from '@fastify/cors';
import { config } from 'dotenv';
config()

import { APP } from './constants';
import { userRoutes } from './routes/user.route';
import { signatureRoutes } from './routes/signature.route';

import userMiddleware from './middlewares/user.middleware';
import { loadFrida } from './utils/resolveFrida';
import { onReadyHook } from './hooks/onReady';
import signatureMiddleware from './middlewares/signature.middleware';

APP.register(fastifyCors, {
    methods: ['POST', 'GET', 'PATCH', 'DELETE'],
    origin: '*'
});

APP.register(userMiddleware);
APP.register(signatureMiddleware)
APP.register(userRoutes, { prefix: '/api/v1/users' });
APP.register(signatureRoutes, { prefix: '/api/v1/signature' });

APP.addHook('onReady', onReadyHook);

const start = async () => {
    await APP.listen({ port: 3000 });
    await loadFrida()
    console.log('[+] Server started.');
};

start();