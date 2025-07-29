import { FastifyRequest } from 'fastify';

export type SetActivityParams = { isActive: boolean }
export type GetUserParams = {  userId: string }
export type GetPublicKeyCredentialsParams = { userId: string }

export interface AddUserRequestBody {
    userId: string;
    isActive: boolean;
}

export interface AddUserRequest extends FastifyRequest {
    body: AddUserRequestBody
}

export interface SetActivityRequestBody {
    userId: string;
}

export interface SetActivityRequest extends FastifyRequest {
    body: SetActivityRequestBody
    params: SetActivityParams
}

export interface GenerateHMACRequestBody {
    payload: string;
}

export interface GenerateHMACRequest extends FastifyRequest {
    body: GenerateHMACRequestBody
}

export interface GenerateECDSARequestBody {
    userId: string;
    payload: string;
}

export interface GenerateECDSARequest extends FastifyRequest {
    body: GenerateECDSARequestBody
}
