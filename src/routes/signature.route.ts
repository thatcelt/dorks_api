import { FastifyInstance } from 'fastify';
import { GenerateECDSARequestBody, GenerateHMACRequestBody, GetPublicKeyCredentialsParams } from '../controllers/types';
import { generateECDSA, generateHMAC, getPublicKeyCredentials } from '../controllers/signature.controller';
import { GenerateECDSASchema, generateHMACSchema } from '../schemas';
import { FASTIFY_RATE_LIMIT_CONFIG } from '../constants';

export const signatureRoutes = (app: FastifyInstance) => {
    app.get<{ Params: GetPublicKeyCredentialsParams }>(
        '/credentials/:userId', { preHandler: [app.authenticate], config: { rateLimit: FASTIFY_RATE_LIMIT_CONFIG } }, getPublicKeyCredentials
    );

    app.post<{ Body: GenerateHMACRequestBody }>('/hmac', { preHandler: [app.authenticate], schema: generateHMACSchema }, generateHMAC);
    app.post<{ Body: GenerateECDSARequestBody }>('/ecdsa', { preHandler: [app.authenticate], schema: GenerateECDSASchema }, generateECDSA);
};