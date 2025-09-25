import { FastifyReply, FastifyRequest } from 'fastify';
import { GenerateECDSARequest, GetPublicKeyCredentialsParams } from './types';
import { signECDSA, hasAlias, createKeyPair, getCertificateChain, getElapsedRealtime, deleteEntry } from '../utils/resolveFrida';
import { IPS_CACHE, LINKS_CACHE, PRISMA, RESPONSE_TOPICS, UIDS_CACHE, USERS_CACHE } from '../constants';
import { validate } from 'uuid';
import { writeFileSync } from 'fs';

const hasLinks = (payload: string): boolean => {
    for (const link of LINKS_CACHE) {
        if (payload.includes(link)) return true;
    };
    return false;
};


export async function generateECDSA(req: GenerateECDSARequest, reply: FastifyReply) {
    if (UIDS_CACHE.includes(req.body.userId)) return reply.status(403).send({ message: RESPONSE_TOPICS.FORBIDDEN });

    if (hasLinks(req.body.payload)) {
        const user = await PRISMA.user.findFirst({ where: { apiKey: req.headers.authorization } });

        await PRISMA.user.update({ where: { id: user?.id }, data: { isBlocked: true } });
        USERS_CACHE.splice(USERS_CACHE.indexOf(req.headers.authorization!), 1);
        UIDS_CACHE.push(req.body.userId);
        IPS_CACHE.push(req.ip);
        await deleteEntry(req.body.userId);
        writeFileSync('../uids.txt', UIDS_CACHE.join('\n'));
        writeFileSync('../ips.txt', IPS_CACHE.join('\n'));

        return reply.status(403).send({ message: RESPONSE_TOPICS.FORBIDDEN });
    };
    
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