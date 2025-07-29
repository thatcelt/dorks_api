import fastify from 'fastify';

import { PrismaClient } from '@prisma/client';
import { Message } from 'frida';
import { RateLimitPluginOptions } from '@fastify/rate-limit';

export const USERS_CACHE: Array<string> = [];

export const APP = fastify();
export const PRISMA = new PrismaClient();
export const ENCODER = new TextEncoder();

export const MAIN_PROCESS = 'Amino';
export const FRIDA_SCRIPT_PATH = '../scripts/signatures.js';
export const REFRESH_INTERVAIL_MILLIS = 1800000;

export const RESPONSE_TOPICS = {
    USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
    OK: 'OK',
    FORBIDDEN: 'FORBIDDEN',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    BAD_REQUEST: 'BAD_REQUEST',
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS'
};

export const ON_MESSAGE_HANDLER = (message: Message) => {
    if (message.type == 'send' && message.payload.token) process.env.PLAY_INTEGRITY_TOKEN = message.payload.token;
};

export const FASTIFY_RATE_LIMIT_CONFIG: RateLimitPluginOptions = {
    max: 5,
    timeWindow: 300000
};

export const FASTIFY_RATE_LIMIT_CONFIG_GLOBAL: RateLimitPluginOptions = {
    global: false,
    errorResponseBuilder(_, context) {
        return {
            message: RESPONSE_TOPICS.TOO_MANY_REQUESTS,
            expiresIn: context.ttl
        }
    }
};

export const FASTIFY_CORS_CONFIG = {
    methods: ['POST', 'GET', 'PATCH', 'DELETE'],
    origin: '*'
};
