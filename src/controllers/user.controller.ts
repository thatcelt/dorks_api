import { FastifyReply, FastifyRequest } from 'fastify';
import { AddUserRequest, GetUserParams, SetActivityRequest } from './types';
import { PRISMA, RESPONSE_TOPICS, USERS_CACHE } from '../constants';
import { ecnryptUniqueHash } from '../utils/cryptoUtils';

export async function addUser(req: AddUserRequest, reply: FastifyReply) {
    if (await PRISMA.user.findFirst({ where: { id: req.body.userId } })) return reply.status(400).send({ message: RESPONSE_TOPICS.USER_ALREADY_EXISTS });

    const userData = await PRISMA.user.create({ data: { id: req.body.userId, isActive: req.body.isActive, apiKey: ecnryptUniqueHash(req.body.userId) } });
    USERS_CACHE.push(userData.apiKey);

    return reply.status(200).send({ message: RESPONSE_TOPICS.OK, user: userData });
};

export async function setActivity(req: SetActivityRequest, reply: FastifyReply) {
    if (!await PRISMA.user.findFirst({ where: { id: req.body.userId } })) return reply.status(404).send({ message: RESPONSE_TOPICS.USER_NOT_FOUND });

    const userData = await PRISMA.user.update({ where: { id: req.body.userId }, data: { isActive: req.params.isActive } });
    try {
        if (req.params.isActive) USERS_CACHE.push(userData.apiKey);
        else USERS_CACHE.splice(USERS_CACHE.indexOf(userData.apiKey), 1);
    } catch (error) {
        console.error(error);
    };

    return reply.status(200).send({ message: RESPONSE_TOPICS.OK, user: userData });
};

export async function getUser(req: FastifyRequest<{ Params: GetUserParams }>, reply: FastifyReply) {
    const userData = await PRISMA.user.findFirst({ where: { id: req.params.userId } });

    if (!userData) return reply.status(404).send({ message: RESPONSE_TOPICS.USER_NOT_FOUND });

    return reply.status(200).send({ message: RESPONSE_TOPICS.OK, user: userData });
};
