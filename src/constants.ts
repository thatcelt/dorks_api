import fastify from 'fastify';

import { PrismaClient } from '@prisma/client';

export const USERS_CACHE: Array<string> = [];

export const APP = fastify();
export const PRISMA = new PrismaClient();
export const ENCODER = new TextEncoder();

export const MAIN_PROCESS = "Amino"
export const FRIDA_SCRIPT_PATH = "../scripts/signatures.js";
export const REFRESH_INTERVAIL_MILLIS = 1800000

export const RESPONSE_TOPICS = {
    USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
    OK: 'OK',
    FORBIDDEN: 'FORBIDDEN',
    USER_NOT_FOUND: 'USER_NOT_FOUND'
}
