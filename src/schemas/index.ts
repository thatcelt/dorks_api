import { FastifySchema } from 'fastify';

export const addUserSchema: FastifySchema = {
    body: {
        type: 'object',
        properties: {
            userId: { type: 'string' },
            isActive: { type: 'boolean' }
        },
        required: ['userId', 'isActive']
    }
};

export const generateHMACSchema: FastifySchema = {
    body: {
        type: 'object',
        properties: {
            payload: { type: 'string' }
        },
        required: ['payload']
    }
};

export const GenerateECDSASchema: FastifySchema = {
    body: {
        type: 'object',
        properties: {
            userId: { type: 'string' },
            payload: { type: 'string' }
        },
        required: ['userId', 'payload']
    }
};

export const setActivitySchema: FastifySchema = {
    params: {
        type: 'object',
        properties: {
            isActive: { type: 'boolean' }
        },

        required: ['isActive']
    }
};

export const getUserSchema: FastifySchema = {
    params: {
        type: 'object',
        properties: {
            userId: { type: 'string' }
        },

        required: ['userId']
    }
};
