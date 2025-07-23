import { FastifyInstance } from 'fastify';
import { GenerateECDSARequestBody, GenerateHMACRequestBody } from '../controllers/types';
import { generateECDSA, generateHMAC } from '../controllers/signature.controller';
import { GenerateECDSASchema, generateHMACSchema } from '../schemas';

export const signatureRoutes = (app: FastifyInstance) => {
    app.post<{ Body: GenerateHMACRequestBody }>('/hmac', { preHandler: [app.authenticate], schema: generateHMACSchema }, generateHMAC);
    app.post<{ Body: GenerateECDSARequestBody }>('/ecdsa', { preHandler: [app.authenticate], schema: GenerateECDSASchema }, generateECDSA);
}