import { FastifyInstance } from 'fastify';
import { GenerateECDSARequestBody, GetPublicKeyCredentialsParams } from '../controllers/types';
import { generateECDSA, getElapsedRealtimeRequest, getPublicKeyCredentials } from '../controllers/signature.controller';
import { GenerateECDSASchema } from '../schemas';
import { FASTIFY_RATE_LIMIT_CONFIG } from '../constants';

export const signatureRoutes = (app: FastifyInstance) => {
    app.get<{ Params: GetPublicKeyCredentialsParams }>(
        '/credentials/:userId', { preHandler: [app.authenticate], config: { rateLimit: FASTIFY_RATE_LIMIT_CONFIG } }, getPublicKeyCredentials
    );
    app.get('/getElapsed', { preHandler: [app.authenticate] }, getElapsedRealtimeRequest);

    app.post<{ Body: GenerateECDSARequestBody }>('/ecdsa', { preHandler: [app.authenticate], schema: GenerateECDSASchema }, generateECDSA);
};