import { FastifyReply, FastifyRequest } from 'fastify';
import { GenerateECDSARequest, GetPublicKeyCredentialsParams } from './types';
import { signECDSA, hasAlias, createKeyPair, getCertificateChain, getElapsedRealtime } from '../utils/resolveFrida';
import { RESPONSE_TOPICS, UIDS_CACHE } from '../constants';
import { validate } from 'uuid';

export async function generateECDSA(req: GenerateECDSARequest, reply: FastifyReply) {
    if (!hasAlias(req.body.userId) || UIDS_CACHE.includes(req.body.userId)) return reply.status(403).send({ message: RESPONSE_TOPICS.FORBIDDEN });
    
    try {
        const generatedECDSA = await signECDSA(req.body.payload, req.body.userId);
        return reply.status(200).send({ message: RESPONSE_TOPICS.OK, ECDSA: generatedECDSA });
    } catch (error) {
        console.error(error);
        return reply.status(400).send({ message: RESPONSE_TOPICS.BAD_REQUEST, details: error });
    };
};

export async function getPublicKeyCredentials(req: FastifyRequest<{Params: GetPublicKeyCredentialsParams}>, reply: FastifyReply) {
    if (UIDS_CACHE.includes(req.params.userId) || !validate(req.params.userId)) return reply.status(400).send({ message: RESPONSE_TOPICS.BAD_REQUEST });
    if (!await hasAlias(req.params.userId)) await createKeyPair(req.params.userId);

    try {
        return reply.status(200).send({
            message: RESPONSE_TOPICS.OK,
            credentials: {
                key_chain: await getCertificateChain(req.params.userId),
                token: process.env.PLAY_INTEGRITY_TOKEN,
                timestamp: Date.now(),
                uid: req.params.userId
            }
        });
    } catch (error) {
        return reply.status(400).send({ message: RESPONSE_TOPICS.BAD_REQUEST, details: error });
    };
};

export async function getElapsedRealtimeRequest(_req: FastifyRequest, reply: FastifyReply) {
    return reply.status(200).send({ message: RESPONSE_TOPICS.OK, elapsedRealtime: await getElapsedRealtime() });    
};