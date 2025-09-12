import { writeFileSync } from 'fs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AddUserRequest, BlockUserRequest, GetUserParams, SetActivityRequest } from './types';
import { PRISMA, RESPONSE_TOPICS, UIDS_CACHE, USERS_CACHE } from '../constants';
import { ecnryptUniqueHash } from '../utils/cryptoUtils';
import { deleteEntry } from '../utils/resolveFrida';

export async function addUser(req: AddUserRequest, reply: FastifyReply) {
    if (await PRISMA.user.findFirst({ where: { id: req.body.userId } })) return reply.status(400).send({ message: RESPONSE_TOPICS.USER_ALREADY_EXISTS });

    const userData = await PRISMA.user.create({ data: { id: req.body.userId, isActive: req.body.isActive, apiKey: ecnryptUniqueHash(req.body.userId) } });
    USERS_CACHE.push(userData.apiKey);

    return reply.status(200).send({ message: RESPONSE_TOPICS.OK, user: userData });
};

export async function blockUser(req: BlockUserRequest, reply: FastifyReply) {
    if (req.body.uid) {
        if (UIDS_CACHE.includes(req.body.uid)) return reply.status(400).send({ message: RESPONSE_TOPICS.USER_ALREADY_EXISTS });

        UIDS_CACHE.push(req.body.uid);
        await deleteEntry(req.body.uid);
        writeFileSync('../uids.txt', UIDS_CACHE.join('\n'));

        return reply.status(200).send({ message: RESPONSE_TOPICS.OK });
    };

    if (req.body.userId) {
        if (!await PRISMA.user.findFirst({ where: { id: req.body.userId } })) return reply.status(404).send({ message: RESPONSE_TOPICS.USER_NOT_FOUND });
        
        await PRISMA.user.update({ where: { id: req.body.userId }, data: { isBlocked: true } })
        USERS_CACHE.splice(USERS_CACHE.indexOf(req.body.userId), 1);

        return reply.status(200).send({ message: RESPONSE_TOPICS.OK });
    };

    return reply.status(400).send({ message: RESPONSE_TOPICS.BAD_REQUEST });
};

export async function setActivity(req: SetActivityRequest, reply: FastifyReply) {
    if (!await PRISMA.user.findFirst({ where: { id: req.body.userId } })) return reply.status(404).send({ message: RESPONSE_TOPICS.USER_NOT_FOUND });

    const userData = await PRISMA.user.update({ where: { id: req.body.userId }, data: { isActive: req.params.isActive } });
    if (req.params.isActive) USERS_CACHE.push(userData.apiKey);
    else USERS_CACHE.splice(USERS_CACHE.indexOf(userData.apiKey), 1);

    return reply.status(200).send({ message: RESPONSE_TOPICS.OK, user: userData });
};

export async function getUser(req: FastifyRequest<{ Params: GetUserParams }>, reply: FastifyReply) {
    const userData = await PRISMA.user.findFirst({ where: { id: req.params.userId } });

    if (!userData) return reply.status(404).send({ message: RESPONSE_TOPICS.USER_NOT_FOUND });

    return reply.status(200).send({ message: RESPONSE_TOPICS.OK, user: userData });
};
